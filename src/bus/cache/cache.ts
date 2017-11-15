/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { Message, MessageFunction } from '../model/message.model';
import { MessageBusEnabled, MessagebusService } from '../messagebus.service';
import { StompParser } from '../../bridge/stomp.parser';
import { Observable } from 'rxjs/Observable';
import {
    StoreStateChange, StoreStateMutation, StoreStreamImpl, MutateStreamImpl, MutationRequestWrapper,
    UUID
} from './cache.model';
import { BusStore, StoreStream, MutateStream } from '../cache.api';

interface Predicate<T> {
    (value: T): boolean;
}

export class StoreImpl<T> implements BusStore<T>, MessageBusEnabled {

    getName(): string {
        return 'BusStore';
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

    private sendChangeBroadcast<C>(changeType: C, id: UUID, value: T): void {

        const stateChange: StoreStateChange<C, T> = new StoreStateChange<C, T>(id, changeType, value);

        this.bus.sendResponseMessage(
            this.cacheStreamChan,
            stateChange,
            this.getName()
        );

        this.bus.sendResponseMessage(
            StoreImpl.getObjectChannel(id),
            stateChange,
            this.getName()
        );
    }

    allValues(): Array<T> {
        return Array.from(this.cache.values());
    }

    allValuesAsMap(): Map<UUID, T> {
        return new Map(this.cache.entries());
    }

    populate(items: Map<UUID, T>): boolean {
        if (this.cache.size === 0) {
            this.cache = new Map(items.entries());
            this.initialize();
            return true;
        }
        return false;
    }

    put<S>(id: UUID, value: T, state: S): void {
        this.cache.set(id, value);
        this.sendChangeBroadcast(state, id, value);
    }

    get(id: UUID): T {
        return this.cache.get(id);
    }

    remove<S>(id: UUID, state: S): boolean {
        if (this.cache.has(id)) {
            const obj = this.cache.get(id);
            this.cache.delete(id);
            this.sendChangeBroadcast(state, id, obj);
            this.bus.api.close(StoreImpl.getObjectChannel(id), this.getName());
            return true;
        }
        return false;
    }

    onChange<S>(id: UUID, ...stateChangeType: S[]): StoreStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.api.getResponseChannel(StoreImpl.getObjectChannel(id), this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.api.getErrorChannel(StoreImpl.getObjectChannel(id), this.getName());

        const stream: Observable<StoreStateChange<S, T>> =
             Observable.merge(cacheStreamChan, cacheErrorCan)
                .map(
                    (msg: Message) => {
                        return msg.payload as StoreStateChange<S, T>;
                    }
                );

        const stateChangeFilter: Predicate<StoreStateChange<S, T>> = (state: StoreStateChange<S, T>) => {
            if (stateChangeType && stateChangeType.length > 0) {
                return (stateChangeType.indexOf(state.type) >= 0);
            }
            return true; // all states.
        };

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter]));
    }

    onAllChanges<S>(objectType: T, ...stateChangeType: S[]): StoreStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.api.getResponseChannel(this.cacheStreamChan, this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.api.getErrorChannel(this.cacheStreamChan, this.getName());

        const stream: Observable<StoreStateChange<S, T>> =
            Observable.merge(cacheStreamChan, cacheErrorCan)
                .map(
                    (msg: Message) => {
                        return msg.payload as StoreStateChange<S, T>;
                    }
                );

        const stateChangeFilter: Predicate<StoreStateChange<S, T>> = (state: StoreStateChange<S, T>) => {
            if (stateChangeType && stateChangeType.length > 0) {
                return (stateChangeType.indexOf(state.type) >= 0);
            }
            return true; // all states.
        };

        const compareObjects: Predicate<StoreStateChange<S, T>> = (state: StoreStateChange<S, T>) => {
            const compareKeys = (a: T, b: T): boolean => {
                const aKeys = Object.keys(a).sort();
                const bKeys = Object.keys(b).sort();
                return JSON.stringify(aKeys) === JSON.stringify(bKeys);
            };
            return compareKeys(objectType, state.value);
        };

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter, compareObjects]));
    }

    private filterStream<S>(
        stream: Observable<any>,
        filters: Array<Predicate<StoreStateChange<S, T>>>): Observable<MutationRequestWrapper<T>> {

        filters.forEach(
            (f: Predicate<StoreStateChange<S, T>>) => {
                stream = stream.filter(f);
            }
        );

        return stream.map(
            (stateChange: StoreStateChange<S, T>) => {
                return new MutationRequestWrapper(stateChange.value);
            }
        );
    }

    mutate<M, E>(
        value: T, mutationType: M,
        successHandler: MessageFunction<T>, 
        errorHandler?: MessageFunction<E>): boolean {

        const mutation: StoreStateMutation<M, T> = new StoreStateMutation(mutationType, value);
        mutation.errorHandler = errorHandler;
        mutation.successHandler = successHandler;

        this.bus.sendRequestMessage(
            this.cacheMutationChan,
            mutation,
            this.getName()
        );
        return true;
    }

    onMutationRequest<M, E = any>(objectType: T, ...mutationType: M[]): MutateStream<T, E> {

        const stream: Observable<StoreStateMutation<M, T>> =
            this.bus.api.getChannel(this.cacheMutationChan, this.getName())
                .map(
                    (msg: Message) => {
                        return msg.payload as StoreStateMutation<M, T>;
                    }
                );

        const filterStream: Observable<MutationRequestWrapper<T, any>> =
            stream.filter(
                (mutation: StoreStateMutation<M, T>) => {
                    if (mutationType && mutationType.length > 0) {
                        return (mutationType.indexOf(mutation.type) >= 0);
                    }
                    return true;
                }
            ).map(
                (stateChange: StoreStateMutation<M, T>) => {
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

    whenReady(readyFunction: MessageFunction<Map<UUID, T>>): void {
        this.bus.listenOnce(this.cacheReadyChan).handle(readyFunction);

        // push this off into the event loop, make sure all consumers are async.
        setTimeout(
            () => {
                if (this.cacheInitialized) {
                    this.bus.sendResponseMessage(this.cacheReadyChan, this.allValuesAsMap());
                }
            }
        );
    }

    initialize(): void {
        if (!this.cacheInitialized) {
            this.cacheInitialized = true;
            this.bus.sendResponseMessage(this.cacheReadyChan, true);
        }
    }
}
