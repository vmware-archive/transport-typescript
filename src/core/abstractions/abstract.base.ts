import { EventBusEnabled, MessageFunction } from '../../bus.api';
import { UUID } from '../../bus';
import { AbstractCore } from './abstract.core';



export interface OperationRequest {
    id: UUID;
    uri: string;
    method: any;
    body?: any;
    params?: any;
    args?: any;
    successHandler?: MessageFunction<any>;
    errorHandler?: MessageFunction<any>;
}

/**
 * Provides any class access to the EventBus and higher level operations.
 */
export abstract class AbstractBase extends AbstractCore implements EventBusEnabled {

    protected name: string;

    getName(): string {
        return this.name;
    }

    protected constructor(name: string) {
        super();
        this.name = name;
    }

    // protected restServiceRequest(command: OperationRequest, from: SentFrom = this.name): BusTransaction {
    //
    //     const restRequestObject: RestObject
    //         = new RestObject(command.method, command.uri, RestChannel.all, command.body, command.params);
    //
    //     this.log.debug("restServiceRequest fired for URI: " + command.uri + " with id: " + command.id, from);
    //
    //     let id: UUID;
    //
    //     if (command.args) {
    //         id = command.args.uuid;
    //     } else {
    //         id = GeneralUtil.genUUIDShort();
    //     }
    //     const transaction = this.bus.createTransaction(TransactionType.ASYNC, 'component-api-command-' + id);
    //     transaction.sendRequest(RestChannel.all, restRequestObject);
    //
    //     transaction.onComplete(
    //         (restResponseObject: RestObject[]) => {
    //             this.log.debug('Received REST response: ' + restResponseObject[0].response, this.getName());
    //             command.successHandler(restResponseObject[0].response);
    //         }
    //     );
    //
    //     transaction.onError<RestError>(
    //         (error: RestError) => {
    //             command.errorHandler(error);
    //         }
    //     );
    //
    //     transaction.commit();
    //     return transaction;
    //
    // }
}
