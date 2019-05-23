import { BusStoreApi, BusStore, StoreReadyResult } from '../../store.api';
import { StoreType, UUID } from './store.model';
import { StoreImpl } from './store';
import { EventBus } from '../../bus.api';

/**
 * Copyright(c) VMware Inc. 2016-2019
 */
export class StoreManager implements BusStoreApi {
    
    private internalStoreMap: Map<string, BusStore<any>>;
    
    constructor(private bus: EventBus) {
       
        // Store map.
        this.internalStoreMap = new Map<StoreType, BusStore<any>>();
    }
    
    public createStore<T>(objectType: StoreType, map?: Map<UUID, T>): BusStore<T> {
        if (!this.getStore(objectType)) {
            this.bus.logger.verbose(`Store: Creating store ${objectType} as it does not exist!`);
            const store: BusStore<T> = new StoreImpl<T>(this.bus, objectType);
            if (map) {
                store.populate(map);
            }
            this.internalStoreMap.set(objectType, store);
            return store;
        } else {
            this.bus.logger.verbose(`Stores: Returning reference to ${objectType} as it already exists`);
            return this.getStore(objectType);
        }
    }

    public getStore<T>(objectType: StoreType): BusStore<T> {
        return this.internalStoreMap.get(objectType);
    }

    public getAllStores(): Array<BusStore<any>> {
        return Array.from(this.internalStoreMap.values());
    }

    public wipeAllStores(): void {
        this.internalStoreMap.forEach(
            (store: BusStore<any>) => {
                store.reset();
            }
        );
        this.bus.logger.warn(`🗄️ Stores: All data has been wiped out and reset.`, 'StoreManager');
    }

    public destroyStore(objectType: StoreType): boolean {
        if (this.internalStoreMap.has(objectType)) {
            this.internalStoreMap.delete(objectType);
            return true;
        }
        return false;
    }

    public readyJoin(stores: StoreType[]): StoreReadyResult {
       
        return {
            whenReady: (handler: Function) => {
                let storesReady = 0;
                for (let store of stores) {
                    this.createStore(store).whenReady(() => {
                        storesReady++;

                        if (storesReady === stores.length) {
                            handler(Array.from(this.internalStoreMap.values()));
                        }
                    });
                }
            }
        };
    }
}
