/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { Message, MessageFunction } from '../model/message.model';
import { BifrostEventBusEnabled, BifrostEventBus } from '../bus';
import { StompParser } from '../../bridge/stomp.parser';
import { Observable } from 'rxjs/Observable';
import {
    StoreStateChange, StoreStateMutation, StoreStreamImpl, MutateStreamImpl, MutationRequestWrapper,
    UUID,
    StoreType
} from './store.model';
import { BusStore, StoreStream, MutateStream } from '../../store.api';
import { EventBus } from '../../bus.api';
import { LoggerService } from '../../log/logger.service';

interface Predicate<T> {
    (value: T): boolean;
}

export class StoreImpl<T> implements BusStore<T>, BifrostEventBusEnabled {
    
    private uuid: string;
    
    getName(): string {
        return 'BusStore';
    }

    private cache: Map<UUID, any>;
    private cacheStreamChan: string;
    private cacheMutationChan: string;
    private cacheReadyChan: string;
    private cacheInitialized = false;
    
    public getObjectChannel(id: UUID): UUID {
        return 'store-' + this.uuid + '-object-' + id;
    }

    constructor(private bus: EventBus, private log: LoggerService, private type: StoreType) {
        this.cache = new Map<UUID, any>();
        this.uuid = StompParser.genUUIDShort();
        this.cacheStreamChan = 'cache-change-' + this.uuid;
        this.cacheMutationChan = 'cache-mutation-' + this.uuid;
        this.cacheReadyChan = 'cache-ready-' + this.uuid;
        this.log.info('🗄️ Store: New Store [' + type + '] was created with id ' + this.uuid, type);
    }

    private sendChangeBroadcast<C>(changeType: C, id: UUID, value: T): void {

        const stateChange: StoreStateChange<C, T> = new StoreStateChange<C, T>(id, changeType, value);

        this.bus.sendResponseMessage(
            this.cacheStreamChan,
            stateChange,
            this.getName()
        );

        this.bus.sendResponseMessage(
            this.getObjectChannel(id),
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
            this.log.info('🗄️ Store: Populated with  ' + this.cache.size + ' values', this.type);
            this.initialize();
            return true;
        }
        return false;
    }

    put<S>(id: UUID, value: T, state: S): void {
        this.cache.set(id, value);
        this.sendChangeBroadcast(state, id, value);
        this.log.info('🗄️ Store: Added new object with id: ' + id, this.type);
    }

    get(id: UUID): T {
        return this.cache.get(id);
    }

    remove<S>(id: UUID, state: S): boolean {
        if (this.cache.has(id)) {
            const obj = this.cache.get(id);
            this.sendChangeBroadcast(state, id, obj);
            this.cache.delete(id);
            this.bus.api.close(this.getObjectChannel(id), this.getName());
            this.log.info('🗄️ Store: Removed object with id ' + id, this.type);
            return true;
        }
        return false;
    }

    onChange<S>(id: UUID, ...stateChangeType: S[]): StoreStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.api.getResponseChannel(this.getObjectChannel(id), this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.api.getErrorChannel(this.getObjectChannel(id), this.getName());

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

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter]), this.log);
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

            // const compareKeys = (a: T, b: T): boolean => {
            //     const aKeys = Object.keys(a).sort();
            //     const bKeys = Object.keys(b).sort();
            //     return JSON.stringify(aKeys) === JSON.stringify(bKeys);
            // };
            // return compareKeys(objectType, state.value);
            // return objectType.constructor.name.trim() === state.value.constructor.name.trim();
            
            // Check that class names match. If not, just log, don't do anything.    
            const match: boolean = objectType.constructor.name.trim() === state.value.constructor.name.trim();

            if (!match) {

                this.log.warn('onAllChanges() stream handling mismatched object types [' +
                    objectType.constructor.name.trim() + '] and [' + state.value.constructor.name.trim() + ']',
                        this.getName());
            }
            return true;


        };

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter, compareObjects]), this.log);
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

        this.log.debug('🗄️ Store: Fired mutation request', this.type);
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

        return new MutateStreamImpl<T, E>(filterStream, this.log);
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
                    this.log.debug('🗄️ Store: [' + this.type + '] Ready! Contains ' 
                        + this.allValuesAsMap().size + ' values', this.type);
                    
                    this.bus.sendResponseMessage(this.cacheReadyChan, this.allValuesAsMap());
                }
            }
        );
    }

    initialize(): void {
        if (!this.cacheInitialized) {
            this.cacheInitialized = true;
            this.log.info('🗄️ Store: [' + this.type + '] Initialized!', this.type);
            this.bus.sendResponseMessage(this.cacheReadyChan, this.allValuesAsMap());
        }
    }
}
