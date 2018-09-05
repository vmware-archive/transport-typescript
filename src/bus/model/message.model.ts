/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { UUID } from '../store/store.model';
import { MessageType, SentFrom } from '../../bus.api';

/**
 * A Message object represents a single message on the message bus.
 * Messages can contain either a data payload or an error payload.
 * Messages can be a command, or a response. An error notification is always a response.
 * The content of the payload is opaque and its format is only decodable by the sender(s) and the receiver(s)
 *
 * This has beeen simplified to remove TypeScript getters and setters, this is because, when using postMesssage()
 * and various other mechanisms because of The structured clone algorithm issue and deserialzing object properties.
 * You end up with an untyped object that only has the private properties ('_privateVar') exposed, none of the
 * methods either. Causes a dirty object that breaks most typed logic at runtime.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */

export class MessageHandlerConfig {
    public isHandlerConfig: boolean = true; // make it easy to determine we're dealing with a wrapped payload
    public sendChannel: string;
    public returnChannel: string;
    public body: any;
    public singleResponse: boolean;

    constructor(sendChannel: string, body: any, singleResponse: boolean = true, returnChannel?: string) {
        this.returnChannel = returnChannel;
        this.sendChannel = sendChannel;
        this.body = body;
        if (!this.returnChannel) {
            this.returnChannel = sendChannel;
        }
        this.singleResponse = singleResponse;
    }

}

export class Message {
    public type: MessageType;
    public payload: any;
    public messageError: boolean = false;
    public version: number;
    public id: UUID;
    public sender: SentFrom;
    public proxyRebroadcast: boolean = false;

    constructor(id?: UUID, version: number = 1, proxy: boolean = false) {
        this.id = id;
        this.version = version;
        this.proxyRebroadcast = proxy;
    }

    private build(type?: MessageType, payload?: any, error = false) {
        this.messageError = error;
        this.payload = payload;
        this.type = type;
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
        return this.type === MessageType.MessageTypeRequest;
    }

    isResponse(): boolean {
        return this.type === MessageType.MessageTypeResponse;
    }

    isError(): boolean {
        return this.messageError;
    }


}
