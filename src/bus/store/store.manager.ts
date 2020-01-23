import { BusStoreApi, BusStore, StoreReadyResult } from '../../store.api';
import { StoreType, UUID } from './store.model';
import { StoreImpl } from './store';
import { EventBus } from '../../bus.api';
import { GeneralUtil } from '../../util/util';

/**
 * Copyright(c) VMware Inc. 2016-2019
 */
export class StoreManager implements BusStoreApi {

    private galacticStoreSyncChannel: string;

    private internalStoreMap: Map<string, BusStore<any>>;
    
    constructor(private bus: EventBus) {
        // Store map.
        this.internalStoreMap = new Map<StoreType, BusStore<any>>();
    }

    openGalacticStore<T>(objectType: StoreType, brokerIdentity?: string): BusStore<T> {
        this.initGalacticStoreSyncChannel(brokerIdentity);
        if (!this.getStore(objectType)) {
            this.bus.logger.verbose(`Store: Opening galactic store ${objectType} as it does not exist!`);
            const store: BusStore<T> = new StoreImpl<T>(this.bus, objectType, this.galacticStoreSyncChannel);
            this.internalStoreMap.set(objectType, store);
            return store;
        } else {
            const store: BusStore<T> = this.getStore(objectType);
            if (!store.isGalacticStore()) {
                this.bus.logger.error('openGalacticStore() called with already existing local store!');
            }
            this.bus.logger.verbose(`Stores: Returning reference to ${objectType} as it already exists`);
            return store;
        }
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
            const store: BusStore<T> = this.getStore(objectType);
            if (store.isGalacticStore()) {
                this.bus.logger.error('createStore() called with already existing galactic store!');
            }
            this.bus.logger.verbose(`Stores: Returning reference to ${objectType} as it already exists`);
            return store;
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
            const store = this.internalStoreMap.get(objectType);
            (store as StoreImpl<any>).closeStore();
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

    private initGalacticStoreSyncChannel(brokerIdentity?: string) {
        if (this.galacticStoreSyncChannel) {
            return;
        }
        // Generate unique fabric-store-sync galactic channel name and open
        // the galactic channel.
        this.galacticStoreSyncChannel = 'fabric-store-sync.' +
              Date.now().toString(32) + '-' + GeneralUtil.genUUID();
        this.bus.markChannelAsGalactic(this.galacticStoreSyncChannel, brokerIdentity);
    }
}
