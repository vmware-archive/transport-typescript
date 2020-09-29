/*
 * Copyright 2017-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Observable, Subject, fromEvent, pipe } from 'rxjs';
import { StompParser } from './stomp.parser';
import { StompMessage, StompConfig } from './stomp.model';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { GeneralUtil } from '../util/util';
import { Logger } from '../log';
import { EventBus, EventBusEnabled } from '../bus';
import { FabricConnectionState } from '../fabric.api';
import { FabricConnectionStoreKey, Stores } from '../fabric/fabric.model';

export interface StompTransaction {
    id: string;
    receiptId: string;
    receiptObservable: Subject<StompMessage>;
    commit: Function;
    abort: Function;
}

export enum ConnectionState {
   Connecting,
   Connected,
   Disconnected
}

export class StompClient implements EventBusEnabled {

    getName(): string {
        return (this as any).constructor.name;
    }

    static STOMP_CONFIGURED: string = 'CONFIGURED';
    static STOMP_CONNECT: string = 'CONNECT';
    static STOMP_CONNECTED: string = 'CONNECTED';
    static STOMP_CONNECTED_DUPLICATE: string = 'CONNECTED_DUPLICATE';
    static STOMP_MESSAGE: string = 'MESSAGE';
    static STOMP_RECEIPT: string = 'RECEIPT';
    static STOMP_DISCONNECT: string = 'DISCONNECT';
    static STOMP_DISCONNECTING: string = 'DISCONNECTING';
    static STOMP_DISCONNECTED: string = 'DISCONNECTED';
    static STOMP_SUBSCRIBE: string = 'SUBSCRIBE';
    static STOMP_SUBSCRIBED: string = 'SUBSCRIBED';
    static STOMP_UNSUBSCRIBE: string = 'UNSUBSCRIBE';
    static STOMP_UNSUBSCRIBED: string = 'UNSUBSCRIBED';
    static STOMP_INVALIDMONITOR: string = 'INVALID_MONITOR';
    static STOMP_SEND: string = 'SEND';
    static STOMP_ACK: string = 'ACK';
    static STOMP_BEGIN: string = 'BEGIN';
    static STOMP_ABORT: string = 'ABORT';
    static STOMP_ERROR: string = 'ERROR';
    static STOMP_COMMIT: string = 'COMMIT';

    private _socket: WebSocket;
    private _socketOpenObserver: Observable<Event>;
    private _stompConnectedObserver: Subject<Boolean>;
    private _socketMessageObserver: Observable<MessageEvent>;
    private _socketErrorObserver: Observable<Error>;
    private _socketCloseObserver: Observable<CloseEvent>;
    private _subscriptionObserver: Subject<StompMessage>;
    private _ackObserver: Subject<StompMessage>;
    private _config: StompConfig;
    private _socketConnected: boolean = false;
    private _stompConnected: boolean = false;
    private _useMockSocket: boolean = false;
    private _subscriptions: Map<String, Subject<StompMessage>>;

    private _transactionReceipts: Map<string, Subject<any>>;
    private _heartbeater: any;

    private currentConnectionState: ConnectionState;

    constructor(private log: Logger, private bus?: EventBus) {

        this._transactionReceipts = new Map<string, Subject<StompMessage>>();
        this._subscriptions = new Map<string, Subject<StompMessage>>();

        this._stompConnectedObserver = new Subject<Boolean>();
        this._ackObserver = new Subject<StompMessage>();
        this._subscriptionObserver = new Subject<StompMessage>();

        this.currentConnectionState = ConnectionState.Disconnected;
    }

    public getSubscription(id: string): Subject<StompMessage> {
        if (this._subscriptions.has(id)) {
            return this._subscriptions.get(id);
        }
        return null;
    }

    get connectionState(): ConnectionState {
        return this.currentConnectionState;
    }

    get clientSocket(): any {
        return this._socket;
    }

    get socketOpenObserver(): Observable<Event> {
        if (this._socketOpenObserver) {
            return this._socketOpenObserver;
        }
        return null;
    }

    get socketMessageObserver(): Observable<MessageEvent> {
        if (this._socketMessageObserver) {
            return this._socketMessageObserver;
        }
        return null;
    }

    get socketCloseObserver(): Observable<CloseEvent> {
        if (this._socketCloseObserver) {
            return this._socketCloseObserver;
        }
        return null;
    }

    get socketErrorObserver(): Observable<Error> {
        if (this._socketErrorObserver) {
            return this._socketErrorObserver;
        }
        return null;
    }

    get socketConnectedObserver(): Subject<Boolean> {
        return this._stompConnectedObserver;
    }

    get socketACKObserver(): Subject<StompMessage> {
        return this._ackObserver;

    }

    get socketSubscriptionObserver(): Subject<StompMessage> {
        return this._subscriptionObserver;

    }

    public useMockSocket() {
        this._useMockSocket = true;
    }

    public connect(config: StompConfig): Subject<Boolean> {

        if (this._socket && this._stompConnectedObserver !== null) {
            return this._stompConnectedObserver;
        }

        return this.create(config);
    }

    public disconnect(messageHeaders?: any): void {
        let headers = messageHeaders || {};
        if (this._socket) {
            headers.receipt = 'disconnect-' + GeneralUtil.genUUID();
            this.transmit(StompClient.STOMP_DISCONNECT, headers);
            this._socket.close();
        } else {
            this.log.warn('Uable to disconnect client, no socket open', this.getName());
        }
    }


    public send(destination: string, messageHeaders?: any, body?: any): boolean {

        let headers = messageHeaders || {};
        headers.destination = destination;
        return this.transmit(StompClient.STOMP_SEND, headers, body);
    }


    public subscribeToDestination(destination: string,
                                  id: string, headers?: any): Subject<StompMessage> {

        if (this.getSubscription(id) !== null) {
            return this.getSubscription(id);
        }

        headers = headers || {};
        headers.destination = destination;
        headers.id = id;

        // check if config requires ACK or not.
        if (this._config.getConfig().requireACK) {
            headers.ack = 'client';
        }

        let subscriptionSubject = new Subject<StompMessage>();
        this._subscriptions.set(id, subscriptionSubject);

        this.transmit(StompClient.STOMP_SUBSCRIBE, headers);

        setTimeout(() => { // ensure async trigger.
            this._subscriptionObserver.next(StompParser.frame(StompClient.STOMP_SUBSCRIBE, headers));
        });

        return subscriptionSubject;
    }

    public unsubscribeFromDestination(id: string, headers?: any): void {
        headers = headers || {};
        headers.id = id;

        this.transmit(StompClient.STOMP_UNSUBSCRIBE, headers);

        setTimeout(() => {
            let subscription = this.getSubscription(id);
            if (subscription) {
                subscription.complete();
                this.deleteSubscription(id);
            } else {
                this.log.debug('Tried to complete subscription that did not exist: ' + id, this.getName());
            }
        });

    }

    public beginTransaction(transactionId: string, header?: any): StompTransaction {
        let headers = header || {};
        headers.transaction = GeneralUtil.genUUID();
        if (transactionId) {
            headers.transaction = transactionId;
        }
        if (!headers.receipt) {
            headers.receipt = GeneralUtil.genUUID();
        }

        // store this receipt so we can let the user know if/when we get a notification back.
        let transactionSubject = new Subject<StompMessage>();
        this._transactionReceipts.set(headers.receipt, transactionSubject);

        let txWrapper = {
            id: headers.transaction,
            receiptId: headers.receipt,
            receiptObservable: transactionSubject,
            commit: () => {
                this.commit(headers.transaction);
            },
            abort: () => {
                this.abort(headers.transaction);
            },
        };

        this.log.debug('Starting STOMP Transaction: ' + headers.transaction, this.getName());
        this.transmit(StompClient.STOMP_BEGIN, headers);
        return txWrapper;
    }

    private deleteSubscription(id: string): void {
        this._subscriptions.delete(id);
    }

    private onStompError(frame: StompMessage) {
        this.log.error('Error with STOMP Client on WebSocket: ' + frame.command + frame.body, this.getName());
        this.sendStompErrorToSubscribers(frame.headers, frame.body);
    }

    private onError(err: any) {
        let frame: StompMessage;
        try {
            frame = StompParser.unmarshal(err.data);
        } catch (e) {
            this.log.info('Error is not STOMP packet, cannot be unmarshalled', this.getName());
        }

        this.currentConnectionState = ConnectionState.Disconnected;
        // switch connection state to error for fabric consumers.
        if (this.bus) {
            const connString: string = GeneralUtil.getFabricConnectionString(this._config.host, this._config.port, this._config.endpoint);
            this.log.debug('Informing Fabric subscribers that the connection has failed via store.', this.getName());
            this.bus.fabric
                .getConnectionStateStore(connString)
                .put(connString, FabricConnectionState.Failed, FabricConnectionState.Failed);
        }

        this.log.error('Error with WebSocket, Connection Failed', this.getName());
        if (frame && frame.hasOwnProperty('headers')) {
            this.sendStompErrorToSubscribers(frame.headers, 'Error occurred with WebSocket');
        }
    }

    private onClose(config: StompConfig) {
        setTimeout(() => {
            this._subscriptions.forEach((subscriber: Subject<StompMessage>, id: string) => {

                this.log.debug('Unsubscribing: ' + id, this.getName());
                //subscriber.complete();
                this.deleteSubscription(id);

            });
            this.log.info('WebSocket has been closed', this.getName());
        });
        this.currentConnectionState = ConnectionState.Disconnected;
        this._socketConnected = false;
        this._stompConnectedObserver = null;
        if (this._heartbeater) {
            clearInterval(this._heartbeater);
        }
    }

    public sendHeartbeat() {
        this._socket.send('\n');
    }

    private onOpen(evt: Event) {
        this._socketConnected = true;
        this.log.debug('WebSocket opened', this.getName());
        this.transmit(StompClient.STOMP_CONNECT, {
            login: this._config.getConfig().user,
            passcode: this._config.getConfig().pass,
            'heart-beat': this._config.getConfig().heartbeatOut +
                ',' + this._config.getConfig().heartbeatIn
        });

        if (this._config.getConfig().heartbeatOut
            && this._config.getConfig().heartbeatOut > 0) {

            let startIntervalFn: (handler: any, timeout?: any, ...args: any[]) => number =
                this._config.getConfig().startIntervalFunction || setInterval;

            //set up an interval to send a null char down the pipe;
            this._heartbeater = startIntervalFn(
                () => {
                    this.sendHeartbeat();
                }, this._config.getConfig().heartbeatOut
            );
        }
    }

    private transmit(command: string, headers?: any, body?: any): boolean {

        if (body instanceof ArrayBuffer) {
            body = StompParser.bufferToString(body);
        }
        return this.sendSocketMessage(StompParser
            .marshal(command, headers, body), command, headers);
    }

    private ack(messageId: string, header?: any) {
        let headers = header || {};
        headers['id'] = messageId;
        this.transmit(StompClient.STOMP_ACK, headers);
        this._ackObserver.next(StompParser.frame(StompClient.STOMP_ACK, headers));
    }

    private commit(txId: string) {

        let headers = {transaction: txId};
        this.log.debug('STOMP transaction COMMIT: ' + txId, this.getName());
        this.transmit(StompClient.STOMP_COMMIT, headers);
    }

    public abort(txId: string) {

        let headers = {transaction: txId};
        this.log.debug('STOMP transaction ABORT: ' + txId, this.getName());
        this.transmit(StompClient.STOMP_ABORT, headers);
    }

    private onMessage(evt: MessageEvent) {

        let data = evt.data;
        if (data instanceof ArrayBuffer) {
            data = StompParser.bufferToString(data);
        }

        let frame: StompMessage = StompParser.unmarshal(data);
        switch (frame.command) {

            case StompClient.STOMP_CONNECTED:

                this.log.debug('STOMP client now connected, alerting subscribers', this.getName());
                this._stompConnected = true;
                this._stompConnectedObserver.next(true);
                this.currentConnectionState = ConnectionState.Connected;
                break;

            case StompClient.STOMP_MESSAGE:

                this.log.verbose('STOMP message received: ' + evt.data, this.getName());

                // the subscription ID should have been sent back from the server
                if (frame.headers.subscription) {

                    // ensure any services using '::' is replaced with \c\c (https://stomp.github.io/stomp-specification-1.2.html)
                    const subscription = frame.headers.subscription.replace(/\\c/g, ':');

                    if (this.getSubscription(subscription) !== null) {
                        this.getSubscription(subscription).next(frame);
                    }
                }

                if (this._config.getConfig().requireACK) { // config demands an ACK yo.
                    this.ack(frame.headers['message-id']);
                }
                break;

            case StompClient.STOMP_RECEIPT:

                let receiptId: string = frame.headers['receipt-id'];
                this.log.verbose('STOMP receipt received: ' + receiptId, this.getName());

                let subject: Subject<StompMessage>
                    = this._transactionReceipts.get(receiptId);
                if (subject) {
                    subject.next(frame);
                    subject.complete(); // done with this.
                }
                this._transactionReceipts.delete(receiptId); // don't need it anymore.


                if (this._config.getConfig().requireACK) {
                    this.ack(frame.headers['receipt-id']);
                }
                break;

            case StompClient.STOMP_ERROR:

                this.log.verbose('STOMP error received: ' + evt.data, this.getName());
                this.onStompError(frame);
                break;

            default:
                break;
        }
    }

    private sendSocketMessage(data: string, command?: string, headers?: any): boolean {

        let err: string = 'Unable to send STOMP frame, socket closed or in wrong state:';
        if (this._socket) {

            if (this._socket.readyState === WebSocket.OPEN) {
                this.log.debug('Sending STOMP frame down the wire', this.getName());
                this._socket.send(data);
                return true;

            } else {
                this.log.error(err, this.getName());
                this.sendStompErrorToSubscribers(headers, err);
                return false;
            }

        }
        this.log.debug(err, this.getName());
        return false;
    }

    private sendStompErrorToSubscribers(headers: any, payload: any) {
        if (headers && headers.subscription !== null) {
            if (this.getSubscription(headers.subscription) !== null) {
                this.getSubscription(headers.subscription)
                    .error(payload);
            }
        }
    }

    private create(config: StompConfig): Subject<Boolean> {
        this._config = config;
        this._socketConnected = false;
        this._stompConnectedObserver = new Subject<Boolean>(); // rebuild for every connection
        this.currentConnectionState = ConnectionState.Connecting;

        let ws: any;
        ws = this._config.generateSocket();
        ws.binaryType = 'arraybuffer';

        // create local observers for socket events
        this._socketOpenObserver = fromEvent(ws, 'open')
            .pipe(
                map((response: Event): Event => {
                    return response;
                })
            );

        this._socketCloseObserver = fromEvent(ws, 'close')
            .pipe(
                map((response: CloseEvent): any => { // refactor this into a type and define the API correctly.
                    return {event: response, config: config};
                })
            );

        this._socketErrorObserver = fromEvent(ws, 'error')
            .pipe(
                map((response: Error): Error => {
                    return response;
                })
            );

        // wire observers.
        this._socketMessageObserver = fromEvent(ws, 'message')
            .pipe(
                map((response: MessageEvent): MessageEvent => {
                    return response;
                })
            );

        this._socketOpenObserver
            .subscribe((evt: Event) => this.onOpen(evt));

        this._socketMessageObserver
            .subscribe((evt: MessageEvent) => this.onMessage(evt));

        this._socketCloseObserver
            .subscribe((evt: CloseEvent) => this.onClose(config));

        this._socketErrorObserver
            .subscribe((err: Error) => this.onError(err));

        this._socket = ws;
        return this._stompConnectedObserver;
    }
}
