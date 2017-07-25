import {Subject} from 'rxjs/Subject';
import {StompClient} from './stomp.client';
import {StompParser} from './stomp.parser';
import {MockSocket} from './stomp.mocksocket';

export class StompChannel {

    static connection: string = '#stomp-connection';
    static subscription: string = '#stomp-subscription';
    static messages: string = '#stomp-messages';
    static error: string = '#stomp-error';
    static status: string = '#stomp-status';

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

    constructor(config: StompConfig) {
        this._config = config;
        this._client = new StompClient();
        this._id = StompParser.genUUID();
        this._subscriptions = new Map<String, Subject<StompMessage>>();
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
}

// stomp config.
export class StompConfig {

    private _useTopics: boolean = true;
    private _useQueues: boolean = false;
    private _topicLocation: string = '/topic';
    private _queueLocation: string = '/queue';

    static generate(endpoint: string,
                    host?: string,
                    port?: number,
                    useSSL?: boolean,
                    user?: string,
                    pass?: string) {

        return new StompConfig(
            endpoint,
            host,
            port,
            user,
            pass,
            useSSL
        );
    }

    private _testMode: boolean = false;

    constructor(private _endpoint: string,
                private _host?: string,
                private _port?: number,
                private _user?: string,
                private _pass?: string,
                private _useSSL?: boolean,
                private _requireACK?: boolean,
                private _heartbeatIn?: number,
                private _heartbeatOut?: number) {

        if (!_heartbeatIn) {
            this._heartbeatIn = 0;
        }
        if (!_heartbeatOut) {
            this._heartbeatOut = 30000;
        }
    };

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
        };
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

        if (this._port) {
            hostPort += ':' + this._port;
        }

        return scheme + '://'
            + hostPort
            + this._endpoint;

    }
}
