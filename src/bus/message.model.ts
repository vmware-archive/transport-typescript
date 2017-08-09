/**
 * Copyright(c) VMware Inc., 2016
 */

import { MessageSchema } from './message.schema';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

/**
 * A Message object represents a single message on the message bus.
 * Messages can contain either a data payload or an error payload.
 * Messages can be a request, or a response. An error notification is always a response.
 * The content of the payload is opaque and its format is only decodable by the sender(s) and the receiver(s)
 * At present, there is only a placeholder for the Message Schema. This is expected to be replaced with JSON-schema
 */

export enum MessageType {
    MessageTypeRequest,
    MessageTypeResponse,
    MessageTypeError
}

/**
 * Simple interface to add in generics.
 */
export interface MessageFunction<T> extends Function {
    (exec: T): void;
}

/**
 * MessageHandler encapsulates bus handling and communication from the perspective of a consumer
 */
export interface MessageHandler {

    /**
     * Handler for incoming responses
     * @param successHander handle success responses
     * @param errorHandler handle error responses
     */
    handle<T, E = any>(successHander: MessageFunction<T>, errorHandler?: MessageFunction<E>): Subscription;

    /**
     * if handler is streaming, and the handler is open, send a payload down the request channel
     * @param payload the payload you want to send.
     */
    tick(payload: any): void;

    /**
     * If responder is streaming, and the handler is open, send an error payload on the response channel
     * @param payload
     */
    error(payload: any): void;

    /**
     * Close subscriptions to channel.
     */
    close(): boolean;

    /**
     * Check if the handler has been closed.
     */
    isClosed(): boolean;

    /**
     * / Get an observable for payloads
     * @param messageType optional filter for responses, requests or errors. If left blank, you get the firehose.
     */
    getObservable<T>(messageType?: MessageType): Observable<T>;
}

/**
 * MessageResponder encapsulates bus handling and communication from the perspective of a producer or supplier.
 */
export interface MessageResponder {

    /**
     * Generate responses to requests inbound on a channel.
     * @param generateSuccessResponse handle successful requests (must return response payload to be sent)
     * @param generateErrorResponse handle errors (must return error payload to be sent)
     */
    generate<T, E>(generateSuccessResponse: MessageFunction<T>,
                   generateErrorResponse?: MessageFunction<E>): Subscription;

    /**
     * If responder is streaming, and the responder is open, send a new response message down the return channel.
     * @param payload
     */
    tick(payload: any): void;

    /**
     * Close if responder is streaming
     */
    close(): boolean;

    /**
     * Check if the responder is still listening/active.
     */
    isClosed(): boolean;

    /**
     * Get an observable for incoming (request & error) payloads
     * @param messageType optional filter for responses, requests or errors. If left blank, you get the firehose.
     */
    getObservable<T>(): Observable<T>;
}

export class MessageHandlerConfig {
    private _sendChannel: string;
    private _returnChannel: string;
    private _body: any;
    singleResponse: boolean;

    constructor(sendChannel: string, body: any, singleResponse: boolean = true, returnChannel?: string) {
        this._returnChannel = returnChannel;
        this._sendChannel = sendChannel;
        this._body = body;
        if (!this._returnChannel) {
            this._returnChannel = sendChannel;
        }
        this.singleResponse = singleResponse;
    }

    get returnChannel(): string {
        return this._returnChannel;
    }

    get sendChannel(): string {
        return this._sendChannel;
    }

    get body(): any {
        return this._body;
    }
}

export class Message {
    private _type: MessageType;
    private _payload: any;
    private _isError: boolean = false;
    private _messageSchema: MessageSchema;

    constructor(messageSchema?: MessageSchema) {
        this._messageSchema = messageSchema;
    }

    private build(type?: MessageType, payload?: any, messageSchema: MessageSchema = undefined, error = false) {
        this._isError = error;
        this._payload = payload;
        this._type = type;
        this._messageSchema = messageSchema;
        return this;
    }

    request(payload: any, messageSchema?: MessageSchema) {
        return this.build(MessageType.MessageTypeRequest, payload, messageSchema);
    }

    response(payload: any, messageSchema?: MessageSchema) {
        return this.build(MessageType.MessageTypeResponse, payload, messageSchema);
    }

    error(error: any, messageSchema?: MessageSchema) {
        return this.build(MessageType.MessageTypeError, error, messageSchema, true);
    }

    isRequest(): boolean {
        return this._type === MessageType.MessageTypeRequest;
    }

    isResponse(): boolean {
        return this._type === MessageType.MessageTypeResponse;
    }

    isError(): boolean {
        return this._type === MessageType.MessageTypeError;
    }

    get payload(): any {
        return this._payload;
    }

    set payload(payload: any) {
        this._payload = payload;
    }

    get type(): MessageType {
        return this._type;
    }

    get messageSchema(): MessageSchema {
        return this._messageSchema;
    }
}
