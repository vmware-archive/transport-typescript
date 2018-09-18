/**
 * Provides any class access to the EventBus, StoreManager and Logger.
 */
import { EventBus } from '../../bus.api';
import { BusStoreApi } from '../../store.api';
import { Logger } from '../../log/index';
import { BusUtil } from '../../util/bus.util';

export abstract class AbstractCore {
    public readonly bus: EventBus;
    public readonly storeManager: BusStoreApi;
    public readonly log: Logger;

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.storeManager = this.bus.stores;
        this.log = this.bus.logger;
    }
}