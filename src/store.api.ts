/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { MessageFunction } from './bus.api';
import { Subscription } from 'rxjs';
import { UUID, StoreType } from './bus/store/store.model';

/**
 * StoreStream wraps an Observable, allowing for future underlying logic manipulation without
 * worrying about breaking API's.
 */
export interface StoreStream<T, E = any> {
    /**
     * Subscribe to Observable stream.
     * @param {MessageFunction<T>} successHandler function to handle ticks on stream
     * @returns {Subscription} subscription to stream.
     */
    subscribe(successHandler: MessageFunction<T>): Subscription;

    /**
     * Unsubscribe from Observable stream.
     */
    unsubscribe(): void;
}

/**
 * StoreReadyResult is returned by a readyJoin call on a store.
 */
export interface StoreReadyResult {

    /**
     * Called when all stores are ready.
     * @param {Function} handler the handler function you to fire when all required stores are ready
     */
    whenReady(handler: Function): void;
}

/**
 * MutateStream allows mutating services to send back success or failure events to requesting actors.
 */
export interface MutateStream<T = any, E = any, S = any> extends StoreStream<T, E> {

    /**
     * Something went wrong with mutation
     * @param {E} error value to pass back to the mutator
     */
    error(error: E): void;

    /**
     * The mutation was a success!
     * @param {S} success value to pass back to mutator
     */
    success(success: S): void;
}

/**
 * BusStoreAPI is the interface exposed buy EventBus to allow interactions with Stores.
 */
export interface BusStoreApi {

    /**
     * Create a new Store, if the store already exists, then it will be returned, safe for async operations.
     * @param {StoreType} objectType the string ID of the store you want to create (i.e. 'UserStore')
     * @param {Map<UUID, T>} map pre-populate store with a map of id's to values.
     * @returns {BusStore<T>} reference to the BusStore you have just created.
     */
    createStore<T>(objectType: StoreType, map?: Map<UUID, T>): BusStore<T>;

   /**
    * Opens a galactic store.
    * @param {StoreType} objectType
    * @returns {BusStore<T>}
    */
    openGalacticStore<T>(objectType: StoreType): BusStore<T>;

    /**
     * Get a reference to the existing store. If the store does not exist, nothing will be returned.
     * @param {StoreType} objectType the string ID of the store you want a reference to (i.e. 'UserStore')
     */
    getStore<T>(objectType: StoreType): BusStore<T>;

    /**
     * Destroy a store (destructive). If called for a galactic store, will trigger closeGalacticStore
     * request to the backend and will destroy the local store copy (store's items on the backend will not
     * be affected).
     * @param {StoreType} objectType the string ID of the store you want to destroy (i.e. 'UserStore')
     */
    destroyStore(objectType: StoreType): boolean;

    /**
     * When you need to wait for more than a single store to be ready, readyJoin takes an array of StoreTypes
     * and returns a reference to StoreReadyResult, any function you pass to whenReady will be excuted once all
     * stores have been initialized.
     * @param {Array<StoreType>} caches array of StoreTypes you want to wait for initialization on.
     */
    readyJoin(caches: Array<StoreType>): StoreReadyResult;

    /**
     * Wipe out everything, will eradicate all state from all stores by destroying all stores.
     */
    wipeAllStores(): void;

    /**
     * Get ALL stores.
     */
    getAllStores(): Array<BusStore<any>>;
}

/**
 * BusStore is a stateful in memory cache for objects. All state changes (any time the cache is modified)
 * will broadcast that updated object to any subscribers of the BusStore online for those specific objects
 * or all objects of a certain type and state changes.
 */
export interface BusStore<T> {

    /**
     * Place an object into the cache, will broadcast to all subscribers online for state changes.
     * @param {UUID} id string ID of your object, UUID is highly recommended.
     * @param {T} value the object you wish to cache
     * @param {S} state the state change event you want to broadcast with this action (created, updated etc).
     */
    put<S>(id: UUID, value: T, state: S): void;

    /**
     * Retrieve an object from the cache
     * @param {UUID} id the string ID of the object you wish to get.
     * @returns {T} the object you're looking for.
     */
    get(id: UUID): T;

    /**
     * Get all values from cache.
     * @returns {Array<T>} everything we got!
     */
    allValues(): Array<T>;

    /**
     * Get the entire cache as a map.
     * @returns {Map<UUID, T>}
     */
    allValuesAsMap(): Map<UUID, T>;

    /**
     * Remove/delete an object into the cache.
     * @param {UUID} id The string ID of the object you wish to remove.
     * @param {S} state you want to be sent to subscribers notifying cache deletion.
     * @return {boolean} true if it was removed, false if not.
     */
    remove<S>(id: UUID, state: S): boolean;

    /**
     * Send a mutation command to any subscribers handling mutations.
     * @param {V} value to be mutated
     * @param {M} mutationType the type of the mutation
     * @param {MessageFunction<S>} successHandler provide object S to mutator function on successful mutation.
     * @param {MessageFunction<E>} errorHandler provide object E to mutator function on error.
     * @returns {boolean} true if mutation command was placed in stream
     */
    mutate<V, M, S, E>(value: V, mutationType: M,
                       successHandler: MessageFunction<S>, errorHandler?: MessageFunction<E>): boolean;


    /**
     * Populate the cache with a collection of objects and their ID's.
     * @param {Map<UUID, T>} items a Map of your UUID's mapped to your Objects.
     * @returns {boolean} if the cache has already been populated (has objects), will return false.
     * This method has no effect for galactic stores.
     */
    populate(items: Map<UUID, T>): boolean;

    /**
     * Subscribe to state changes for a specific object.
     * @param {UUID} id the ID of the object you wish to receive updates.
     * @param {S} stateChangeType the state change type you wish to listen to
     * @returns {StoreStream<T>} stream that will tick the object you're online for.
     */
    onChange<S>(id: UUID, ...stateChangeType: S[]): StoreStream<T>;

    /**
     * Subscribe to state changes for all objects of a specific type and state change
     * @param {S} stateChangeType the state change type you with to listen to
     * @returns {StoreStream<T>} stream that will tick the object you're online for.
     */
    onAllChanges<S>(...stateChangeType: S[]): StoreStream<T>;

    /**
     * Subscribe to mutation requests via mutate()
     * @param {T} objectType the object you want to listen for.
     * @param {M} mutationType optional mutation type
     * @returns {StoreStream<T>} stream that will tick mutation requests you're online for.
     */
    onMutationRequest<M = any>(objectType: T, ...mutationType: M[]): MutateStream<T>;

    /**
     * Notify when the cache has been initialize (via populate() or initialize()
     * @param {MessageFunction<boolean>} readyFunction that accepts the entire cache as a map.
     */
    whenReady(readyFunction: MessageFunction<Map<UUID, T>>): void;

    /**
     * Flip an internal bit to set the cache to ready, notify all watchers.
     */
    initialize(): void;

    /**
     * Will wipe all data out, in case you need a clean slate.
     */
    reset(): void;

    /**
     * Return true if this is a galactic store.
     */
    isGalacticStore(): boolean;

    /**
     * Set lambda that is used to auto-reload this store.
     * @param serviceCallFunction function should encapsulate a service call.
     *
     * This method has no effect for galactic stores.
     */
    setAutoReloadServiceTrigger(serviceCallFunction: Function): void;

    /**
     * Start automatic reload. The store will refetch its data (using setAutoReloadServiceTrigger). The store is
     * considered stale once the TTL has passed.
     * @param timeToLiveInMs how long to hold data in the store before refetching. (default is 10 seconds)
     *
     * This method has no effect for galactic stores.
     */
    startAutoReload(timeToLiveInMs: number): void;

    /**
     * Restart auto-reload timer.
     *
     * This method has no effect for galactic stores.
     */
    refreshApiDelay(): void;

    /**
     * Reload store with refresh service call.
     *
     * This method has no effect for galactic stores.
     */
    reloadStore(): void;

    /**
     * Stop Store from auto-refreshing.
     *
     * This method has no effect for galactic stores.
     */
    stopAutoReload(): void;
}
