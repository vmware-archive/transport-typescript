/**
 * Provides any class access to the EventBus, StoreManager and Logger.
 */
import { EventBus } from '../../bus.api';
import { BusStoreApi } from '../../store.api';
import { Logger } from '../../log/index';
import { BusUtil } from '../../util/bus.util';

export abstract class AbstractCore {
    protected readonly bus: EventBus;
    protected readonly storeManager: BusStoreApi;
    protected readonly log: Logger;

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.storeManager = this.bus.stores;
        this.log = this.bus.logger;
    }
}