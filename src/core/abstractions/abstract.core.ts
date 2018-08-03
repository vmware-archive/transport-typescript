/**
 * Provides any class access to the EventBus, StoreManager and Logger.
 */
import { EventBus } from '../../bus.api';
import { BusStoreApi } from '../../store.api';
import { Logger } from '../../log/index';

export abstract class AbstractCore {
    protected readonly bus: EventBus;
    protected readonly storeManager: BusStoreApi;
    protected readonly log: Logger;

    constructor() {
        const globalAccessor = window; // todo: pull from environment, window is not to be hardcoded
        this.bus = globalAccessor.AppEventBus;
        this.storeManager = globalAccessor.AppStoreManager;
        this.log = globalAccessor.AppSyslog;
    }
}