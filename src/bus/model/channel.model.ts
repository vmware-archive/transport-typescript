/*
 * Copyright 2017-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Subject } from 'rxjs';
import { Message } from './message.model';
import { UUID } from '../store/store.model';
import { StompParser } from '../../bridge/stomp.parser';
import { GeneralUtil } from '../../util/util';

/**
 * A Channel object represents a single channel on the message bus.
 * This enables many-to-many transactions. Anyone can send a packet on a stream, and anyone can subscribe to a stream.
 * There is no restriction on the object that is placed on a stream and its type is only known to the sender and the
 * receiver.
 *
 * The Channel stream allows for packets and errors to be transmitted and both can be received by subscribers.
 */

export interface Subscriber {
    id: UUID;
    subscribed: number;
}

export interface Observer {
    id: UUID;
    subscribed: number;
}

export class Channel {
    private _name: string;
    private _refCount: number;
    private _closed: boolean;
    private _galactic: boolean;
    private _private: boolean;

    private _streamObject: Subject<Message>;

    public subscribers: Map<UUID, Subscriber>;
    public observers: Map<UUID, Observer>;
    public latestObserver: UUID;

    constructor(name: string) {
        this._name = name;
        this._refCount = 0;
        this._streamObject = new Subject<Message>();
        this._closed = false;
        this._galactic = false;
        this._private = false;
        this.subscribers = new Map<UUID, Subscriber>();
        this.observers = new Map<UUID, Observer>();
    }

    /**
     * Returns the stream object for subscription
     *
     * @returns {Subject<Message>}
     */
    get stream(): Subject<Message> {
        return this._streamObject;
    }

    createSubscriber(): UUID {
        const id: UUID = StompParser.genUUID();
        this.subscribers.set(id, {id: id, subscribed: new Date().getDate()});
        return id;
    }

    removeSubscriber(uuid: UUID): boolean {
        return this.subscribers.delete(uuid);
    }

    getSubscriber(uuid: UUID): Subscriber {
        return this.subscribers.get(uuid);
    }

    createObserver(): UUID {
        const id: UUID = GeneralUtil.genUUID();
        this.observers.set(id, {id: id, subscribed: new Date().getDate()});
        this.latestObserver = id;
        return id;
    }

    removeObserver(uuid: UUID): boolean {
        return this.observers.delete(uuid);
    }

    getObserver(uuid: UUID): Subscriber {
        return this.observers.get(uuid);
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
        setTimeout(() => {
            this._streamObject.next(message);
        });
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

    setLocal() {
        this._galactic = false;
        return this;
    }

    get galactic(): boolean {
        return this._galactic;
    }

    setPrivate() {
        this._private = true;
    }

    setPublic() {
        this._private = false;
    }

    get isPrivate(): boolean {
        return this._private;
    }
}
