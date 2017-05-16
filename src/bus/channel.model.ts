/**
 * Copyright(c) VMware Inc., 2016
 */
import { Subject } from 'rxjs';
import { Message } from './message.model';

/**
 * A Channel object represents a single channel on the message bus.
 * This enables many-to-many transactions. Anyone can send a packet on a stream, and anyone can subscribe to a stream.
 * There is no restriction on the object that is placed on a stream and its type is only known to the sender and the
 * receiver.
 *
 * The Channel stream allows for packets and errors to be transmitted and both can be received by subscribers.
 */

export class Channel {
    private _name: string;
    private _refCount: number;
    private _closed: boolean;
    private _galactic: boolean;

    private _streamObject: Subject<Message>;

    constructor(name: string) {
        this._name = name;
        this._refCount = 0;
        this._streamObject = new Subject<Message>();
        this._closed = false;
        this._galactic = false;
    }

    /**
     * Returns the stream object for subscription
     *
     * @returns {Subject<Message>}
     */
    get stream(): Subject<Message> {
        return this._streamObject;
    }

    set stream(stream: Subject<Message>) {
        this._streamObject = stream;
    }

    /**
     * returns the channel identifier
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     * returns state of stream.
     *
     * @returns {boolean}
     */
    get isClosed(): boolean {
        return this._closed;
    }

    /**
     * Transmit data on the stream after switching to event loop.
     *
     * @param message Message
     */
    send(message: Message) {
        setTimeout(
            () => {
                this._streamObject.next(message);
            }, 0);
    }

    /**
     * Transmit an error on the stream
     *
     * @param err
     */
    error(err: any) {
        this._streamObject.error(err);
    }

    /**
     * Transmit a completion on the stream
     */
    complete() {
        this._closed = true;
        this._streamObject.complete();
    }

    increment(): number {
        return ++this._refCount;
    }

    decrement(): number {
        if (this._refCount > 0) {
            --this._refCount;
        }

        return this._refCount;
    }

    get refCount() {
        return this._refCount;
    }

    setGalactic() {
        this._galactic = true;
        return this;
    }

    setPrivate() {
        this._galactic = false;
        return this;
    }

    get galactic(): boolean {
        return this._galactic;
    }
}
