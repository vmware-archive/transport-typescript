import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {StompParser} from './stomp.parser';
import {Syslog} from '../log/syslog';
import {StompMessage, StompConfig} from './stomp.model';

import {fromEvent} from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operator/map';

const LOCATION: string = '[shared/stomp/stomp-client]';

export interface StompTransaction {
    id: string;
    receiptId: string;
    receiptObservable: Subject<StompMessage>;
    commit: Function;
    abort: Function;
}

export class StompClient {

    static STOMP_CONFIGURED: string = 'CONFIGURED';
    static STOMP_CONNECT: string = 'CONNECT';
    static STOMP_CONNECTED: string = 'CONNECTED';
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

    constructor() {

        this._transactionReceipts = new Map < string, Subject < StompMessage >>();
        this._subscriptions = new Map < string, Subject < StompMessage >>();

        this._stompConnectedObserver = new Subject<Boolean>();
        this._ackObserver = new Subject<StompMessage>();
        this._subscriptionObserver = new Subject<StompMessage>();

    }

    public getSubscription(id: string): Subject<StompMessage> {
        if (this._subscriptions.has(id)) {
            return this._subscriptions.get(id);
        }
        return null;
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
            headers.receipt = 'disconnect-' + StompParser.genUUID();
            this.transmit(StompClient.STOMP_DISCONNECT, headers);
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
                Syslog.debug('Tried to complete subscription that did not exist: ' + id);
            }
        });

    }

    public beginTransaction(transactionId: string, header?: any): StompTransaction {
        let headers = header || {};
        headers.transaction = StompParser.genUUID();
        if (transactionId) {
            headers.transaction = transactionId;
        }
        if (!headers.receipt) {
            headers.receipt = StompParser.genUUID();
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

        Syslog.debug('Starting STOMP Transaction: ' + headers.transaction, LOCATION);
        this.transmit(StompClient.STOMP_BEGIN, headers);
        return txWrapper;
    }

    private deleteSubscription(id: string): void {
        if (this.getSubscription(id) != null) {
            this._subscriptions.delete(id);
        }
    }

    private onStompError(frame: StompMessage) {
        Syslog.error('Error with STOMP client on WebSocket: ' + frame, LOCATION);
        this.sendStompErrorToSubscribers(frame.headers, frame.body);
    }

    private onError(err: any) {
        let frame: StompMessage;
        try {
            frame = StompParser.unmarshal(err.data);
        } catch (e) {
            Syslog.info('Error is not STOMP packet, cannot be unmarshalled', LOCATION);
        }
        Syslog.error('Error with WebSocket: ' + err, LOCATION);
        if (frame && frame.hasOwnProperty('headers')) {
            this.sendStompErrorToSubscribers(frame.headers, 'Error occurred with WebSocket');
        }
    };

    private onClose() {
        setTimeout(() => {
            this._subscriptions.forEach((subscriber: Subject<StompMessage>, id: string) => {

                Syslog.debug('Unsubscribing: ' + id, LOCATION);
                subscriber.complete();
                this.deleteSubscription(id);

            });
            Syslog.debug('WebSocket has been closed', LOCATION);
        });
        this._socketConnected = false;
        this._stompConnectedObserver = null;
        if (this._heartbeater) {
            clearInterval(this._heartbeater);
        }
    }

    public sendHeartbeat() {
        this._socket.send('\n');
    }

    private onOpen() {
        this._socketConnected = true;
        Syslog.debug('WebSocket opened', LOCATION);
        this.transmit(StompClient.STOMP_CONNECT, {
            login: this._config.getConfig().user,
            passcode: this._config.getConfig().pass,
            'heart-beat': this._config.getConfig().heartbeatOut +
            ',' + this._config.getConfig().heartbeatIn
        });

        if (this._config.getConfig().heartbeatOut
            && this._config.getConfig().heartbeatOut > 0) {

            //set up an interval to send a null char down the pipe;
            this._heartbeater = setInterval(
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
        Syslog.debug('STOMP transaction COMMIT: ' + txId, LOCATION);
        this.transmit(StompClient.STOMP_COMMIT, headers);
    }

    public abort(txId: string) {

        let headers = {transaction: txId};
        Syslog.debug('STOMP transaction ABORT: ' + txId, LOCATION);
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

                Syslog.debug('STOMP client now connected, alerting subscribers', LOCATION);
                this._stompConnected = true;
                this._stompConnectedObserver.next(true);
                break;

            case StompClient.STOMP_MESSAGE:

                Syslog.debug('STOMP message received: ' + evt.data, LOCATION);

                // the subscription ID should have been sent back from the server
                if (frame.headers.subscription) {
                    if (this.getSubscription(frame.headers.subscription) !== null) {
                        this.getSubscription(frame.headers.subscription).next(frame);
                    }
                }

                if (this._config.getConfig().requireACK) { // config demands an ACK yo.
                    this.ack(frame.headers['message-id']);
                }
                break;

            case StompClient.STOMP_RECEIPT:

                let receiptId: string = frame.headers['receipt-id'];
                Syslog.debug('STOMP receipt received: ' + receiptId, LOCATION);
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

                Syslog.debug('STOMP error received: ' + evt.data, LOCATION);
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
                Syslog.debug('Sending STOMP frame down the wire', LOCATION);
                this._socket.send(data);
                return true;

            } else {
                Syslog.error(err, LOCATION);
                this.sendStompErrorToSubscribers(headers, err);
                return false;
            }

        }
        Syslog.debug(err, LOCATION);
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

        let ws: any;
        ws = this._config.generateSocket();
        ws.binaryType = 'arraybuffer';

        // create local observers for socket events
        this._socketOpenObserver = Observable.fromEvent(ws, 'open')
            .map((response: Event): Event => {
                return response;
            });

        this._socketCloseObserver = Observable.fromEvent(ws, 'close')
            .map((response: CloseEvent): CloseEvent => {
                return response;
            });

        this._socketErrorObserver = Observable.fromEvent(ws, 'error')
            .map((response: Error): Error => {
                return response;
            });

        // wire observers.
        this._socketMessageObserver = Observable.fromEvent(ws, 'message')
            .map((response: MessageEvent): MessageEvent => {
                return response;
            });

        this._socketOpenObserver
            .subscribe((evt: Event) => this.onOpen());

        this._socketMessageObserver
            .subscribe((evt: MessageEvent) => this.onMessage(evt));

        this._socketCloseObserver
            .subscribe((evt: CloseEvent) => this.onClose());

        this._socketErrorObserver
            .subscribe((err: Error) => this.onError(err));

        this._socket = ws;
        return this._stompConnectedObserver;
    }
}
