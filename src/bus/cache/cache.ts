import { Message, MessageFunction } from '../message.model';
import { MessageBusEnabled, MessagebusService } from '../messagebus.service';
import { StompParser } from '../../bridge/stomp.parser';
import { Observable } from 'rxjs/Observable';
import {
    CacheStateChange, CacheStateMutation, CacheStreamImpl, MutateStreamImpl, MutationRequestWrapper,
    UUID
} from './cache.model';
import { BusCache, CacheStream, MutateStream } from './cache.api';

/**
 * Copyright(c) VMware Inc. 2017
 */

export class CacheImpl<T> implements BusCache<T>, MessageBusEnabled {

    getName(): string {
        return 'BusCache';
    }

    private cache: Map<UUID, any>;
    private cacheStreamChan: string = 'cache-change-' + StompParser.genUUID();
    private cacheMutationChan: string = 'cache-mutation-' + StompParser.genUUID();
    private cacheReadyChan: string = 'cache-ready-' + StompParser.genUUID();
    private cacheInitialized = false;

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
            stateChange,
            null,
            this.getName()
        );

        this.bus.sendResponseMessage(
            CacheImpl.getObjectChannel(id),
            stateChange,
            null,
            this.getName()
        );
    }

    allValues(): Array<T> {
        return Array.from(this.cache.values());
    }

    allValuesAsMap<T>(): Map<UUID, T> {
        let copy: Map<UUID, T> = new Map<UUID, T>();
        this.cache.forEach(
            (val: T, key: UUID) => {
                copy.set(key, val);
            }
        );
        return copy;
    }

    populate<T>(items: Map<UUID, T>): boolean {
        if (this.cache.size === 0) {
            this.initialized();
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

    remove<S>(id: UUID, state: S): boolean {
        if (this.cache.has(id)) {
            this.sendChangeBroadcast(state, id, this.cache.get(id));
            this.cache.delete(id);
            this.bus.close(CacheImpl.getObjectChannel(id), this.getName());
            return true;
        }
        return false;
    }

    onChange<S, T>(id: UUID, ...stateChangeType: S[]): CacheStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.getResponseChannel(CacheImpl.getObjectChannel(id), this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.getErrorChannel(CacheImpl.getObjectChannel(id), this.getName());

        const stream: Observable<CacheStateChange<S, T>> =
            Observable.merge(cacheStreamChan, cacheErrorCan)
                .map(
                    (msg: Message) => {
                        if (msg.isError()) {
                            throw new Error(msg.payload);
                        }
                        return msg.payload as CacheStateChange<S, T>;
                    }
                );

        const filterStream: Observable<MutationRequestWrapper<T>> =
            stream.filter(
                (state: CacheStateChange<S, T>) => {
                    if (stateChangeType && stateChangeType.length > 0) {
                        return (stateChangeType.indexOf(state.type) >= 0);
                    }
                    return true; // all states.
                }
            ).map(
                (stateChange: CacheStateChange<S, T>) => {
                    return new MutationRequestWrapper(stateChange.value);
                }
            );

        return new CacheStreamImpl<T>(filterStream);
    }

    onAllChanges<T, S>(objectType: T, ...stateChangeType: S[]): CacheStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.getResponseChannel(this.cacheStreamChan, this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.getErrorChannel(this.cacheStreamChan, this.getName());

        const stream: Observable<CacheStateChange<S, T>> =
            Observable.merge(cacheStreamChan, cacheErrorCan)
                .map(
                    (msg: Message) => {
                        if (msg.isError()) {
                            throw new Error(msg.payload);
                        }
                        return msg.payload as CacheStateChange<S, T>;
                    }
                );

        const filterStream: Observable<MutationRequestWrapper<T>> =
            stream.filter(
                (state: CacheStateChange<S, T>) => {
                    if (stateChangeType && stateChangeType.length > 0) {
                        return (stateChangeType.indexOf(state.type) >= 0);
                    }
                    return true; // all states.
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
                    return new MutationRequestWrapper(stateChange.value);
                }
            );

        return new CacheStreamImpl<T>(filterStream);
    }

    mutate<T, M, E>(value: T, mutationType: M,
                    successHandler: MessageFunction<T>, errorHandler?: MessageFunction<E>): boolean {

        const mutation: CacheStateMutation<M, T> = new CacheStateMutation(mutationType, value);
        mutation.errorHandler = errorHandler;
        mutation.successHandler = successHandler;

        this.bus.sendRequestMessage(
            this.cacheMutationChan,
            mutation,
            null,
            this.getName()
        );
        return true;
    }

    onMutationRequest<T, M, E = any>(objectType: T, ...mutationType: M[]): MutateStream<T, E> {

        const stream: Observable<CacheStateMutation<M, T>> =
            this.bus.getChannel(this.cacheMutationChan, this.getName())
                .map(
                    (msg: Message) => {
                        return msg.payload as CacheStateMutation<M, T>;
                    }
                );

        const filterStream: Observable<MutationRequestWrapper<T, any>> =
            stream.filter(
                (mutation: CacheStateMutation<M, T>) => {
                    if (mutationType && mutationType.length > 0) {
                        return (mutationType.indexOf(mutation.type) >= 0);
                    }
                    return true;
                }
            ).map(
                (stateChange: CacheStateMutation<M, T>) => {
                    return new MutationRequestWrapper(
                        stateChange.value,
                        stateChange.successHandler,
                        stateChange.errorHandler
                    );
                }
            );

        return new MutateStreamImpl<T, E>(filterStream);
    }

    reset(): void {
        this.cache.clear();
    }

    whenReady(readyFunction: MessageFunction<boolean>): void {

        // push this off into the event loop, make sure all consumers are async.
        setTimeout(
            () => {
                if (this.cacheInitialized) {
                    this.bus.sendResponseMessage(this.cacheReadyChan, true);
                }
            }
        );

        this.bus.listenOnce(this.cacheReadyChan).handle(readyFunction);
    }

    initialized(): void {
        if (!this.cacheInitialized) {
            this.cacheInitialized = true;
            this.bus.sendResponseMessage(this.cacheReadyChan, true);
        }
    }
}
