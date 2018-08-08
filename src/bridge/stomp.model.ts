/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { Subject, Subscription } from 'rxjs';
import { StompClient } from './stomp.client';
import { MockSocket } from './stomp.mocksocket';
import { UUID } from '../bus/store/store.model';
import { Logger } from '../log';
import { GeneralUtil } from '../util/util';

export type BifrostSocket = WebSocket;

export class BrokerConnectorChannel {

    static connection: string = 'bifrost-services::broker.connector-connection';
    static subscription: string = 'bifrost-services::broker.connector-subscription';
    static messages: string = 'bifrost-services::broker.connector-messages';
    static error: string = 'bifrost-services::broker.connector-error';
    static status: string = 'bifrost-services::broker.connector-status';

}
export interface StompMessage {
    command: string;
    headers: any;
    body: string;
    toString(): string;
}
export interface StompBusCommand {
    destination: string;
    session: string;
    command: string;
    payload: any;
}
export interface StompSubscription {
    session: string;
    destination: string;
    id: string;
}

// session help for each broker connection
export class StompSession {

    private _id: string;
    private _subscriptions: Map<String, Subject<StompMessage>>;
    private _client: StompClient;
    private _config: StompConfig;
    private galacticSubscriptions: Map<string, Subscription>;
    private isConnected: boolean = false;
    private connCount: number = 0;
    private _applicationDestinationPrefix: string;

    constructor(config: StompConfig, private log: Logger) {
        this._config = config;
        this._client = new StompClient(log);
        this._id = GeneralUtil.genUUIDShort();
        if (config.sessionId) {
            this._id = config.sessionId;
        }
        this._subscriptions = new Map<String, Subject<StompMessage>>();
        this.galacticSubscriptions = new Map<string, Subscription>();
        if (config.applicationDestinationPrefix) {
            this._applicationDestinationPrefix = config.applicationDestinationPrefix;
        }
    }

    public get connected(): boolean {
        return this.isConnected;
    }

    public set connected(val: boolean) {
        this.isConnected = val;
    }

    public get connectionCount(): number {
        return this.connCount;
    }

    public set connectionCount(val: number) {
        this.connCount = val;
    }

    get config(): StompConfig {
        return this._config;
    }

    get client(): StompClient {
        return this._client;
    }

    get id(): string {
        return this._id;
    }

    get applicationDestinationPrefix(): string {
        return this._applicationDestinationPrefix;
    }

    connect(): Subject<Boolean> {
        return this._client.connect(this._config);
    }

    send(destination: string, messageHeaders?: any, body?: any): boolean {
        return this._client.send(destination, messageHeaders, body);
    }

    subscribe(destination: string, id: string, headers?: any): Subject<StompMessage> {

        let subject: Subject<StompMessage> =
            this._client.subscribeToDestination(destination, id, headers);

        this._subscriptions.set(id, subject);
        return subject;
    }

    unsubscribe(id: string, headers?: any): void {
        this._client.unsubscribeFromDestination(id, headers);
        this._subscriptions.delete(id);
    }

    disconnect(messageHeaders?: any): void {
        this._client.disconnect(messageHeaders);
    }

    addGalacticSubscription(chan: string, subscription: Subscription): void {
        if (!this.galacticSubscriptions.has(chan)) {
            this.galacticSubscriptions.set(chan, subscription);
        }
    }

    getGalacticSubscription(chan: string): Subscription {
        return this.galacticSubscriptions.get(chan);
    }

    removeGalacticSubscription(chan: string): void {
        if (this.galacticSubscriptions.has(chan)) {
            this.galacticSubscriptions.delete(chan);
        }
    }

    getGalacticSubscriptions(): Map<string, Subscription> {
        return this.galacticSubscriptions;
    }
}

// stomp config.
export class StompConfig {

    private _useTopics: boolean = true;
    private _useQueues: boolean = false;
    private _topicLocation: string = '/topic';
    private _queueLocation: string = '/queue';
    private numBrokerConnect: number = 1;
    public connectionSubjectRef: Subject<Boolean>; // used to manipulate multi connect messages from relays.
    public sessionId: UUID;

    static generate(endpoint: string,
                    host?: string,
                    port?: number,
                    useSSL?: boolean,
                    user?: string,
                    pass?: string,
                    applicationDesintationPrefix?: string) {

        return new StompConfig(
            endpoint,
            host,
            port,
            user,
            pass,
            useSSL,
            applicationDesintationPrefix
        );
    }

    private _testMode: boolean = false;

    constructor(private _endpoint: string,
                private _host?: string,
                private _port?: number,
                private _user?: string,
                private _pass?: string,
                private _useSSL?: boolean,
                private _applicationDestinationPrefix?: string,
                private _requireACK?: boolean,
                private _heartbeatIn: number = 0,
                private _heartbeatOut: number = 30000) {

    }

    set brokerConnectCount(count: number) {
        this.numBrokerConnect = count;
    }

    get brokerConnectCount(): number {
        return this.numBrokerConnect;
    }

    set topicLocation(val: string) {
        this._topicLocation = val;
    }

    get topicLocation() {
        return this._topicLocation;
    }

    set queueLocation(val: string) {
        this._queueLocation = val;
    }

    get queueLocation() {
        return this._queueLocation;
    }

    set useTopics(val: boolean) {
        this._useTopics = val;
    }

    set useQueues(val: boolean) {
        this._useQueues = val;
    }

    get useTopics() {
        return this._useTopics;
    }

    get useQueues() {
        return this._useQueues;
    }

    get host(): string {
        return this._host;
    }

    get endpoint(): string {
        return this._endpoint;
    }

    get port(): number {
        return this._port;
    }

    get user() {
        return this._user;
    }

    get pass(): string {
        return this._pass;
    }

    get useSSL(): boolean {
        return this._useSSL;
    }

    get requireACK(): boolean {
        return this._requireACK;
    }

    get testMode(): boolean {
        return this._testMode;
    }

    set testMode(val: boolean) {
        this._testMode = val;
    }

    public getConfig(): any {
        return {
            endpoint: this._endpoint,
            host: this._host,
            port: this._port,
            user: this._user,
            pass: this._pass,
            requireACK: this._requireACK,
            useSSL: this._useSSL,
            heartbeatIn: this._heartbeatIn,
            heartbeatOut: this._heartbeatOut,
            applicationDestinationPrefix: this._applicationDestinationPrefix
        };
    }

    public get applicationDestinationPrefix(): string {
        return this._applicationDestinationPrefix;
    }

    /* same as getConfig() just cleaner */
    get config(): Object {
        return this.getConfig();
    }

    public generateSocket(): any {
        if (this._testMode) {
            return new MockSocket();
        } else {
            return new WebSocket(this.generateConnectionURI());
        }
    }

    public generateConnectionURI(): string {
        let scheme: string = window.location.protocol === 'https:' ? 'wss' : 'ws';
        let hostPort: string = window.location.host;

        if (this._useSSL) {
            scheme = 'wss';
        }

        if (this._host) {
            hostPort = this._host;
        }

        if (this._port && this._port !== -1) {
            hostPort += ':' + this._port;
        }

        return scheme + '://'
            + hostPort
            + this._endpoint;

    }
}
