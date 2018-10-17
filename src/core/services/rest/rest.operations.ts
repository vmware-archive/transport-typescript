import { AbstractCore } from '../../abstractions/abstract.core';
import { BusTransaction, MessageFunction, SentFrom, TransactionType } from '../../../bus.api';
import { UUID } from '../../../bus';
import { HttpRequest, RestError, RestObject } from './rest.model';
import { GeneralUtil } from '../../../util/util';
import { RestService } from './rest.service';

export interface RestOperation {
    id?: UUID;
    uri: string;
    method: HttpRequest;
    body?: any;
    pathParams?: any;
    queryParams?: any;
    headers?: any;
    successHandler: MessageFunction<any>;
    errorHandler?: MessageFunction<any>;
}


export class RestOperations extends AbstractCore {

    protected static _instance: RestOperations;

    /**
     * Kill instance of service.
     */
    public static destroy(): void {
        this._instance = null;
    }

    public static getInstance(): RestOperations {
        return this._instance || (this._instance = new RestOperations());
    }

    constructor() {
        super();
    }

    public setGlobalHttpHeaders(headers: any, from: SentFrom) {

        const restRequestObject: RestObject = new RestObject(
            HttpRequest.UpdateGlobalHeaders,
            null,
            null,
            headers
        );

        this.bus.sendRequestMessage(RestService.channel, restRequestObject, from);
    }

    public restServiceRequest(operation: RestOperation, from: SentFrom): BusTransaction {

        const body = (operation.body ? operation.body : {});
        const headers = (operation.headers ? operation.headers : {});
        const queryParams = (operation.queryParams ? operation.queryParams : {});
        const pathParams = (operation.pathParams ? operation.pathParams : {});

        const restRequestObject: RestObject = new RestObject(
            operation.method,
            operation.uri,
            body,
            headers,
            queryParams,
            pathParams
        );

        let id: UUID;

        if (operation.id) {
            id = operation.id;
        } else {
            id = GeneralUtil.genUUIDShort();
        }

        this.log.debug(`restServiceRequest fired for URI: ${operation.uri} with id: ${id}`, from);

        const transaction = this.bus.createTransaction(TransactionType.ASYNC, 'rest-operations-' + id);
        transaction.sendRequest(RestService.channel, restRequestObject);

        transaction.onComplete(
            (restResponseObject: RestObject[]) => {
                this.log.debug(
                    `Received REST response for request: ${restResponseObject[0].request} ${restResponseObject[0].uri}`
                    , from);
                operation.successHandler(restResponseObject[0].response);
            }
        );

        if (operation.errorHandler) {
            transaction.onError<RestError>(
                (error: RestError) => {
                    operation.errorHandler(error);
                }
            );
        }

        transaction.commit();
        return transaction;
    }

}