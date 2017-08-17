/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import { MessageFunction } from '../message.model';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from './cache.model';


/**
 * CacheStream wraps an Observable, allowing for future underlying logic manipulation without
 * worrying about breaking API's.
 */
export interface CacheStream<T> {
    /**
     * Subscribe to Observable stream.
     * @param {MessageFunction<T>} handler function to handle ticks on stream
     * @returns {Subscription} subscription to stream.
     */
    subscribe(handler: MessageFunction<T>): Subscription;

    /**
     * Unsubscribe from Observable stream.
     */
    unsubscribe(): void;
}

/**
 * BusCache is a stateful in memory cache for objects. All state changes (any time the cache is modified)
 * will broadcast that updated object to any subscribers of the BusCache listening for those specific objects
 * or all objects of a certain type and state changes.
 */
export interface BusCache {

    /**
     * Place an object into the cache, will broadcast to all subscribers listening for state changes.
     * @param {UUID} id string ID of your object, UUID is highly recommended.
     * @param {T} value the object you wish to cache
     * @param {S} state the state change event you want to broadcast with this action (created, updated etc).
     */
    encache<T, S>(id: UUID, value: T, state: S): void;

    /**
     * Retrieve an object from the cache
     * @param {UUID} id the string ID of the object you wish to retrieve.
     * @returns {T} the object you're looking for.
     */
    retrieve<T>(id: UUID): T;

    /**
     * Remove/delete an object into the cache.
     * @param {UUID} id The string ID of the object you wish to remove.
     * @param {boolean} true if it was removed, false if not.
     * @param {S} state you want to be sent to subscribers notifying cache deletion.
     */
    remove<S>(id: UUID,  state: S): boolean;

    /**
     * Populate the cache with a collection of objects and their ID's.
     * @param {Map<UUID, T>} items a Map of your UUID's mapped to your Objects.
     * @returns {boolean} if the cache has already been populated (has objects), will return false.
     */
    populateCache<T>(items: Map<UUID, T>): boolean;

    /**
     * Subscribe to state changes for a specific object.
     * @param {UUID} id the ID of the object you wish to receive updates.
     * @param {S} stateChangeType the state change type you wish to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    notifyOnChange<S, T>(id: UUID, stateChangeType: S): CacheStream<T>;

    /**
     * Subscribe to state changes for all objects of a specific type and state change
     * @param {T} objectType the type of object you're looking to listen for, needs to be an actual object however
     *            the method will look at the properties of the objects and match them to see if they are the same
     *            type. object can be a new empty instance of the type you want to watch, or an exisiting instance of
     *            something. The actual property values of the supplied object are ignored.
     * @param {S} stateChangeType the state change type you with to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    notifyOnAllChanges<S, T>(objectType: T, stateChangeType: S): CacheStream<T>;

    /**
     * Will wipe all data out, in case you need a clean slate.
     */
    resetCache(): void;
}