/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { UUID } from '../store/store.model';
import { MessageType, SentFrom } from '../../bus.api';

/**
 * A Message object represents a single message on the message bus.
 * Messages can contain either a data payload or an error payload.
 * Messages can be a request, or a response. An error notification is always a response.
 * The content of the payload is opaque and its format is only decodable by the sender(s) and the receiver(s)
 * At present, there is only a placeholder for the Message Schema. This is expected to be replaced with JSON-schema
 */

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
    private versionNumber: number;
    private mId: UUID;
    private sentFrom: SentFrom;

    constructor(id?: UUID, version: number = 1) {
        this.mId = id;
        this.versionNumber = version;
    }

    private build(type?: MessageType, payload?: any, error = false) {
        this._isError = error;
        this._payload = payload;
        this._type = type;
        return this;
    }

    request(payload: any) {
        return this.build(MessageType.MessageTypeRequest, payload);
    }

    response(payload: any) {
        return this.build(MessageType.MessageTypeResponse, payload);
    }

    error(error: any) {
        return this.build(MessageType.MessageTypeError, error, true);
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

    get id(): UUID {
        return this.mId;
    }
    
    get version(): number {
        return this.versionNumber;
    }

    get sender(): SentFrom {
        return this.sentFrom;
    }

    set sender(sender: SentFrom) {
        this.sentFrom = sender;
    }
}
