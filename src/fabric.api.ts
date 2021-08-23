/*
 * Copyright 2019-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { UUID } from './bus/store/store.model';
import { MessageFunction } from './bus.api';
import { BusStore, StoreStream } from './store.api';
import { APIRequest } from './core/model/request.model';
import { Observable } from 'rxjs';
import { APIResponse } from './core/model/response.model';

export enum FabricConnectionState {
    Connected = 'connected',
    Disconnected = 'disconnected',
    Connecting = 'connecting',
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
     * @param connectHandler lambda to fire when the fabric is connected.
     * @param disconnectHandler  lambda to fire when the fabric is disconnected.
     * @param host hostname of your fabric endpoint, defaults to current host
     * @param port port of your fabric endpoint, defaults to current port
     * @param endpoint What endpoint are you connecting to? Defaults to /fabric
     * @param useSSL whether to use secure WebSocket protocol (wss://) instead of ws://
     * @param topicLocation What topic location are you subscribing to. /topic by default
     * @param queueLocation What queue location are you subscribing to. /queue by default
     * @param numRelays how many relays are being used? Defaults to 1.
     * @param autoReconnect if disconnected, want to auto-reconnect? defaults to true.
     */
    connect(
        connectHandler: MessageFunction<string>,
        disconnectHandler: Function,
        host?: string,
        port?: number,
        endpoint?: string,
        useSSL?: boolean,
        topicLocation?: string,
        queueLocation?: string,
        numRelays?: number,
        autoReconnect?: boolean): void;

    /**
     * Disconnect from fabric.
     */
    disconnect(connString?: string): void;

    /**
     * returns current fabric connection status.
     */
    isConnected(connString?: string): boolean;

    /**
     * Get FabricConnectionState store for the given connection string.
     *
     * @param connString connection string of the target broker. if omitted, the bus will try to use the default
     * connection string which is the one, and only one active broker connection in the session. connString needs to
     * be provided always if more than one broker has been connected.
     */
    getConnectionStateStore(connString?: string): BusStore<FabricConnectionState>;

    /**
     * Grab a reference to state stream for connections.
     *
     * @param connString connection string of the target broker. if omitted, the bus will try to use the default
     * connection string which is the one, and only one active broker connection in the session. connString needs to
     * be provided always if more than one broker has been connected.
     */
    whenConnectionStateChanges(connString?: string): StoreStream<FabricConnectionState>;

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
     *
     * @param connString connection string of the target broker. if omitted, the bus will try to use the default
     * connection string which is the one, and only one active broker connection in the session. connString needs to
     * be provided always if more than one broker has been connected.
     */
    getFabricVersion(connString?: string): Observable<string>;

    /**
     * Set sessionStorage key for access token.
     * @param key key stored in sessionStorage representing the access token
     * @default 'csp-auth-token'
     */
    setAccessTokenSessionStorageKey(key: string): void;

    /**
     * Get sessionStorage key for access token. The token will be sent in a galactic call
     * as a header.
     */
    getAccessTokenSessionStorageKey(): string;

    /**
     * Function that returns an access token when called. If this is set then this function
     * is used when requesting an access token, else a token is looked for in session
     * storage under the key returned by getAccessTokenSessionStorageKey().
     * @default undefined
     */
    getAccessTokenFunction: () => string;

    /**
     * Key used when writing the access token in a message header or protocol.
     * @default 'accessToken'.
     */
    accessTokenHeaderKey: string;

    /**
     * Protocols to send to the server during websocket handshake.
     * @default undefined.
     */
    protocols: Array<string>;

    /**
     * When true "<accessTokenHeaderKey>.<token>" will be sent as a
     * sec-websocket-protocol header to the server during the websocket handshake. Useful for
     * non-cookie based authentication implementations.
     * @default false.
     */
    sendAccessTokenDuringHandshake: boolean;

    /**
     * Get access token using getAccessTokenFunction if set else session storage
     * under the key returned by getAccessTokenSessionStorageKey()
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
     * Get xsrf token either from cookie or from Transport store
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
