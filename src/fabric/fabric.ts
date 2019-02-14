/**
 * Copyright(c) VMware Inc. 2019
 */
import { FabricApi, FabricConnectionState } from '../fabric.api';
import { EventBus, MessageFunction, MessageHandler, ORG_ID, ORGS } from '../bus.api';
import { BusStore, StoreStream, UUID } from '../bus';
import { BrokerConnector, StompBusCommand, StompClient } from '../bridge';

export enum Stores {
    FabricConnection = 'stores::fabric-connection'
}

export enum FabricConnectionStoreKey {
    State = 'state',
}

export class FabricApiImpl implements FabricApi {

    private connected: boolean = false;
    private sessionId: UUID;
    private connectHandler: MessageFunction<string>;
    private disconnectHandler: Function;
    private connectionStore: BusStore<FabricConnectionState>;
    private fabricDisconnectHandler: MessageHandler<StompBusCommand>;

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
        this.bus.stores.getStore(ORGS).put(ORG_ID, orgId, null);
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
}
