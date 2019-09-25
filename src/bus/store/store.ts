/**
 * Copyright(c) VMware Inc. 2016-2019
 */

import { Message } from '../model/message.model';
import { Observable, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {
    StoreStateChange, StoreStateMutation, StoreStreamImpl, MutateStreamImpl, MutationRequestWrapper,
    UUID,
    StoreType
} from './store.model';
import { BusStore, StoreStream, MutateStream } from '../../store.api';
import { EventBus, EventBusEnabled, MessageFunction, MessageHandler } from '../../bus.api';
import { Logger } from '../../log/logger.service';
import { GeneralUtil } from '../../util/util';
import { BrokerConnectorChannel, StompBusCommand, StompClient } from '../../bridge';

interface Predicate<T> {
    (value: T): boolean;
}

export class StoreImpl<T> implements BusStore<T>, EventBusEnabled {

    private uuid: string;
    private reloadHandler: Function;
    private reloadTTL: number;
    private reloadIntervalTracker: any;
    private log: Logger;

    getName(): string {
        return 'BusStore';
    }

    private cache: Map<UUID, any>;
    private cacheStreamChan: string;
    private cacheMutationChan: string;
    private cacheReadyChan: string;
    private cacheInitialized = false;
    private name: string;

    private galacticStoreVersion: number;
    private syncChannelMessageHandler: MessageHandler<any>;
    private connectionMessageHandler: MessageHandler<any>;
    private isGalactic: boolean = false;

    public getObjectChannel(id: UUID): UUID {
        return 'store-' + this.uuid + '-object-' + id;
    }

    constructor(private bus: EventBus, private type: StoreType, private galacticStoreSyncChannel: string = null) {

        this.isGalactic = !!this.galacticStoreSyncChannel;

        this.cache = new Map<UUID, any>();
        this.uuid = GeneralUtil.genUUID();
        this.cacheStreamChan = `stores::store-change-${this.uuid}-${type}`;
        this.cacheMutationChan = `stores::store-mutation-${this.uuid}-${type}`;
        this.cacheReadyChan = `stores::store-ready-${this.uuid}-${type}`;
        this.log = bus.api.logger();
        this.name = type;
        this.log.info(`🗄️ Store: New Store [${type}] was created with id ${this.uuid}, named ${type}`);

        if (this.isGalactic) {
            this.initGalacticStore();
        }
    }

    private initGalacticStore() {

        this.syncChannelMessageHandler =
                this.bus.listenStream(this.galacticStoreSyncChannel, this.getName());

        this.syncChannelMessageHandler.handle( (response: any) => {
            if (!response || response.storeId !== this.type) {
                // the response is for another store
                return;
            }
            if (response.responseType === 'storeContentResponse') {
                this.galacticStoreVersion = response.storeVersion;
                this.cache.clear();
                Object.keys(response.items).forEach(
                        key => this.cache.set(key, response.items[key]));
                this.initialize();
            } else if (response.responseType === 'updateStoreResponse') {

                if (response.storeVersion > this.galacticStoreVersion + 1) {
                    // If the backend store version is greater than local version + 1 this means
                    // that we have missed some store updates.
                    this.log.warn('Detected missing updates for store: ' + this.type);
                }

                this.galacticStoreVersion = Math.max(this.galacticStoreVersion, response.storeVersion);
                if (response.newItemValue === null || response.newItemValue === undefined) {
                    this.removeLocal(response.itemId, 'galacticSyncRemove');
                } else {
                    this.putLocal(response.itemId, response.newItemValue, 'galacticSyncUpdate');
                }
            }
        });

        this.requestStoreContent();

        // listen for STOMP connect events on broker connector channel to update
        // the store content.
        this.connectionMessageHandler = this.bus.listenStream(BrokerConnectorChannel.status);
        this.connectionMessageHandler.handle(
                (busCommand: StompBusCommand) => {
                    switch (busCommand.command) {
                        case StompClient.STOMP_CONNECTED:
                            this.requestStoreContent();
                            break;
                    }
                });
    }

    closeStore() {
        if (this.isGalacticStore()) {
            const closeStoreRequest = this.bus.fabric.generateFabricRequest(
                    'closeStore',
                    {
                        storeId: this.type
                    });
            this.bus.sendGalacticMessage(this.galacticStoreSyncChannel, closeStoreRequest);
            if (this.syncChannelMessageHandler) {
                this.syncChannelMessageHandler.close();
            }
            if (this.connectionMessageHandler) {
                this.connectionMessageHandler.close();
            }
        }
    }

    private requestStoreContent() {
        const openStoreRequest = this.bus.fabric.generateFabricRequest(
                'openStore',
                {
                    storeId: this.type
                });
        this.bus.sendGalacticMessage(this.galacticStoreSyncChannel, openStoreRequest);
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
        if (this.cache.size === 0 && !this.isGalacticStore()) {
            this.cache = new Map(items.entries());
            this.log.info('🗄️ Store: Populated with  ' + this.cache.size + ' values', this.type);
            this.initialize();
            return true;
        }
        return false;
    }

    put<S>(id: UUID, value: T, state: S): void {
        if (this.isGalacticStore()) {
            this.putGalactic(id, value, state);
        } else {
            this.putLocal(id, value, state);
        }
    }

    private putLocal<S>(id: UUID, value: T, state: S): void {
        this.cache.set(id, value);
        this.sendChangeBroadcast(state, id, value);
        this.log.info('🗄️ Store: Added new object with id: ' + id, this.type);
    }

    private putGalactic<S>(id: UUID, value: T, state: S): void {
        const updateStoreRequest = this.bus.fabric.generateFabricRequest(
                'updateStore',
                {
                    storeId: this.type,
                    clientStoreVersion: this.galacticStoreVersion,
                    itemId: id,
                    newItemValue: value
                });
        this.bus.sendGalacticMessage(
                this.galacticStoreSyncChannel, updateStoreRequest);
    }

    remove<S>(id: UUID, state: S): boolean {
        if (this.isGalacticStore()) {
            return this.removeGalactic(id, state);
        } else {
            return this.removeLocal(id, state);
        }
    }

    private removeLocal<S>(id: UUID, state: S): boolean {
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

    private removeGalactic<S>(id: UUID, state: S): boolean {
        if (this.cache.has(id)) {
            const updateStoreRequest = this.bus.fabric.generateFabricRequest(
                    'updateStore',
                    {
                        storeId: this.type,
                        clientStoreVersion: this.galacticStoreVersion,
                        itemId: id,
                        newItemValue: null
                    });
            this.bus.sendGalacticMessage(
                    this.galacticStoreSyncChannel, updateStoreRequest);
            return true;
        }
        return false;
    }

    get(id: UUID): T {
        return this.cache.get(id);
    }

    isGalacticStore() {
        return this.isGalactic;
    }

    onChange<S>(id: UUID, ...stateChangeType: S[]): StoreStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.api.getResponseChannel(this.getObjectChannel(id), this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.api.getErrorChannel(this.getObjectChannel(id), this.getName());

        const stream: Observable<StoreStateChange<S, T>> =
            merge(cacheStreamChan, cacheErrorCan)
                .pipe(map(
                    (msg: Message) => {
                        return msg.payload as StoreStateChange<S, T>;
                    }
                ));

        const stateChangeFilter: Predicate<StoreStateChange<S, T>> = (state: StoreStateChange<S, T>) => {
            if (stateChangeType && stateChangeType.length > 0) {
                return (stateChangeType.indexOf(state.type) >= 0);
            }
            return true; // all states.
        };

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter]), this.log);
    }

    onAllChanges<S>(...stateChangeType: S[]): StoreStream<T> {

        const cacheStreamChan: Observable<Message> =
            this.bus.api.getResponseChannel(this.cacheStreamChan, this.getName());

        const cacheErrorCan: Observable<Message> =
            this.bus.api.getErrorChannel(this.cacheStreamChan, this.getName());

        const stream: Observable<StoreStateChange<S, T>> =
            merge(cacheStreamChan, cacheErrorCan)
                .pipe(
                    map(
                        (msg: Message) => {
                            return msg.payload as StoreStateChange<S, T>;
                        }
                    )
                );

        const stateChangeFilter: Predicate<StoreStateChange<S, T>> = (state: StoreStateChange<S, T>) => {
            if (stateChangeType && stateChangeType.length > 0) {
                return (stateChangeType.indexOf(state.type) >= 0);
            }
            return true; // all states.
        };

        return new StoreStreamImpl<T>(this.filterStream(stream, [stateChangeFilter]), this.log);
    }

    private filterStream<S>(
        stream: Observable<any>,
        filters: Array<Predicate<StoreStateChange<S, T>>>): Observable<MutationRequestWrapper<T>> {

        filters.forEach(
            (f: Predicate<StoreStateChange<S, T>>) => {
                stream = stream.pipe(filter(f));
            }
        );

        return stream.pipe(
            map(
                (stateChange: StoreStateChange<S, T>) => {
                    return new MutationRequestWrapper(
                          stateChange.value, null, null, stateChange.id, stateChange.type);
                }
            )
        );
    }

    mutate<V, M, S, E>(
        value: V, mutationType: M,
        successHandler: MessageFunction<S>,
        errorHandler?: MessageFunction<E>): boolean {

        const mutation: StoreStateMutation<M, V, S, E> = new StoreStateMutation(mutationType, value);
        mutation.errorHandler = errorHandler;
        mutation.successHandler = successHandler;

        this.bus.sendRequestMessage(
            this.cacheMutationChan,
            mutation,
            this.getName()
        );

        this.log.debug('🗄️ Store: Fired mutation command', this.type);
        return true;
    }

    onMutationRequest<M, E = any>(objectType: T, ...mutationType: M[]): MutateStream<T, E> {

        const stream: Observable<StoreStateMutation<M, T>> =
            this.bus.api.getChannel(this.cacheMutationChan, this.getName())
                .pipe(
                    map(
                        (msg: Message) => {
                            return msg.payload as StoreStateMutation<M, T>;
                        }
                    )
                );

        const filterStream: Observable<MutationRequestWrapper<T, any>> =
            stream.pipe(
                filter(
                    (mutation: StoreStateMutation<M, T>) => {
                        if (mutationType && mutationType.length > 0) {
                            return (mutationType.indexOf(mutation.type) >= 0);
                        }
                        return true;
                    }
                ),
                map(
                    (stateChange: StoreStateMutation<M, T>) => {
                        return new MutationRequestWrapper(
                            stateChange.value,
                            stateChange.successHandler,
                            stateChange.errorHandler
                        );
                    }
                )
            );

        return new MutateStreamImpl<T, E>(filterStream, this.log);
    }

    reset(): void {
        this.cache.clear();
        this.cacheInitialized = false;
        this.log.warn(`🗄️ Store: [${this.name}] (${this.uuid}) has been reset. All data wiped `, this.name);

        if (this.isGalacticStore()) {
            this.requestStoreContent();
        }
    }

    whenReady(readyFunction: MessageFunction<Map<UUID, T>>): void {
        this.bus.listenOnce(this.cacheReadyChan).handle(readyFunction);

        // push this off into the event loop, make sure all consumers are async.
        setTimeout(
            () => {
                if (this.cacheInitialized) {
                    this.log.debug(`🗄️ Store: [${this.name}] (${this.uuid}) Ready! Contains ${this.allValuesAsMap().size} values`, this.name);
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

    startAutoReload(timeToLiveInMs: number = 10000): void { // defaults to 10 seconds.
        if (this.isGalacticStore()) {
            this.log.warn('Called startAutoReload() API on galactic store: ' + this.type);
            return;
        }
        this.reloadTTL = timeToLiveInMs;
        this.stopAutoReload(); // stop any existing reload interval

        if (timeToLiveInMs > 0 && this.reloadHandler) {
            this.reloadIntervalTracker = setInterval(
                () => {
                    this.reloadHandler();
                },
                timeToLiveInMs
            );
        }
    }

    stopAutoReload(): void {
        if (this.isGalacticStore()) {
            this.log.warn('Called stopAutoReload() API on galactic store: ' + this.type);
            return;
        }

        if (this.reloadIntervalTracker) {
            clearInterval(this.reloadIntervalTracker);
        }
    }

    refreshApiDelay(): void {
        if (this.isGalacticStore()) {
            this.log.warn('Called refreshApiDelay() API on galactic store: ' + this.type);
            return;
        }

        this.stopAutoReload();
        if (this.reloadHandler) {
            this.reloadIntervalTracker = setInterval(
                () => {
                    this.reloadHandler();
                },
                this.reloadTTL
            );
        } else {
            this.log.warn(`Unable to refresh API delay for ${this.name}, no reloadHandler has been defined.`,
                this.getName());
        }
    }

    reloadStore(): void {
        if (this.isGalacticStore()) {
            this.log.warn('Called reloadStore() API on galactic store: ' + this.type);
            return;
        }

        this.refreshApiDelay();
        if (this.reloadHandler) {
            this.reloadHandler();
        } else {
            this.log.warn(`Unable to reload store ${this.name}, no reloadHandler has been defined.`,
                this.getName());
        }
    }

    setAutoReloadServiceTrigger(serviceCallFunction: Function): void {
        if (this.isGalacticStore()) {
            this.log.warn('Called setAutoReloadServiceTrigger() API on galactic store: ' + this.type);
            return;
        }

        this.reloadHandler = serviceCallFunction;
    }
}
