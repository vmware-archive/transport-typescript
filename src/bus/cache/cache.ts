import { Message, MessageFunction } from './message.model';
import { MessageBusEnabled, MessagebusService } from './messagebus.service';
import { StompParser } from '../bridge/stomp.parser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Syslog } from '../log/syslog';

/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

export type UUID = string;

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
     */
    remove(id: UUID): boolean;

    /**
     * Populate the cache with a collection of objects and their ID's.
     * @param {Map<UUID, T>} items a Map of your UUID's mapped to your Objects.
     * @returns {boolean} if the cache has already been populated (has objects), will return false.
     */
    populateCache<T>(items: Map<UUID, T>): boolean;

    /**
     * Subscribe to state changes for a specific object.
     * @param {UUID} id the ID of the object you wish to receive updates.
     * @param {S} stateChangeType the state change(s) type(s) you wish to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    notifyOnChange<S, T>(id: UUID, ...stateChangeType: S[]): CacheStream<T>;

    /**
     * Subscribe to state changes for all objects of a specific type and state change
     * @param {T} objectType the type of object you're looking to listen for
     * @param {S} stateChangeType the state change(s) type(s) you with to listen to
     * @returns {CacheStream<T>} stream that will tick the object you're listening for.
     */
    notifyOnAllChanges<T, S>(objectType: T, ...stateChangeType: S[]): CacheStream<T>;
}

export class CacheImpl implements BusCache, MessageBusEnabled {

    getName(): string {
        return 'BusCache';
    }

    private cache: Map<UUID, any>;
    private cacheStreamChan: string = 'cache-change-' + StompParser.genUUID();

    public static getObjectChannel(id: UUID): UUID {
        return 'cache-object-' + id;
    }

    constructor(private bus: MessagebusService) {
        this.cache = new Map<UUID, any>();
    }

    private sendChangeBroadcast<T, V>(changeType: T, id: UUID, value: V): void {

        const stateChange: CacheStateChange<T, V> = new CacheStateChange<T, V>(id, changeType, value);
        this.bus.sendResponseMessage(
            this.cacheStreamChan,
            stateChange
        );

        this.bus.sendResponseMessage(
            CacheImpl.getObjectChannel(id),
            stateChange
        );
    }

    populateCache<T>(items: Map<UUID, T>): boolean {
        if (this.cache.size === 0) {
            this.cache = items;
            return true;
        }
        return false;
    }

    encache<T, S>(id: UUID, value: T, state: S): void {
        this.cache.set(id, value);
        this.sendChangeBroadcast(state, id, value);
    }

    retrieve<T>(id: UUID): T {
        return this.cache.get(id);
    }

    remove(id: UUID): boolean {
        if (this.cache.has(id)) {
            this.cache.delete(id);
            this.bus.close(CacheImpl.getObjectChannel(id), this.getName());
            return true;
        }
        return false;
    }

    notifyOnChange<S, T>(id: UUID, ...stateChangeType: S[]): CacheStream<T> {

        const stream: Observable<CacheStateChange<S, T>> =
            this.bus.getChannel(CacheImpl.getObjectChannel(id), this.getName())
                .map(
                    (msg: Message) => {
                        return msg.payload as CacheStateChange<S, T>;
                    }
                );

        const filterStream: Observable<T> =
            stream.filter(
                (state: CacheStateChange<S, T>) => {
                    return (stateChangeType.indexOf(state.type) >= 0);
                }
            ).map(
                (stateChange: CacheStateChange<S, T>) => {
                    return stateChange.value;
                }
            );

        return new CacheStreamImpl<T>(filterStream);
    }

    notifyOnAllChanges<T, S>(objectType: T, ...stateChangeType: S[]): CacheStream<T> {

        const stream: Observable<CacheStateChange<S, T>> =
            this.bus.getChannel(CacheImpl.getObjectChannel(this.cacheStreamChan), this.getName())
                .map(
                    (msg: Message) => {
                        return msg.payload as CacheStateChange<S, T>;
                    }
                );

        const filterStream: Observable<T> =
            stream.filter(
                (state: CacheStateChange<S, T>) => {
                    return (stateChangeType.indexOf(state.type) >= 0);
                }
            ).filter(
                (state: CacheStateChange<S, T>) => {

                    const compareKeys = (a: T, b: T): boolean => {
                        const aKeys = Object.keys(a).sort();
                        const bKeys = Object.keys(b).sort();
                        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
                    };

                    return compareKeys(objectType, state.value);
                }
            ).map(
                (stateChange: CacheStateChange<S, T>) => {
                    return stateChange.value;
                }
            );

        return new CacheStreamImpl<T>(filterStream);

    }
}

class CacheStateChange<T, V> {
    constructor(private objectId: UUID,
                private changeType: T,
                private objectValue: V) {

    }

    public get id(): UUID {
        return this.objectId;
    }

    public get type(): T {
        return this.changeType;
    }

    public get value(): V {
        return this.objectValue;
    }

}

class CacheStreamImpl<T> implements CacheStream<T> {
    private subscription: Subscription;

    constructor(private stream: Observable<T>) {

    }

    subscribe(handler: MessageFunction<T>): Subscription {

        this.subscription = this.stream.subscribe(
            (value: T) => {
                if (handler) {
                    handler(value);
                } else {
                    Syslog.error('unable to handle cache stream event, no handler provided.');
                }
            }
        );

        return this.subscription;
    }

    unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}