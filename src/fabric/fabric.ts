/**
 * Copyright(c) VMware Inc. 2019
 */
import { FabricApi, FabricConnectionState } from '../fabric.api';
import { EventBus, MessageFunction, MessageHandler, MessageType, ORG_ID, ORGS } from '../bus.api';
import { StompBusCommand } from '../bridge/stomp.model';
import { BrokerConnector } from '../bridge/broker-connector';
import { GeneralUtil } from '../util/util';
import { FabricConnectionStoreKey, Stores } from './fabric.model';
import { UUID } from '../bus/store/store.model';
import { BusStore, StoreStream } from '../store.api';
import { APIRequest } from '../core/model/request.model';
import { APIResponse } from '../core/model/response.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const HEADERS_STORE = 'bifrost-headers-store';
export const GLOBAL_HEADERS = 'global-headers';
export const GLOBAL_HEADERS_UPDATE = 'update';

export class FabricApiImpl implements FabricApi {

    public static readonly versionChannel = 'fabric-version';

    private connected: boolean = false;
    private sessionId: UUID;
    private connectHandler: MessageFunction<string>;
    private disconnectHandler: Function;
    private connectionStore: BusStore<FabricConnectionState>;
    private headersStore: BusStore<any>;
    private fabricDisconnectHandler: MessageHandler<StompBusCommand>;
    private accessTokenSessionStorageKey: string = 'csp-auth-token';
    private customHeaderPrefix: string = 'X-';
    private xsrfTokenEnabled: boolean = false;
    private xsrfTokenStoreKey: string = `${this.customHeaderPrefix}XSRF-TOKEN`;


    constructor(private readonly bus: EventBus) {
        this.bus = bus;
        this.headersStore = this.bus.stores.createStore(HEADERS_STORE);
    }

    isConnected(): boolean {
        return this.connected;
    }

    whenConnectionStateChanges(): StoreStream<FabricConnectionState> {
        return this.bus.stores.createStore(Stores.FabricConnection)
            .onAllChanges(
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
        autoReconnect: boolean = false): void {

        if (!this.connected) {

            // create reference to connection store.
            if (!this.connectionStore) {
                this.connectionStore = this.bus.stores.createStore(Stores.FabricConnection);
            }
            this.createWindowConnectionEventListeners();

            this.connectHandler = connectHandler;
            this.disconnectHandler = disconnectHandler;

            const connectedHandler = (sessionId: string) => {
                this.setConnected();
                this.sessionId = sessionId;
                this.connectHandler(sessionId);

                // listen for disconnect from broker connector.
                // this needs to be refactored in a cleaner way.
                if (!this.fabricDisconnectHandler) {
                    this.fabricDisconnectHandler = this.bus.listenStream('bifrost-services::broker.connector-status');
                    this.fabricDisconnectHandler.handle(
                        (busCommand: StompBusCommand) => {
                            switch (busCommand.command) {
                                case 'DISCONNECTED':
                                    this.setDisconnected();
                                    if (this.disconnectHandler) {
                                        this.disconnectHandler();
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
            if (this.connectHandler) {
                this.connectHandler(this.sessionId);
            }
        }
    }

    disconnect(): void {
        BrokerConnector.fireDisconnectCommand(this.bus, this.sessionId);
        this.setDisconnected();
    }

    setFabricCurrentOrgId(orgId: UUID): void {
        this.bus.stores.createStore(ORGS).put(ORG_ID, orgId, null);
    }

    private createWindowConnectionEventListeners(): void {

        // if the window object is available, lets listen for events from developer tools to aid testing.
        if (window) {
            window.addEventListener('offline', () => {
                this.setDisconnected();
                if (this.disconnectHandler) {
                    this.disconnectHandler();
                }
            });

            window.addEventListener('online', () => {
                this.setConnected();
                if (this.connectHandler) {
                    this.connectHandler(this.sessionId);
                }
            });
        }
    }

    private setConnected(): void {
        this.connected = true;
        this.connectionStore.put(
            FabricConnectionStoreKey.State,
            FabricConnectionState.Connected,
            FabricConnectionState.Connected);
    }

    private setDisconnected(): void {
        this.connected = false;
        this.connectionStore.put(
            FabricConnectionStoreKey.State,
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

    getFabricVersion(): Observable<string> {

        // open version channel.
        this.bus.markChannelAsGalactic(FabricApiImpl.versionChannel);

        let handler: MessageHandler;

        if (this.connected) {
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

    getAccessToken(): string {
        return sessionStorage.getItem(this.getAccessTokenSessionStorageKey()) || '';
    }

    setXsrfToken(token: string): void {
        this.bus.stores.createStore(Stores.XsrfToken).put(this.getXsrfTokenStoreKey(), token, 'xsrftokenSet');
    }

    getXsrfToken(): string {
        // return the token if found in the cookie
        const token: string | null = GeneralUtil.getCookie(
            this.getXsrfTokenStoreKey().replace(this.customHeaderPrefix, ''));
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
