import { Subject } from 'rxjs/Subject';
import { Message } from './message.model';
/**
 * A Channel object represents a single channel on the message bus.
 * This enables many-to-many transactions. Anyone can send a packet on a stream, and anyone can subscribe to a stream.
 * There is no restriction on the object that is placed on a stream and its type is only known to the sender and the
 * receiver.
 *
 * The Channel stream allows for packets and errors to be transmitted and both can be received by subscribers.
 */
export declare class Channel {
    private _name;
    private _refCount;
    private _closed;
    private _galactic;
    private _streamObject;
    constructor(name: string);
    /**
     * Returns the stream object for subscription
     *
     * @returns {Subject<Message>}
     */
    readonly stream: Subject<Message>;
    /**
     * returns the channel identifier
     *
     * @returns {string}
     */
    readonly name: string;
    /**
     * returns state of stream.
     *
     * @returns {boolean}
     */
    readonly isClosed: boolean;
    /**
     * Transmit data on the stream after switching to event loop.
     *
     * @param message Message
     */
    send(message: Message): void;
    /**
     * Transmit an error on the stream
     *
     * @param err
     */
    error(err: any): void;
    /**
     * Transmit a completion on the stream
     */
    complete(): void;
    increment(): number;
    decrement(): number;
    readonly refCount: number;
    setGalactic(): this;
    setPrivate(): this;
    readonly galactic: boolean;
}
