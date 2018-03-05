import { BusStoreApi, BusStore, StoreReadyResult } from '../cache.api';
import { StoreType, UUID } from './cache.model';
import { StoreImpl } from './cache';
import { EventBus } from '../bus.api';

/**
 * Copyright(c) VMware Inc. 2016-2018
 */
export class StoreManager implements BusStoreApi {
    
    private internalStoreMap: Map<string, BusStore<any>>;
    
    constructor(private bus: EventBus) {
       
        // Store map.
        this.internalStoreMap = new Map<StoreType, BusStore<any>>();
    }
    
    public createStore<T>(objectType: StoreType, map?: Map<UUID, T>): BusStore<T> {
        if (!this.getStore(objectType)) {
            const cache: BusStore<T> = new StoreImpl<T>(this.bus);
            if (map) {
                cache.populate(map);
            }
            this.internalStoreMap.set(objectType, cache);
            return cache;
        } else {
            return this.getStore(objectType);
        }
    }

    public getStore<T>(objectType: StoreType): BusStore<T> {
        return this.internalStoreMap.get(objectType);
    }

    public destroyStore(objectType: StoreType): boolean {
        if (this.internalStoreMap.has(objectType)) {
            this.internalStoreMap.delete(objectType);
            return true;
        }
        return false;
    }

    public readyJoin(caches: string[]): StoreReadyResult {
        throw new Error('Method not implemented.');
    }
}