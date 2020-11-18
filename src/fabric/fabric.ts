/*
 * Copyright 2019-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { FabricApi, FabricConnectionState } from '../fabric.api';
import { EventBus, MessageFunction, MessageHandler, MessageType, ORG_ID, ORGS } from '../bus.api';
import { StompBusCommand } from '../bridge/stomp.model';
import { BrokerConnector } from '../bridge/broker-connector';
import { GeneralUtil } from '../util/util';
import { RequestHeaderConsts, Stores } from './fabric.model';
import { UUID } from '../bus/store/store.model';
import { BusStore, StoreStream } from '../store.api';
import { APIRequest } from '../core/model/request.model';
import { APIResponse } from '../core/model/response.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const HEADERS_STORE = 'transport-headers-store';
export const GLOBAL_HEADERS = 'global-headers';
export const GLOBAL_HEADERS_UPDATE = 'update';
export const DEFAULT_ACCESS_TOKEN_KEY = 'accessToken';

export class FabricApiImpl implements FabricApi {

    public static readonly versionChannel = 'fabric-version';

    private connectedMap: Map<String, boolean>;
    private sessionIdMap: Map<String, UUID>;
    private connectHandlerMap: Map<String, MessageFunction<string>>;
    private disconnectHandlerMap: Map<String, Function>;
    private connectionStoreMap: Map<String, BusStore<FabricConnectionState>>;
    private fabricDisconnectHandler: MessageHandler<StompBusCommand>;
    private headersStore: BusStore<any>;
    private accessTokenSessionStorageKey: string = RequestHeaderConsts.CSP_AUTH_TOKEN;
    private xsrfTokenEnabled: boolean = false;
    private xsrfTokenStoreKey: string = `${RequestHeaderConsts.CUSTOM_HEADER_PREFIX}${RequestHeaderConsts.XSRF_TOKEN}`;


    constructor(private readonly bus: EventBus) {
        this.bus = bus;
        this.headersStore = this.bus.stores.createStore(HEADERS_STORE);
        this.connectedMap = new Map<String, boolean>();
        this.sessionIdMap = new Map<String, UUID>();
        this.connectHandlerMap = new Map<String, MessageFunction<string>>();
        this.disconnectHandlerMap = new Map<String, Function>();
        this.connectionStoreMap = new Map<String, BusStore<FabricConnectionState>>();
    }

    getDefaultConnectionString(): string {
        if (this.connectionStoreMap.size === 1) {
            return this.connectionStoreMap.keys().next().value.toString();
        } else if (this.connectionStoreMap.size === 0) {
            this.bus.logger.error('Could not determine the default connection string because fabric.connect() likely ' +
                'was not called first. You can either call fabric.connect() first or optionally provide ' +
                'a connection string, if you know it, to the method you were calling as an argument.', 'FabricApi');
        } else {
            this.bus.logger.error('Could not determine the default connection string. ' +
                'There is more than one active connection. Please provide the connection string manually', 'FabricApi');
        }
        return '';
    }

    getConnectionStateStore(connString?: string): BusStore<FabricConnectionState> {
        connString = connString || this.getDefaultConnectionString();
        let store: BusStore<FabricConnectionState>;
        if (!this.connectionStoreMap.has(connString)) {
            store = this.bus.stores.createStore(Stores.FabricConnection);
            this.connectionStoreMap.set(connString, store);
        } else {
            store = this.connectionStoreMap.get(connString);
        }
        return store;
    }

    isConnected(connString?: string): boolean {
        connString = connString || this.getDefaultConnectionString();
        return this.connectedMap.has(connString) && this.connectedMap.get(connString);
    }

    whenConnectionStateChanges(connString?: string): StoreStream<FabricConnectionState> {
        connString = connString || this.getDefaultConnectionString();
        if (!this.connectionStoreMap.has(connString)) {
            this.connectionStoreMap.set(connString, this.bus.stores.createStore(Stores.FabricConnection));
        }

        // immediately fire the current state of the FabricConnectionState store so it can be aware of changes to
        // fabric connection state that occurred before whenConnectionStateChanges method was called. note this logic
        // is scheduled as a macrotask so it is guaranteed to fire after the store has been subscribed.
        const currentState = this.bus.stores.getStore<FabricConnectionState>(Stores.FabricConnection).get(connString);
        if (currentState !== undefined) {
            this.bus.api.tickEventLoop(() => {
                this.bus.stores.getStore(Stores.FabricConnection).put(connString, currentState, currentState);
            });
        }

        return this.connectionStoreMap.get(connString)
            .onChange(connString,
                FabricConnectionState.Disconnected,
                FabricConnectionState.Connected,
                FabricConnectionState.Failed
            );
    }


    connect(
        connectHandler: MessageFunction<string>,
        disconnectHandler: Function,
        host?: string,
        port?: number,
        endpoint: string = '/fabric',
        topicLocation: string = '/topic',
        queueLocation: string = '/queue',
        numRelays: number = 1,
        autoReconnect: boolean = true): void {

        // create unique identifier for the session.
        const connString: string = GeneralUtil.getFabricConnectionString(host, port, endpoint);

        if (!this.connectedMap.get(connString)) {

            // create reference to connection store.
            if (!this.connectionStoreMap.get(connString)) {
                this.connectionStoreMap.set(connString, this.bus.stores.createStore(Stores.FabricConnection));
            }
            this.createWindowConnectionEventListeners(connString);

            this.connectHandlerMap.set(connString, connectHandler);
            this.disconnectHandlerMap.set(connString, disconnectHandler);

            const connectedHandler = (sessionId: string) => {
                this.setConnected(connString);
                this.sessionIdMap.set(connString, sessionId);
                this.connectHandlerMap.get(connString)(connString);

                // listen for disconnect from broker connector.
                // this needs to be refactored in a cleaner way.
                if (!this.fabricDisconnectHandler) {
                    this.fabricDisconnectHandler = this.bus.listenStream(`transport-services::broker.connector-status`);
                    this.fabricDisconnectHandler.handle(
                        (busCommand: StompBusCommand) => {
                            switch (busCommand.command) {
                                case 'DISCONNECTED':
                                    this.setDisconnected(connString);
                                    if (this.disconnectHandlerMap.get(connString)) {
                                        this.disconnectHandlerMap.get(connString)();
                                    }
                                    break;
                            }
                        }
                    );
                }
            };

            // ensure this is non-blocking
            this.bus.api.tickEventLoop(
                () => {
                    this.bus.connectBridge(
                        connectedHandler,
                        endpoint,
                        topicLocation,
                        queueLocation,
                        numRelays,
                        host,
                        port,
                        '/pub',
                        null,
                        null,
                        false,
                        autoReconnect
                    );
                }
            );
        } else {
            // already connected, handle connection state.
            if (this.connectHandlerMap.get(connString)) {
                this.connectHandlerMap.get(connString)(this.sessionIdMap.get(connString));
            }
        }
    }

    disconnect(connString?: string): void {
        connString = connString || this.getDefaultConnectionString();
        BrokerConnector.fireDisconnectCommand(this.bus, this.sessionIdMap.get(connString));
        this.setDisconnected(connString);
    }

    setFabricCurrentOrgId(orgId: UUID): void {
        this.bus.stores.createStore(ORGS).put(ORG_ID, orgId, null);
    }

    private createWindowConnectionEventListeners(connString: string): void {

        // if the window object is available, lets listen for events from developer tools to aid testing.
        if (window) {
            window.addEventListener('offline', () => {
                this.setDisconnected(connString);
                if (this.disconnectHandlerMap.has(connString)) {
                    this.disconnectHandlerMap.get(connString)();
                }
            });

            window.addEventListener('online', () => {
                this.setConnected(connString);
                if (this.connectHandlerMap.has(connString)) {
                    this.connectHandlerMap.get(connString)(this.sessionIdMap.get(connString));
                }
            });
        }
    }

    private setConnected(connString?: string): void {
        connString = connString || this.getDefaultConnectionString();
        this.connectedMap.set(connString, true);
    }

    private setDisconnected(connString?: string): void {
        connString = connString || this.getDefaultConnectionString();
        this.connectedMap.set(connString, false);
        this.connectionStoreMap.get(connString).put(
            connString,
            FabricConnectionState.Disconnected,
            FabricConnectionState.Disconnected);

    }

    generateFabricRequest<T>(requestCommand: string, payload?: T, headers?: {[key: string]: any}): APIRequest<T> {
        if (!payload) {
            payload = '' as any;
        }

        if (this.bus.fabric.isXsrfTokenEnabled()) {
            headers = {...headers, [this.bus.fabric.getXsrfTokenStoreKey()]: this.bus.fabric.getXsrfToken()};
        }

        return new APIRequest<T>(requestCommand, payload, GeneralUtil.genUUID(), 1, headers);
    }

    generateFabricResponse<T>(id: UUID,
                              payload: T,
                              error = false,
                              errorCode = 0,
                              errorMessage = '',
                              version = 1): APIResponse<T> {
        if (!payload) {
            payload = '' as any;
        }
        return new APIResponse<T>(payload,  error, errorCode, errorMessage, id, version);
    }

    getFabricVersion(connString?: string): Observable<string> {
        connString = connString || this.getDefaultConnectionString();

        // open version channel.
        this.bus.markChannelAsGalactic(FabricApiImpl.versionChannel, connString);

        let handler: MessageHandler;

        if (this.connectedMap.get(connString)) {
            handler = this.bus.requestOnceWithId(
                GeneralUtil.genUUID(),
                FabricApiImpl.versionChannel,
                this.generateFabricRequest('version', '')
            );
        } else {
            handler = null;
        }

        if (handler) {
            return handler.getObservable(MessageType.MessageTypeResponse).pipe(
                map(
                    (resp: APIResponse<string>) => {
                        return resp.payload;
                    }
                )
            );
        } else {
            return of('Version unavailable, not connected to fabric');
        }
    }

    setAccessTokenSessionStorageKey(key: string): void {
        this.bus.logger.debug(`Setting access token session storage key to: ${key}`, 'FabricApi');
        this.accessTokenSessionStorageKey = key;
    }

    getAccessTokenSessionStorageKey(): string {
        return this.accessTokenSessionStorageKey;
    }

    private _getAccessTokenFunction: () => string;
    get getAccessTokenFunction() {
        return this._getAccessTokenFunction;
    }

    set getAccessTokenFunction(value: () => string) {
        this._getAccessTokenFunction = value;
    }

    private _accessTokenHeaderKey = DEFAULT_ACCESS_TOKEN_KEY;
    get accessTokenHeaderKey(): string {
        return this._accessTokenHeaderKey;
    }

    set accessTokenHeaderKey(value: string) {
        this._accessTokenHeaderKey = value;
    }

    getAccessToken(): string {
        let token: string;
        if (this.getAccessTokenFunction) {
            token = this.getAccessTokenFunction();
        } else {
            const key = this.getAccessTokenSessionStorageKey();
            token = sessionStorage.getItem(key);
        }
        return token || '';
    }

    private _sendAccessTokenDuringHandshake = false;

    get sendAccessTokenDuringHandshake() {
        return this._sendAccessTokenDuringHandshake;
    }

    set sendAccessTokenDuringHandshake(value: boolean) {
        this._sendAccessTokenDuringHandshake = value;
    }

    private _protocols: Array<string>;

    get protocols() {
        return this._protocols;
    }

    set protocols(value: Array<string>) {
        this._protocols = value;
    }

    setXsrfToken(token: string): void {
        this.bus.stores.createStore(Stores.XsrfToken).put(this.getXsrfTokenStoreKey(), token, 'xsrftokenSet');
    }

    getXsrfToken(): string {
        // return the token if found in the cookie
        const token: string | null = GeneralUtil.getCookie(
            this.getXsrfTokenStoreKey().replace(RequestHeaderConsts.CUSTOM_HEADER_PREFIX, ''));
        if (token !== null) {
            return token;
        }

        return this.bus.stores.createStore<string>(Stores.XsrfToken).get(this.getXsrfTokenStoreKey()) || '';
    }

    setXsrfTokenStoreKey(key: string): void {
        this.bus.logger.debug(`Setting XSRF token store key to: ${key}`, 'FabricApi');
        this.xsrfTokenStoreKey = key;
    }

    getXsrfTokenStoreKey(): string {
        return this.xsrfTokenStoreKey;
    }

    isXsrfTokenEnabled(): boolean {
        return this.xsrfTokenEnabled;
    }

    setXsrfTokenEnabled(value: boolean): void {
        if (value) {
            // construct or get a xsrf token store
            this.bus.stores.createStore(Stores.XsrfToken);
        }
        this.xsrfTokenEnabled = value;
    }

    useFabricRestService(): void {
        this.bus.logger.info('Switching to Fabric based RestService, all REST calls will be routed via fabric',
            'FabricApi');
        this.bus.markChannelAsGalactic('fabric-rest');
    }

    useLocalRestService(): void {
        this.bus.logger.info('Switching local RestService, all REST calls will be routed via browser',
            'FabricApi');
        this.bus.markChannelAsLocal('fabric-rest');
    }

    getGlobalHttpHeaders(): any {
        return this.headersStore.get(GLOBAL_HEADERS);
    }
}
