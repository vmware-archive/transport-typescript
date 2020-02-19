/**
 * Copyright(c) VMware Inc. 2019
 */

import { UUID } from './bus/store/store.model';
import { MessageFunction } from './bus.api';
import { StoreStream } from './store.api';
import { APIRequest } from './core/model/request.model';
import { Observable } from 'rxjs';
import { APIResponse } from './core/model/response.model';

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
     * @param topicLocation What topic location are you subscribing to. /topic by default
     * @param queueLocation What queue location are you subscribing to. /queue by default
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
        topicLocation?: string,
        queueLocation?: string,
        numRelays?: number,
        autoReconnect?: boolean): void;

    /**
     * Disconnect from fabric.
     */
    disconnect(connString: string): void;

    /**
     * returns current fabric connection status.
     */
    isConnected(connString: string): boolean;

    /**
     * Grab a reference to state stream for connections.
     */
    whenConnectionStateChanges(connString: string): StoreStream<FabricConnectionState>;

    /**
     * Generate a payload designed for fabric services, essentially a shortcut.
     * @param requestCommand request command to run.
     * @param payload to send with request command (optional)
     * @param headers to send with request body (optional)
     */
    generateFabricRequest<T>(requestCommand: string, payload?: T, headers?: {[key: string]: any}): APIRequest<T>;

    /**
     * Generate a return payload designed for fabric services, essentially a shortcut.
     * This is generally used for testing, however may come in handy when we experiment with p2p designs.
     * @param id the UUID response.
     * @param payload to send with request command (optional)
     * @param error optional error boolean
     * @param errorCode optional error code
     * @param errorMessage optional error message
     * @param version optional version number.
     */
    generateFabricResponse<T>(
        id: UUID,
        payload: T,
        error?: boolean,
        errorCode?: number,
        errorMessage?: string,
        version?: number): APIResponse<T>;

    /**
     * Get fabric version.
     */
    getFabricVersion(connString: string): Observable<string>;

    /**
     * Set sessionStorage key for access token.
     * @param key key stored in sessionStorage representing the access token
     */
    setAccessTokenSessionStorageKey(key: string): void;

    /**
     * Get sessionStorage key for access token. The token will be sent in a galactic call
     * as a header.
     */
    getAccessTokenSessionStorageKey(): string;

    /**
     * Get access token from the sessionStorage using the key defined with setAccessTokenSessionStorageKey()
     */
    getAccessToken(): string;

    /**
     * Set store key for xsrf token.
     * @param key key stored in cookie representing the xsrf token
     */
    setXsrfTokenStoreKey(key: string): void;

    /**
     * Get store key for xsrf token.
     * as a header.
     */
    getXsrfTokenStoreKey(): string;

    /**
     * Set xsrf token
     */
    setXsrfToken(token: string): void;

    /**
     * Get xsrf token either from cookie or from bifrost store
     */
    getXsrfToken(): string;

    /**
     * Get whether the XSRF token is enabled
     */
    isXsrfTokenEnabled(): boolean;

    /**
     * Set whether the XSRF token should be injected into the request headers
     * @param value
     */
    setXsrfTokenEnabled(value: boolean): void;

    /**
     * Switch to using fabric based RestService, no more security issues, un-restricted power!
     */
    useFabricRestService(): void;

    /**
     * Switch to using local based RestService, engage browser CORS and all the sandbox security you can handle.
     */
    useLocalRestService(): void;

    /**
     * Return global HTTP headers
     */
    getGlobalHttpHeaders(): any;
}
