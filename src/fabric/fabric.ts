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


export class FabricApiImpl implements FabricApi {

    public static readonly versionChannel = 'fabric-version';

    private connected: boolean = false;
    private sessionId: UUID;
    private connectHandler: MessageFunction<string>;
    private disconnectHandler: Function;
    private connectionStore: BusStore<FabricConnectionState>;
    private fabricDisconnectHandler: MessageHandler<StompBusCommand>;
    private accessTokenSessionStorageKey: string = 'csp-auth-token';

    constructor(private readonly bus: EventBus) {
        this.bus = bus;
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
        numRelays: number = 1,
        autoReconnect: boolean = false): void {

        if (!this.connected) {

            // open core channels
            this.bus.markChannelAsGalactic(FabricApiImpl.versionChannel);

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
                        '/topic',
                        '/queue',
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

    generateFabricRequest<T>(requestCommand: string, payload?: T): APIRequest<T> {
        if (!payload) {
            payload = '' as any;
        }
        return new APIRequest<T>(requestCommand, payload, GeneralUtil.genUUID(), 1);
    }

    getFabricVersion(): Observable<string> {

        let handler: MessageHandler;

        if (this.connected) {
            handler = this.bus.requestOnceWithId(
                GeneralUtil.genUUIDShort(),
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
        this.accessTokenSessionStorageKey = key;
    }

    getAccessTokenSessionStorageKey(): string {
        return this.accessTokenSessionStorageKey;
    }

    getAccessToken(): string {
        return sessionStorage.getItem(this.getAccessTokenSessionStorageKey()) || '';
    }
}
