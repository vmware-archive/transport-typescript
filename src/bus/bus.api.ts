/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { Syslog } from '../log/syslog';
import { StompService } from '../';
import { StoreType, UUID } from './cache/cache.model';
import { BusStore } from './cache.api';
import { MessageSchema, ErrorSchema } from './model/message.schema';
import {
    Message, MessageFunction,
    MessageHandler, MessageHandlerConfig, MessageResponder
} from './model/message.model';
import { Channel } from './model/channel.model';
import { Observable } from 'rxjs/Observable';
import { StompBusCommand } from '../bridge/stomp.model';
import { Subject } from 'rxjs/Subject';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';

export type ChannelName = string;
export type SentFrom = string;

declare global {
    interface Window { 
    
        AppEventBus: EventBus;
        AppBrokerConnector: StompService;
        AppSyslog: Syslog;
    }
}

export abstract class EventBus {

    /**
     * Reference to Low Level API.
     */
    readonly api: EventBusLowApi;

    /**
     * BusStore Methods
     */

    /**
     * Create a new store, or return the store that exists with that name.
     *
     * @param {StoreType} storeType Name of the store you want to create/get
     * @param {Map<UUID, T>} map optional map of values to prepopulate with
     * @returns {BusStore<T>} reference to the store
     */
    abstract createStore<T>(storeType: StoreType, map?: Map<UUID, T>): BusStore<T>;

    /**
     * Get an existing store, will return null if not found or does not exist.
     *
     * @param {StoreType} storeType the name of the store you want to get
     * @returns {BusStore<T>} a reference to the store of type <T>
     */
    abstract getStore<T>(storeType: StoreType): BusStore<T>;

    /**
     * Destroy all values inside a store, and the store its self.
     *
     * @param {StoreType} storeType the name of the store you want to destroy.
     */
    abstract destroyStore(storeType: StoreType): void;

    /**
     * Simple API Methods
     */

    /**
     * Send request payload to channel.
     *
     * @param {ChannelName} cname channel name to send payload to
     * @param {R} payload the payload to be sent
     * @param {SentFrom} from option name of sending actor (for logging)
     * @param {MessageSchema} schema optional schema (not yet enabled)
     */
    abstract sendRequestMessage<R>(cname: ChannelName, payload: R, from?: SentFrom, schema?: MessageSchema): void;

    /**
     * Send response payload to a channel.
     *
     * @param {ChannelName} cname channel name to send payload to
     * @param {R} payload the payload to be sent
     * @param {SentFrom} from optional name of sending actor (for logging)
     * @param {MessageSchema} schema optional schema (not yet enabled)
     */
    abstract sendResponseMessage<R>(cname: ChannelName, payload: R, from?: SentFrom, schema?: MessageSchema): void;

    /**
     * Send error payload to channel.
     *
     * @param {ChannelName} cname the channel to send the payload to
     * @param {E} payload the payload to be send
     * @param {SentFrom} from optional name of sending actor (for logging)
     * @param {ErrorSchema} schema optional schema (not yet enabled)
     */
    abstract sendErrorMessage<E>(cname: ChannelName, payload: E, from?: SentFrom, schema?: ErrorSchema): void;

    /**
     * Listen for a request on sendChannel and return a single response via the generate() method on MessageResponder.
     * The returned value will be sent as a response message on the return channel (defaults to sendChannel if left
     * blank). Once a single response has been sent, no more request messages will be processed.
     *
     * @param {ChannelName} sendChannel the channel to listen for requests
     * @param {ChannelName} returnChannel the channel to send responses to (defaults to sendChannel if left blank
     * @param {SentFrom} from optional name of actor implementing method (for logging)
     * @param schema optional schema (not yet implemented)
     * @returns {MessageResponder<T>} reference to MessageResponder, generate() function returns response payload.
     */
    abstract respondOnce<T>(sendChannel: ChannelName, returnChannel?: ChannelName,
                            from?: SentFrom, schema?: any): MessageResponder<T>;

    /**
     * Listen for requests on sendChannel and return responses via the generate() method on MessageResponder.
     * The returned value will be sent as a response message on the return channel (defaults to sendChannel if left
     * blank). The responder will continue to stream responses to each request until the unubscribe() method is called.
     *
     * @param {ChannelName} sendChannel the channel to listen for requests
     * @param {ChannelName} returnChannel the channel to send responses to (defaults to sendChannel if left blank)
     * @param {SentFrom} from optional name of actor implementing method (for logging)
     * @param schema optional schema (not yet implemented)
     * @returns {MessageResponder<T>} reference to MessageResponder, generate() function returns response payload.
     */
    abstract respondStream<T>(sendChannel: ChannelName, returnChannel?: ChannelName,
                              from?: SentFrom, schema?: any): MessageResponder<T>;

    /**
     * Send a request payload to sendChannel and listen for responses on returnChannel (defaults to sendChannel if left
     * blank). Any additional responses will continue to be handled by the MessageHandler instance returned.
     * The handle() method on the MessageHandler instance is used to process incoming responses. The handler will
     * continue to trigger with each new response, until it is closed.
     *
     * @param {ChannelName} sendChannel the channel to send the initial request to
     * @param {T} requestPayload the paylaod to be sent as the request
     * @param {ChannelName} returnChannel the return channel to listen for responses on (defaults to sendChannel)
     * @param schema optional schema (not yet implemented)
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler, handle() function receives any inbound responses.
     */
    abstract requestStream<T, R>(sendChannel: ChannelName, requestPayload: T,
                                 returnChannel?: ChannelName, schema?: any, from?: SentFrom): MessageHandler<R>;

    /**
     * Send a request payload to sendChannel and listen for a single response on returnChannel
     * (defaults to sendChannel if left blank). The handle() method on the MessageHandler instance is used to
     * process incoming responses. The handler will stop processing any further responses after the first one.
     *
     * @param {ChannelName} sendChannel the channel to send the initial request to
     * @param {T} requestPayload the paylaod to be sent as the request
     * @param {ChannelName} returnChannel the return channel to listen for responses on (defaults to sendChannel)
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @param schema optional schema (not yet implemented)
     * @returns {MessageHandler<R>} reference to MessageHandler, handle() function receives any inbound response.
     */
    abstract requestOnce<T, R>(sendChannel: ChannelName, requestPayload: T, returnChannel?: ChannelName,
                               from?: SentFrom, schema?: any): MessageHandler<R>;

    /**
     * Listen for a single response on a channel, process then automatically stop handling any more.
     *
     * @param {ChannelName} channel channel to listen to for responses.
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @returns {MessageHandler<R> reference to MessageHandler, the handle() function will process a single response.
     */
    abstract listenOnce<R>(channel: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Listen for all responses on a channel. Continue to handle until the stream is closed via the handler.
     *
     * @param {ChannelName} channel the channel to listen to for responses.
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler. the handle() function will process all responses
     * until closed.
     */
    abstract listenStream<R>(channel: ChannelName, from?: SentFrom): MessageHandler<R>;


    /**
     * Listen to a channel for a single request, handle the request then stop listening for any other new requests.
     *
     * @param {ChannelName} channel the channel to listen to for requests
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler, then handle() function will only fire once.
     */
    abstract listenRequestOnce<R>(channel: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Listen to a channel for all requests, continue handling requests until the handler is closed.
     *
     * @param {ChannelName} channel the channel to listen to for requests
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler, then handle() function will continue to fire until
     * closed.
     */
    abstract listenRequestStream<R>(channel: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Galactic Methods
     */

    /**
     * Listen to all inbound messages send on local broker mapped channel. All messages will be responses.
     *
     * @param {ChannelName} cname name of the broker mapped destination
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler. All responses will be handled via the handle() method.
     */
    abstract listenGalacticStream<R>(cname: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Check if a channel is marked as Galactic (mapped to broker) or not.
     *
     * @param {ChannelName} cname name of the channel to check
     * @returns {boolean} true if mapped.
     */
    abstract isGalacticChannel(cname: ChannelName): boolean;

    /**
     * Connect up the bridge to a new broker.
     * @param {MessageFunction<string>} readyHandler fires once the bridge is connected correctly.
     * @param {string} endpoint of the broker you're connecting to
     * @param {string} topicLocation topic prefix (defaults to /topic)
     * @param {string} queueLocation queue prefic (defaults to /queue)
     * @param {number} numBrokerRelays defaults to 1, handles multi-connect states according to relay count
     * @param {string} host the host of the STOMP broker you want to connect to
     * @param {number} port the port of the STOMP broker you want to connect to
     * @param {string} user username (if required)
     * @param {string} pass passwowrd (if required)
     * @param {boolean} useSSL run over WSS?
     * @returns {MessageHandler<StompBusCommand>} connected commands will auto trigger the readyHandler().
     */
    abstract connectBridge(readyHandler: MessageFunction<string>,
                           endpoint: string,
                           topicLocation: string,
                           queueLocation?: string,
                           numBrokerRelays?: number,
                           host?: string,
                           port?: number,
                           user?: string,
                           pass?: string,
                           useSSL?: boolean): MessageHandler<StompBusCommand>;

    /**
     * Unsubscribe from a Galactic Channel. Will send an UNSUBSCRIBE message to broker.
     *
     * @param {ChannelName} cname
     * @param {SentFrom} from optional calling actor (for logging)
     */
    abstract closeGalacticChannel(cname: ChannelName, from?: SentFrom): void;

    /**
     * Fire a galactic send notification to the montitor like it was a regular send on Observable. The
     * bridge will then pick this up and fire a SEND frame down the wire to that destination.
     *
     * @param {ChannelName} cname galactic channel name to send to
     * @param {P} payload payload of message
     * @param {SentFrom} from optional calling actor (for logging)
     */
    abstract sendGalacticMessage<P>(cname: ChannelName, payload: P, from?: SentFrom): void;

    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param {ChannelName} cname channel name  you want to close.
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {boolean} true if channel can be closed or not.
     */
    abstract closeChannel(cname: ChannelName, from?: SentFrom): boolean;

}

/**
 * Event Bus Lower Level API's are available if more control over channels is required, or building extensions
 * using the Monitor API.
 */
export interface EventBusLowApi {

    /**
     * Returns the map for monitoring externally (read-only)
     *
     * @returns {Map<string, Channel>} map of all channels.
     */
    readonly channelMap: Map<ChannelName, Channel>;

    /**
     * A new channel is created by the first reference to it. All subsequent references to that channel are handed
     * the same stream to subscribe to. Accessing this method increments the channels reference count.
     * This method subscribes to both request and response messages. See below for specific directional methods.
     * This method is not filtered.
     *
     * This is a raw object that encapsulates the channel stream.
     *
     * @param {ChannelName} name
     * @param {SentFrom} from
     * @returns {Channel}
     */
    getChannelObject(name: ChannelName, from?: SentFrom): Channel;

    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     * Automatically unpack wrapped messages.
     *
     * @param {ChannelName} cname name of the channel you want to subscribe to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {Observable<Message>} Observable that can be subscribed to, Message object will be ticked on stream.
     */
    getChannel(cname: ChannelName, from?: SentFrom): Observable<Message>;

    /**
     * Filter bus events that contain request messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {Observable<Message>} Observable that will emit a request Message to any subscribers.
     */
    getRequestChannel(name: ChannelName, from?: SentFrom): Observable<Message>;

    /**
     * Filter bus events that contain response messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} cname name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {Observable<Message>} Observable that will emit a response Message to any subscribers.
     */
    getResponseChannel(cname: ChannelName, from?: SentFrom): Observable<Message>;

    /**
     * Filter bus events that contain error messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} cname name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {Observable<Message>} Observable that will emit an error Message to any subscribers.
     */
    getErrorChannel(cname: ChannelName, from?: SentFrom): Observable<Message>;

    /**
     * Get or create a galactic channel. Channel will be mapped to broker destination and picked up by the bridge.
     *
     * @param {ChannelName} cname
     * @param {SentFrom} from
     * @returns {Observable<Message>}
     */
    getGalacticChannel(cname: ChannelName, from: SentFrom): Observable<Message>;

    /**
     * Send simple API message to MessageResponder enabled calls. (non low-level API's)
     *
     * @param {ChannelName} cname
     * @param payload
     * @param {SentFrom} name
     * @param schema
     */
    sendRequest(cname: ChannelName, payload: any, name?: SentFrom, schema?: any): void;

    /**
     * Send simple API message to MessageResponder enabled calls. (non low-level API's)
     *
     * @param {ChannelName} cname channel name to send response to.
     * @param payload payload to send to simple API.
     * @param {SentFrom} name option name of calling actor (for logging)
     * @param schema optional schema (not yet in use).
     */
    sendResponse(cname: ChannelName, payload: any, name?: SentFrom, schema?: any): void;

    /**
     *  Used internally to send messages to simpler API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {SentFrom} name optional calling actor (for logging)
     * @param schema optional schema (not currently used)
     * @returns {MessageHandler<R>} reference to MessageHandler<R>
     */
    request<R>(handlerConfig: MessageHandlerConfig, name?: SentFrom, schema?: any): MessageHandler<R>;

    /**
     * Used internally to send messages to simple API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {SentFrom} name optional calling actor (for logging)
     * @param schema optional schema (not currently used)
     * @returns {MessageHandler<R>} reference to MessageResponder<R>
     */
    respond<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom, schema?: any): MessageResponder<R, E>;

    /**
     * Used internally to interact with simpler API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {boolean} requestStream listen to requests? defaults to responses only.
     * @param {SentFrom} name optional calling actor (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler<R>
     */
    listen<R>(handlerConfig: MessageHandlerConfig, requestStream?: boolean, name?: SentFrom): MessageHandler<R>;

    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param {ChannelName} cname channel you want to close
     * @param {SentFrom} from optional calling actor (for logging)
     */
    close(cname: ChannelName, from?: SentFrom): boolean;

    /**
     * Complete the channel stream.
     *
     * @param {ChannelName} cname channel you want to complete. This channel will no longer broadcast to subscribers.
     * @param {SentFrom} from
     */
    complete(cname: ChannelName, from?: SentFrom): boolean;

    /**
     * Total number of listeners across all channels.
     *
     * @returns {number}
     */
    countListeners(): number;

    /**
     * Destroy all channels, regardless of whether they still have subscribers.
     * This is intended to be used in afterEach during jasmine tests, so that
     * subscribers from previous tests never fire in subsequent tests.
     */
    destroyAllChannels(): void;

    /**
     * Get a count of how many references there are to a channel.
     *
     * @param {ChannelName} cname name of the channel
     * @returns {number} number of references currently held.
     */
    refCount(cname: ChannelName): number;

    /**
     * Increment a channel ref count.
     * This should only be used by extensions manipulating streams.
     *
     * @param {string} cname channel you want to increment
     * @returns {number} the new refcount.
     */
    increment(cname: string): number;

    /**
     * Get a subscription to the monitor channel.
     *
     * @returns {Subject<any>} live stream of bus events.
     */
    getMonitor(): Subject<Message>;

    /**
     * Get raw monitor channel object.
     *
     * @returns {Channel}
     */
    getMonitorStream(): Channel;

    /**
     * Get current event bus logging state.
     *
     * @returns {boolean} true if enabled.
     */
    isLoggingEnabled(): boolean;

    /**
     * Turn logging on/off
     *
     * @param {boolean} flag turn logging on/off.
     */
    enableMonitorDump(flag: boolean): void;

    /**
     * Access to private logger so messages can be sequentialized.
     *
     * @returns {LoggerService} reference to the logger service.
     */
    logger(): LoggerService ;

    /**
     * For external access to messagebus private logger (so output streams are sequentialized).
     *
     * @param {string} msg log message
     * @param {SentFrom} from optional calling actor (for logging).
     */
    messageLog(msg: string, from?: SentFrom): void;

    /**
     * Set the log suppression on or off
     *
     * @param {boolean} set the flag
     */
    suppressLog(set: boolean): void;

    /**
     * Silence the log.
     *
     * @param {boolean} set the flag to true or false
     */
    silenceLog(set: boolean): void;

    /**
     * Set the log to the desired LogLevel
     * @param {LogLevel} logLevel the level you want to set.
     */
    setLogLevel(logLevel: LogLevel): void;

    /**
     * Transmit arbitrary data on a channel on the message bus if it exists.
     * This routine is called with traceback strings to allow for debugging and monitoring
     * bus traffic.
     *
     * @param {string} cname channel to send to.
     * @param {Message} message Message to be sent.
     * @param {string} from optional calling actor (for logging)
     * @returns {boolean} true if message can be sent, false if not.
     */
    send(cname: ChannelName, message: Message, from?: SentFrom): boolean;

    /**
     * Transmit error on a channel if it exists.
     *
     * @param {ChannelName} cname
     * @param err
     * @returns {boolean} true if error can be sent, false if not.
     */
    error(cname: ChannelName, err: any): boolean;

    /**
     * Push function onto the queue for next event loop tick.
     *
     * @param {Function} func function you want to execute asynchronously.
     */
    tickEventLoop(func: Function): void;

}