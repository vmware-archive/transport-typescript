import { Channel } from './channel.model';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { Message } from './message.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
/**
 * The Messagebus service provides an asynchronous channel-based software bus for sharing data between services and
 * components using a subscription model. Dynamic type checking can be done by both the sender and the receiver(s),
 * but is not a requirement for what is allowed on the bus.
 *
 * Each channel on the bus is a 'Stream' object. The Messagebus is a collection of streams that are identified by
 * the channel name, and referenced through a Map object. The ES6 Map object is now supported in Typescript even in
 * ES5. The following are the interfaces to the Map class:
 *
 * interface Map<K, V> {
 *   clear(): void;
 *   delete(key: K): boolean;
 *   entries(): IterableIterator<[K, V]>;
 *   forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
 *   get(key: K): V;
 *   has(key: K): boolean;
 *   keys(): IterableIterator<K>;
 *   set(key: K, value?: V): Map<K, V>;
 *   size: number;
 *   values(): IterableIterator<V>;
 *   [Symbol.iterator]():IterableIterator<[K,V]>;
 *   [Symbol.toStringTag]: string;
 * }
 *
 * interface MapConstructor {
 *   new <K, V>(): Map<K, V>;
 *   new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
 *   prototype: Map<any, any>;
 * }
 *
 * A channel is implicitly created whenever someone calls getChannel() and no such channel exists.
 */
export declare abstract class MessageBusEnabled {
    abstract getName(): string;
}
export declare class MessagebusService implements MessageBusEnabled {
    private _channelMap;
    private log;
    private monitorChannel;
    private monitorStream;
    private enableMonitor;
    private dumpMonitor;
    constructor(_channelMap: Map<string, Channel>);
    getName(): any;
    increment(cname: string): void;
    /**
     * Returns the map for monitoring externally (read-only)
     *
     * @returns {Map<string, Channel>}
     */
    readonly channelMap: Map<string, Channel>;
    /**
     * Get a subscription to the monitor channel.
     *
     * @returns {BehaviorSubject<any>}
     */
    getMonitor(): Subject<Message>;
    /**
     * Turn
     * @param flag
     */
    enableMonitorDump(flag: boolean): boolean;
    /**
     * Access to private logger so messages can be sequentialized.
     *
     * @returns {LoggerService}
     */
    logger(): LoggerService;
    /**
     * For external access to messagebus private logger (so output streams are sequentialized).
     *
     * @param msg
     * @param from
     */
    messageLog(msg: string, from: string): void;
    /**
     * Set the log suppression on or off
     *
     * @param set
     */
    suppressLog(set: boolean): void;
    silenceLog(set: boolean): void;
    /**
     * Externally set messagebus private log level
     *
     * @param logLevel
     */
    setLogLevel(logLevel: LogLevel): void;
    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     *
     * @param cname
     * @param from
     * @returns {Subject<Message>}
     */
    getChannel(cname: string, from: string): Subject<Message>;
    getGalacticChannel(cname: string, from: string): Subject<Message>;
    isGalacticChannel(cname: string): boolean;
    /**
     * A new channel is created by the first reference to it. All subsequent references to that channel are handed
     * the same stream to subscribe to. Accessing this method increments the channels reference count.
     * This method subscribes to both request and response messages. See below for specific directional methods.
     * This method is not filtered.
     *
     * @param cname
     * @param from
     * @returns {Channel}
     */
    getChannelObject(cname: string, from: string): Channel;
    /**
     * Filter bus events that contain request messages
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    getRequestChannel(cname: string, from: string): Observable<Message>;
    /**
     * Filter bus events that contain response messages. Errors are always response messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    getResponseChannel(cname: string, from: string): Observable<Message>;
    /**
     * Channel reference count
     *
     * @param cname
     * @returns {number}
     */
    refCount(cname: string): number;
    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    close(cname: string, from: string): boolean;
    /**
     * Transmit arbitrary data on a channel on the message bus if it exists.
     * This routine is called with traceback strings to allow for debugging and monitoring
     * bus traffic.
     *
     * @param cname -> Channel to send to
     * @param message -> Message
     * @param from -> Caller name
     * @returns {boolean} -> on successful transmission
     */
    send(cname: string, message: Message, from: string): boolean;
    /**
     * Transmit an error on a channel on the message bus if it exists.
     *
     * @param cname
     * @param err Error object
     * @returns {boolean} channel existed and transmission made
     */
    error(cname: string, err: any): boolean;
    /**
     * Transmit complete() on stream.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    complete(cname: string, from: string): boolean;
    /**
     * Count listeners across all channels.
     *
     * @returns {number}
     */
    countListeners(): number;
    /**
     * Destroy all channels, regardless of whether they still have subscribers.
     * This is intended to be used in afterEach during jasmine tests, so that
     * subscribers from previous tests never fire in subsequent tests.
     *
     * @returns {void}
     */
    destroyAllChannels(): void;
    /**
     *  Destroy a Channel and remove it from our map. If it is not closed, close it first.
     *
     * @param channel
     * @param from
     * @returns {boolean}
     */
    private destroy(channel, from);
    private dumpData(mo, tag);
    /**
     * This is a listener on the monitor channel which dumps message events to the console
     */
    private monitorBus();
}
