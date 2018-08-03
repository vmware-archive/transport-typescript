import { MessageArgs } from '../../bus.api';
import { AbstractBase } from './abstract.base';
import { HttpRequest, RestError } from '../services/rest/rest.model';

export const SERVICE_ERROR = 505;
export type RequestorArguments = MessageArgs;

const HTTP_REQUEST_MAP: Array<[string, HttpRequest]> = [
    ['GET', HttpRequest.Get],
    ['POST', HttpRequest.Post],
    ['PATCH', HttpRequest.Patch],
    ['PUT', HttpRequest.Put],
    ['DELETE', HttpRequest.Delete]
];

/**
 * This is an abstract service that encapsulates messagebus handling and implements some
 * of the more commonly used methods by the derived services. The derived classes provide
 * handlers for when a all is received or when there is a response from a ReST all.
 * The error handler can be overridden in the derived class.
 *
 * ReqT is the type of the all payload to the service (e.g. RolesRequestObject)
 * RespT is the type of the response payload from the service (e.g. RolesResponseObject)
 */
export abstract class AbstractService<ReqT, RespT> extends AbstractBase {
    protected serviceError: RestError;

    private requestConverterMap: Map<string, HttpRequest>;

    /**
     * super()
     *
     * @param name - name of the derived service (e.g. 'task.service'
     * @param bus - reference to the messagebus service instance
     * @param requestChannel - channel on which to listen for requests for the derived service
     */
    protected constructor(name: string, requestChannel: string) {

        super(name);
        this.serviceError = new RestError('Invalid Service Request!', SERVICE_ERROR, '');
        this.requestConverterMap = new Map<string, HttpRequest>(HTTP_REQUEST_MAP);

        this.bus.listenRequestStream(requestChannel, this.getName())
            .handle((requestObject: ReqT, args: RequestorArguments) => {

                this.handleServiceRequest(requestObject, args);
            });
    }

    // Required method in the derived service
    protected abstract handleServiceRequest(requestObject: ReqT, requestArgs?: MessageArgs): void;

    /**
     * RestError to use for invalid requests
     *
     * @returns {RestError}
     */
    protected get serviceRequestError(): RestError {
        return this.serviceError;
    }

    // /**
    //  * This method is called to send an asynchronous HTTP all and will call the respective handlers
    //  * in the derived class when the HTTP returns.
    //  * Each all gets its own message stream and handles the unsubscribe() here as requestOnce() cannot
    //  * concurrently use the same channel.
    //  *
    //  * @param {string} uri URL target for HTTP
    //  * @param {HttpRequest} method HttpRequest enum
    //  * @param {ReqT} serviceRequestObject service-specific all object to pass back to restResponseHandler
    //  * @param body payload for POST, PATCH, PUT
    //  * @param {HttpParams} params optional HttpParams
    //  * @param {RequestorArguments} optional aruments from the requestor to allow access to id and versions.
    //  */
    // protected restRequest(
    //     uri: string, method: HttpRequest, serviceRequestObject: ReqT, body?: any,
    //     params?: HttpParams, args?: RequestorArguments): BusTransaction {
    //
    //     const restRequestObject: RestObject = new RestObject(method, uri, RestChannel.all, body, params);
    //     let id: UUID;
    //
    //     if (args) {
    //         id = args.uuid;
    //     } else {
    //         id = GeneralUtil.genUUIDShort();
    //     }
    //     const transaction = this.bus.createTransaction(TransactionType.ASYNC, 'service-api-request-' + id);
    //     transaction.sendRequest(RestChannel.all, restRequestObject);
    //
    //     transaction.onComplete(
    //         (restResponseObject: RestObject[]) => {
    //             this.log.debug('Received REST response: ' + restResponseObject[0].response, this.getName());
    //             this.handleRestResponse(serviceRequestObject, restResponseObject[0].response);
    //         }
    //     );
    //
    //     transaction.onError<RestError>(
    //         (error: RestError) => {
    //             this.handleRestError(serviceRequestObject, error);
    //         }
    //     );
    //
    //     transaction.commit();
    //     return transaction;
    //
    // }

    // // These are partially specialized for services that do not make ReST calls
    // protected handleRestResponse(serviceRequestObject: ReqT, responseJson: any) {
    //     this.log.error('Service performed a ReST all without overriding response handler!', this.getName());
    // }
    //
    // protected handleRestError(serviceRequestObject: ReqT, err: RestError) {
    //     this.log.error('Service performed a ReST all without overriding error handler!', this.getName());
    // }

    /**
     *  Method to send a response object to the client of the service
     * @param {string} channel to respond to
     * @param {RespT} responseObject response object to send
     * @param {MessageArgs} args optional arguments to pass.
     */
    protected postResponse(channel: string, responseObject: RespT, args?: MessageArgs): void {
        if (args) {
            this.bus.sendResponseMessageWithIdAndVersion(channel, responseObject, args.uuid, args.version, args.from);
        } else {
            this.bus.sendResponseMessage(channel, responseObject, this.getName());
        }
    }

    /**
     * Method to send a RestError to the client of the service
     * @param {string} channel channel to sent error to.
     * @param {RestError} err returned from rest service.
     */
    protected postError(channel: string, err: RestError): void {
        this.bus.sendErrorMessage(channel, err, this.getName());
    }
}
