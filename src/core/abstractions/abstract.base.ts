import { BusTransaction, EventBusEnabled, SentFrom } from '../../bus.api';
import { AbstractCore } from './abstract.core';
import { RestOperation, RestOperations } from '../services/rest/rest.operations';


/**
 * Provides any class access to the EventBus, Rest Operations and higher level operations.
 */

export abstract class AbstractBase extends AbstractCore implements EventBusEnabled {

    protected name: string;
    private restOperations: RestOperations;

    protected restServiceRequest(operation: RestOperation, from?: SentFrom): BusTransaction {
        return this.restOperations.restServiceRequest(operation, from);

    }
    protected setGlobalHttpHeaders(headers: any, from?: SentFrom) {
        this.restOperations.setGlobalHttpHeaders(headers, from);

    }

    getName(): string {
        return this.name;
    }

    protected constructor(name: string) {
        super();
        this.restOperations = RestOperations.getInstance();
        this.name = name;
    }

}
