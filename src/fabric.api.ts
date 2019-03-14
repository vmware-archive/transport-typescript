/**
 * Copyright(c) VMware Inc. 2019
 */

import { UUID } from './bus/store/store.model';
import { MessageFunction } from './bus.api';
import { StoreStream } from './store.api';
import { APIRequest } from './core/model/request.model';
import { Observable } from 'rxjs';

export enum FabricConnectionState {
    Connected = 'connected',
    Disconnected = 'disconnected',
    Failed = 'failed'
}

/**
 * Application Fabric APIs (AppFabric)
 *
 * Please note, these are new API's and will be changed as we evolve them. Please consider these APIs
 * evolutionary.
 */
export interface FabricApi {

    /**
     * Set current Cloud Services Organization. Required for a lot of services.
     *
     * @param orgId the current Organization ID.
     */
    setFabricCurrentOrgId(orgId: UUID): void;

    /**
     *  Connect to fabric endpoint. Defaults to current host and port on '/fabric'
     *
     * @param endpoint What endpoint are you connecting to? Defaults to /fabric
     * @param host hostname of your fabric endpoint, defaults to current host
     * @param port port of your fabric endpoint, defaults to current port
     * @param numRelays how many relays are being used? Defaults to 1.
     * @param connectHandler lambda to fire when the fabric is connected.
     * @param disconnectHandler  lambda to fire when the fabric is disconnected.
     * @param autoReconnect if disconnected, want to auto-reconnect? defaults to false.
     */
    connect(
        connectHandler: MessageFunction<string>,
        disconnectHandler: Function,
        host?: string,
        port?: number,
        endpoint?: string,
        numRelays?: number,
        autoReconnect?: boolean): void;

    /**
     * Disconnect from fabric.
     */
    disconnect(): void;

    /**
     * returns current fabric connection status.
     */
    isConnected(): boolean;

    /**
     * Grab a reference to state stream for connections.
     */
    whenConnectionStateChanges(): StoreStream<FabricConnectionState>;

    /**
     * Generate a payload designed for fabric services, essentially a shortcut.
     * @param requestCommand request command to run.
     * @param payload to send with request command.
     */
    generateFabricRequest<T>(requestCommand: string, payload: T): APIRequest<T>;

    /**
     * Get fabric version.
     */
    getFabricVersion(): Observable<string>;

}
