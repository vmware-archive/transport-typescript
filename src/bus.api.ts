/**
 * Copyright(c) VMware Inc. 2016-2019
 */
import { StoreType, UUID } from './bus/store/store.model';
import { BusStoreApi } from './store.api';
import { Message, MessageHandlerConfig } from './bus/model/message.model';
import { Channel } from './bus/model/channel.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { StompBusCommand } from './bridge/stomp.model';
import { BridgeConnectionAdvancedConfig } from './bridge/bridge.model';
import { Logger } from './log/logger.service';
import { LogLevel } from './log/logger.model';
import { APIRequest } from './core/model/request.model';
import { APIResponse } from './core/model/response.model';
import { MessageProxyConfig, ProxyControl } from './proxy/message.proxy.api';
import { GeneralUtil } from './util/util';
import { FabricApi } from './fabric.api';
import { BrokerConnector } from './bridge';

// current version
const version = '0.13.2';

export type ChannelName = string;
export type SentFrom = string;

// used by VMW cloud services for store constants.
export const ORG_ID = 'orgId';
export const ORGS = 'orgs';

export enum MessageType {
    MessageTypeRequest = 'Request',
    MessageTypeResponse = 'Response',
    MessageTypeError = 'Error',
    MessageTypeControl = 'Control'
}

/**
 * Message arguments are passed through to all message handlers (if available)
 */
export interface MessageArgs {
    uuid: UUID;
    version: number;
    from: SentFrom;
}

/**
 * Simple interface for functions to add in generics and value passthrough
 */
export interface MessageFunction<T> extends Function {
    (exec: T, args?: MessageArgs): void;
}

/**
 * MessageHandler encapsulates bus handling and communication from the perspective of a consumer
 */
export interface MessageHandler<T = any, E = any> {

    /**
     * Handler for incoming responses
     * @param successHander handle success responses
     * @param errorHandler handle error responses
     */
    handle(successHander: MessageFunction<T>, errorHandler?: MessageFunction<E>): Subscription;

    /**
     * if handler is streaming, and the handler is open, send a payload down the command channel
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
    getObservable(messageType?: MessageType): Observable<T>;
}

/**
 * MessageResponder encapsulates bus handling and communication from the perspective of a producer or supplier.
 */
export interface MessageResponder<T = any, E = any> {

    /**
     * Generate responses to requests inbound on a channel.
     * @param generateSuccessResponse handle successful requests (must return response payload to be sent)
     * @param generateErrorResponse handle errors (must return error payload to be sent)
     */
    generate(generateSuccessResponse: MessageFunction<T>,
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
     * Check if the responder is still online/active.
     */
    isClosed(): boolean;

    /**
     * Get an observable for incoming (command & error) payloads
     */
    getObservable(): Observable<T>;
}

export abstract class EventBus {

    public static version: string = version;

    public static id: string = EventBus.rebuildId();

    /**
     * If you need to reset the ID of this bus, call this, but it may have undesirable effects.
     * This should only be called when re-booting the bus.
     */
    public static rebuildId(): string {
         return `eventbus-${GeneralUtil.genUUIDShort()}-${EventBus.version}`;
    }

    /**
     * Reference to Low Level API.
     */
    readonly api: EventBusLowApi;

    /**
     * Reference to Store API.
     */
    readonly stores: BusStoreApi;

    /**
     * Reference to fabric API.
     */
    readonly fabric: FabricApi;

    /**
     * Reference to the broker connector.
     */
    readonly brokerConnector: BrokerConnector;

    /**
     * Simple API Methods
     */

    /**
     * Send command payload to channel.
     *
     * @param {ChannelName} cname channel name to send payload to
     * @param {R} payload the payload to be sent
     * @param {SentFrom} from option name of sending actor (for logging)
     */
    abstract sendRequestMessage<R>(cname: ChannelName, payload: R, from?: SentFrom): void;

    /**
     * Send a command payload to a channel with a supplied ID in the command
     *
     * @param {ChannelName} cname channel to send the payload to
     * @param {R} payload the payload to be sent
     * @param {UUID} id the ID you want to attach to your command
     * @param {SentFrom} from  optional name of the sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     */
    abstract sendRequestMessageWithId<R>(cname: ChannelName, payload: R, id: UUID, from?: SentFrom,
                                         proxyBroadcast?: boolean): void;

    /**
     * Send a command payload to a channel with a supplied ID in the command
     *
     * @param {ChannelName} cname channel to send the payload to
     * @param {R} payload the payload to be sent
     * @param {UUID} id the ID you want to attach to your command
     * @param {number} version version of command you want to sent (defaults to 1)
     * @param {SentFrom} from  optional name of the sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     */
    abstract sendRequestMessageWithIdAndVersion<R>(cname: ChannelName, payload: R, id: UUID, version: number,
                                                   from?: SentFrom, proxyBroadcast?: boolean): void;

    /**
     * Send response payload to a channel.
     *
     * @param {ChannelName} cname channel name to send payload to
     * @param {R} payload the payload to be sent
     * @param {SentFrom} from optional name of sending actor (for logging)
     */
    abstract sendResponseMessage<R>(cname: ChannelName, payload: R, from?: SentFrom): void;

    /**
     * Send a response payload to a channel with a supplied ID in the response.
     * @param {ChannelName} cname the channel name to send the response payload to
     * @param {R} payload the payload you want to send in response
     * @param {UUID} id the ID you want to attach to your response
     * @param {SentFrom} from optional name of the sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     */
    abstract sendResponseMessageWithId<R>(cname: ChannelName, payload: R, id: UUID, from?: SentFrom,
                                          proxyBroadcast?: boolean): void;


    /**
     * Send a response payload to a channel with a supplied ID in the response.
     * @param {ChannelName} cname the channel name to send the response payload to
     * @param {R} payload the payload you want to send in response
     * @param {UUID} id the ID you want to attach to your response
     * @param {number} version version of command you want to sent (defaults to 1)
     * @param {SentFrom} from optional name of the sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     */
    abstract sendResponseMessageWithIdAndVersion<R>(cname: ChannelName, payload: R, id: UUID, version: number,
                                                    from?: SentFrom, proxyBroadcast?: boolean): void;

    /**
     * Send error payload to channel.
     *
     * @param {ChannelName} cname the channel to send the payload to
     * @param {E} payload the payload to be send
     * @param {SentFrom} from optional name of sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     */
    abstract sendErrorMessage<E>(cname: ChannelName, payload: E, from?: SentFrom, proxyBroadcast?: boolean): void;

    /**
     * Send error payload to channel, with an ID.
     *
     * @param {ChannelName} cname the channel to send the payload to
     * @param {E} payload the payload to be send
     * @param {UUID} id
     * @param {SentFrom} from optional name of sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     * @param {boolean} proxyBroadcast rebroadCasted message from proxy?
     */
    abstract sendErrorMessageWithId<E>(cname: ChannelName, payload: E, id: UUID, from?: SentFrom,
                                       proxyBroadcast?: boolean): void;

    /**
     * Send error payload to channel, with an ID, and a version.
     *
     * @param {ChannelName} cname the channel to send the payload to
     * @param {E} payload the payload to be send
     * @param {UUID} id the UUID you want to send with this error.
     * @param {number} version version of the error you want to sent.
     * @param {SentFrom} from optional name of sending actor (for logging)
     * @param proxyBroadcast optional flag, only required when messages originated in another bus.
     * @param {boolean} proxyBroadcast rebroadCasted message from proxy?
     */
    abstract sendErrorMessageWithIdAndVersion<E>(cname: ChannelName, payload: E, id: UUID, version: number,
                                                 from?: SentFrom, proxyBroadcast?: boolean): void;


    /**
     * Listen for a command on sendChannel and return a single response via the generate() method on MessageResponder.
     * The returned value will be sent as a response message on the return channel (defaults to sendChannel if left
     * blank). Once a single response has been sent, no more command messages will be processed.
     *
     * @param {ChannelName} sendChannel the channel to listen for requests
     * @param {ChannelName} returnChannel the channel to send responses to (defaults to sendChannel if left blank
     * @param {SentFrom} from optional name of actor implementing method (for logging)
     * @returns {MessageResponder<T>} reference to MessageResponder, generate() function returns response payload.
     */
    abstract respondOnce<T>(sendChannel: ChannelName, returnChannel?: ChannelName,
                            from?: SentFrom): MessageResponder<T>;

    /**
     * Listen for requests on sendChannel and return responses via the generate() method on MessageResponder.
     * The returned value will be sent as a response message on the return channel (defaults to sendChannel if left
     * blank). The responder will continue to stream responses to each command until the unubscribe() method is called.
     *
     * @param {ChannelName} sendChannel the channel to listen for requests
     * @param {ChannelName} returnChannel the channel to send responses to (defaults to sendChannel if left blank)
     * @param {SentFrom} from optional name of actor implementing method (for logging)
     * @returns {MessageResponder<T>} reference to MessageResponder, generate() function returns response payload.
     */
    abstract respondStream<T>(sendChannel: ChannelName, returnChannel?: ChannelName,
                              from?: SentFrom): MessageResponder<T>;

    /**
     * Send a command payload to sendChannel and listen for responses on returnChannel (defaults to sendChannel if left
     * blank). Any additional responses will continue to be handled by the MessageHandler instance returned.
     * The handle() method on the MessageHandler instance is used to process incoming responses. The handler will
     * continue to trigger with each new response, until it is closed.
     *
     * @param {ChannelName} sendChannel the channel to send the initial command to
     * @param {T} requestPayload the paylaod to be sent as the command
     * @param {ChannelName} returnChannel the return channel to listen for responses on (defaults to sendChannel)
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler, handle() function receives any inbound responses.
     */
    abstract requestStream<T, R>(sendChannel: ChannelName, requestPayload: T,
                                 returnChannel?: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Send a command payload to sendChannel with and ID and listen for responses (also with that ID)
     * on returnChannel (defaults to sendChannel if left blank). Any additional responses will continue to be handled
     * by the MessageHandler instance returned. The handle() method on the MessageHandler instance is used to process
     * incoming responses. The handler will continue to trigger with each new response, until it is closed.
     *
     * @param {UUID} uuid UUID of the message you want to sent, can also be used as a filter for incoming messages.
     * @param {ChannelName} sendChannel the channel on which you want to send your payload
     * @param {T} requestPayload the payload you want to send.
     * @param {ChannelName} returnChannel the return channel on which you want to listen.
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to the MessageHandler, handle() function receives any inbound responses.
     */
    abstract requestStreamWithId<T, R>(uuid: UUID, sendChannel: ChannelName, requestPayload: T,
                                       returnChannel?: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Send a command payload to sendChannel and listen for a single response on returnChannel
     * (defaults to sendChannel if left blank). The handle() method on the MessageHandler instance is used to
     * process incoming responses. The handler will stop processing any further responses after the first one.
     *
     * @param {ChannelName} sendChannel the channel to send the initial command to
     * @param {T} requestPayload the payload to be sent as the command
     * @param {ChannelName} returnChannel the return channel to listen for responses on (defaults to sendChannel)
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler, handle() function receives any inbound response.
     */
    abstract requestOnce<T, R>(sendChannel: ChannelName, requestPayload: T, returnChannel?: ChannelName,
                               from?: SentFrom): MessageHandler<R>;


    /**
     * Send a command payload to sendChannel with a message ID. Listens for a single response on returnChannel,
     * but only for a response with the same matching ID. Ideal for multi-message sessions where multiple consumers
     * are requesting at the same time on the same.
     * (defaults to sendChannel if left blank). The handle() method on the MessageHandler instance is used to
     * process incoming responses. The handler will stop processing any further responses after the first one.
     *
     * @param {UUID} uuid the UUID of the message.
     * @param {ChannelName} sendChannel the channel to send the command to
     * @param {T} requestPayload the payload you want to send.
     * @param {ChannelName} returnChannel the return channel to listen for responses on (defaults to send channel)
     * @param {SentFrom} from options name of the actor implementing (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler handle() function received any inbound responses.
     */
    abstract requestOnceWithId<T, R>(uuid: UUID, sendChannel: ChannelName, requestPayload: T,
                                     returnChannel?: ChannelName, from?: SentFrom): MessageHandler<R>;


    /**
     * Send a command payload to Galactic channel and listen for response that matches UUID of APIRequest.
     * (defaults to sendChannel if left blank). The handle() method on the MessageHandler instance is used to
     * process incoming responses. The handler will stop processing any further responses after the first one.
     *
     * @param {ChannelName} sendChannel the Galactic channel to send the command to
     * @param {APIRequest} request APIRequest to be sent as the command
     * @param {MessageFunction<APIResponse<R>>} successHandler for a successful response to your command
     * @param {MessageFunction<APIResponse<R>>} errorHandler for an un-successful response to your command
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @returns {MessageHandler<APIResponse>} reference to MessageHandler, handle()
     *                                             function receives any inbound response.
     * @deprecated use markChannelAsGalactic() and fabric.generateFabricRequest()
     */
    abstract requestGalactic<T, R>(
        sendChannel: ChannelName,
        request: APIRequest<T>,
        successHandler: MessageFunction<APIResponse<R>>,
        errorHandler?: MessageFunction<APIResponse<R>>,
        from?: SentFrom): void;


    /**
     * Listen for a single response on a channel, process then automatically stop handling any more.
     *
     * @param {ChannelName} channel channel to listen to for responses.
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @param {UUID} id optional ID of message you're looking for, will filter out all other messages
     * @returns {MessageHandler<R> reference to MessageHandler, the handle() function will process a single response.
     */
    abstract listenOnce<R>(channel: ChannelName, from?: SentFrom, id?: UUID): MessageHandler<R>;

    /**
     * Listen for all responses on a channel. Continue to handle until the stream is closed via the handler.
     *
     * @param {ChannelName} channel the channel to listen to for responses.
     * @param {SentFrom} from optional name of the actor implementing (for logging)
     * @param {UUID} id optional ID of message you're looking for, will filter out all other messages
     * @returns {MessageHandler<R>} reference to MessageHandler. the handle() function will process all responses
     * until closed.
     */
    abstract listenStream<R>(channel: ChannelName, from?: SentFrom, id?: UUID): MessageHandler<R>;


    /**
     * Listen to a channel for a single command, handle the command then stop online for any other new requests.
     *
     * @param {ChannelName} channel the channel to listen to for requests
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @param {UUID} id optional ID of message you're looking for, will filter out all other messages
     * @returns {MessageHandler<R>} reference to MessageHandler, then handle() function will only fire once.
     */
    abstract listenRequestOnce<R>(channel: ChannelName, from?: SentFrom, id?: UUID): MessageHandler<R>;

    /**
     * Listen to a channel for all requests, continue handling requests until the handler is closed.
     *
     * @param {ChannelName} channel the channel to listen to for requests
     * @param {SentFrom} from optional name of actor implementing (for logging)
     * @param {UUID} id optional ID of message you're looking for, will filter out all other messages
     * @returns {MessageHandler<R>} reference to MessageHandler, then handle() function will continue to fire until
     * closed.
     */
    abstract listenRequestStream<R>(channel: ChannelName, from?: SentFrom, id?: UUID): MessageHandler<R>;

    /**
     * Galactic Methods
     */

    /**
     * Listen to all inbound messages send on local broker mapped channel. All messages will be responses.
     *
     * @param {ChannelName} cname name of the broker mapped destination
     * @param {SentFrom} from optional calling actor (for logging)
     * @returns {MessageHandler<R>} reference to MessageHandler. All responses will be handled via the handle() method.
     * @deprecated use markChannelAsGalactic() and fabric.generateFabricRequest()
     */
    abstract listenGalacticStream<R>(cname: ChannelName, from?: SentFrom): MessageHandler<R>;

    /**
     * Check if a channel is marked as Galactic (mapped to broker) or not.
     *
     * @param {ChannelName} cname name of the channel to check
     * @returns {boolean} true if mapped.
     *
     */
    abstract isGalacticChannel(cname: ChannelName): boolean;

    /**
     * Marks a channel as galactic.
     * All messages sent to the channel with the "channelName" name
     * will be transmitted to the remote destinations.
     * @param {ChannelName} channelName name of the channel
     */
    abstract markChannelAsGalactic(channelName: ChannelName): void;

    /**
     * Marks channels as galactic.
     * @param {Iterable<ChannelName>} channelNames a collection of channel names.
     */
    abstract markChannelsAsGalactic(channelNames: Iterable<ChannelName>): void;

    /**
     * Marks a channel as local. All messages sent to a local channel will
     * be sent to local destinations and will NOT be sent to remote destinations.
     * @param {ChannelName} channelName name of the channel
     */
    abstract markChannelAsLocal(channelName: ChannelName): void;

    /**
     * Marks channels as local.
     * @param {Iterable<ChannelName>} channelNames a collection of channel names.
     */
    abstract markChannelsAsLocal(channelNames: Iterable<ChannelName>): void;

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
     * @param {string} applicationDestinationPrefix set the prefix for app published (galactic) messages (i.e. /pub)
     *                                              channels are postpended to this (i.e. /pub/mychannel)
     * @param {boolean} autoReconnect Automaticallty reconnect on loss of socket? Defaults to true.
     * @param {BridgeConnectionAdvancedConfig} advanced configuration settings to be used
     *                                         for the new bridge connection.
     * @returns {MessageHandler<StompBusCommand>} connected commands will auto trigger the readyHandler().
     */
    abstract connectBridge(readyHandler: MessageFunction<string>,
                           endpoint: string,
                           topicLocation: string,
                           queueLocation?: string,
                           numBrokerRelays?: number,
                           host?: string,
                           port?: number,
                           applicationDestinationPrefix?: string,
                           user?: string,
                           pass?: string,
                           useSSL?: boolean,
                           autoReconnect?: boolean,
                           advancedConfig?: BridgeConnectionAdvancedConfig): MessageHandler<StompBusCommand>;

    /**
     * Unsubscribe from a Galactic Channel. Will send an UNSUBSCRIBE message to broker.
     *
     * @param {ChannelName} cname
     * @param {SentFrom} from optional calling actor (for logging)
     * @deprecated use markChannelAsGalactic() and fabric.generateFabricRequest()
     */
    abstract closeGalacticChannel(cname: ChannelName, from?: SentFrom): void;

    /**
     * Fire a galactic send notification to the montitor like it was a regular send on Observable. The
     * bridge will then pick this up and fire a SEND frame down the wire to that destination.
     *
     * @param {ChannelName} cname galactic channel name to send to
     * @param {P} payload payload of message
     * @param {SentFrom} from optional calling actor (for logging)
     * @deprecated use markChannelAsGalactic() and fabric.generateFabricRequest()
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

    /**
     * Create a new transaction that can be composed of bus requests, cache initializations or both. Asynchronous
     * transactions will all fire at once and return once all requests return. Syrnchonrous transactions will
     * fire in sequence and only proceed to the next transaction event once the preceeding response has returned.
     *
     * @param {TransactionType} type type of transaction you want, synchonrous or asynchronous (default).
     * @param {string} name the name of the transaction, helps you track progress in the console (if enabled)
     */
    abstract createTransaction(type?: TransactionType, name?: string): BusTransaction;

    /**
     * Get instance of syslog
     * @returns {Logger} singleton logger bound to bus.
     */
    abstract get logger(): Logger;

    /**
     * Enable message proxying between frames, or what ever else we can think of.
     *
     * @param {MessageProxyConfig} config
     * @returns {IFrameProxyControl}
     */
    abstract enableMessageProxy(config: MessageProxyConfig): ProxyControl;


    /** Enable Fake Socket for broker connector */
    abstract enableDevMode(): void;
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
     * This method subscribes to both command and response messages. See below for specific directional methods.
     * This method is not filtered.
     *
     * This is a raw object that encapsulates the channel stream.
     *
     * @param {ChannelName} name the name of the channel you want.
     * @param {SentFrom} from optional  calling actor (for logging)
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @param {boolean} broadcast - choose to broadcast events to the monitor (defaults to true)
     * @returns {Channel}
     */
    getChannelObject(name: ChannelName, from?: SentFrom, noRefCount?: boolean, broadcast?: boolean): Channel;

    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     * Automatically unpack wrapped messages.
     *
     * @param {ChannelName} cname name of the channel you want to subscribe to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @returns {Observable<Message>} Observable that can be subscribed to, Message object will be ticked on stream.
     */
    getChannel(cname: ChannelName, from?: SentFrom, noRefCount?: boolean): Observable<Message>;

    /**
     * Filter bus events that contain command messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @returns {Observable<Message>} Observable that will emit a command Message to any subscribers.
     */
    getRequestChannel(name: ChannelName, from?: SentFrom, noRefCount?: boolean): Observable<Message>;

    /**
     * Filter bus events that contain response messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} cname name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @returns {Observable<Message>} Observable that will emit a response Message to any subscribers.
     */
    getResponseChannel(cname: ChannelName, from?: SentFrom, noRefCount?: boolean): Observable<Message>;

    /**
     * Filter bus events that contain error messages only. Returns an Observable with un-marshaled Message payload.
     *
     * @param {ChannelName} cname name of the channel you want to listen to.
     * @param {SentFrom} from optional calling actor (for logging)
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @returns {Observable<Message>} Observable that will emit an error Message to any subscribers.
     * @deprecated use markChannelAsGalactic() and fabric.generateFabricRequest();
     */
    getErrorChannel(cname: ChannelName, from?: SentFrom, noRefCount?: boolean): Observable<Message>;

    /**
     * Get or create a galactic channel. Channel will be mapped to broker destination and picked up by the bridge.
     *
     * @param {ChannelName} cname
     * @param {SentFrom} from
     * @param {boolean} noRefCount optional - will prevent internal reference counting (defaults to false)
     * @returns {Observable<Message>}
     * @deprecated use markChannelAsGalactic()
     */
    getGalacticChannel(cname: ChannelName, from?: SentFrom, noRefCount?: boolean): Observable<Message>;

    /**
     * Send simple API message to MessageResponder enabled calls. (non low-level API's)
     *
     * @param {ChannelName} cname
     * @param payload
     * @param {SentFrom} name
     */
    sendRequest(cname: ChannelName, payload: any, name?: SentFrom): void;

    /**
     * Send simple API message to MessageResponder enabled calls. (non low-level API's)
     *
     * @param {ChannelName} cname channel name to send response to.
     * @param payload payload to send to simple API.
     * @param {SentFrom} name option name of calling actor (for logging)
     */
    sendResponse(cname: ChannelName, payload: any, name?: SentFrom): void;

    /**
     *  Used internally to send messages to simpler API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {SentFrom} name optional calling actor (for logging)
     * @param {UUID} id enable message tracking if this is supplied
     * @returns {MessageHandler<R>} reference to MessageHandler<R>
     */
    request<R>(handlerConfig: MessageHandlerConfig, name?: SentFrom, id?: UUID): MessageHandler<R>;

    /**
     * Used internally to send messages to simple API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {SentFrom} name optional calling actor (for logging)
     * @param {UUID} id enable message tracking if this is supplied
     * @returns {MessageHandler<R>} reference to MessageResponder<R>
     */
    respond<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom, id?: UUID): MessageResponder<R, E>;

    /**
     * Used internally to interact with simpler API's in main event bus.
     *
     * @param {MessageHandlerConfig} handlerConfig message handler configuration object.
     * @param {boolean} requestStream listen to requests? defaults to responses only.
     * @param {SentFrom} name optional calling actor (for logging)
     * @param {UUID} id enable message tracking if this is supplied
     * @returns {MessageHandler<R>} reference to MessageHandler<R>
     */
    listen<R>(handlerConfig: MessageHandlerConfig,
              requestStream?: boolean, name?: SentFrom, id?: UUID): MessageHandler<R>;

    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param {ChannelName} cname channel you want to close
     * @param {SentFrom} from optional calling actor (for logging)
     * @param {UUID} observerId optional id of observer closing (leaving) the channel.
     */
    close(cname: ChannelName, from?: SentFrom, observerId?: UUID): boolean;

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
     * @returns {Logger} reference to the logger service.
     */
    logger(): Logger;

    /**
     * Quick access to logger instance for spies and testing.
     */
    loggerInstance: Logger;

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
     * @param {number} delay milliseconds you want to delay execution by.
     */
    tickEventLoop(func: Function, delay?: number): number;

    /**
     * Get uuid of the bus.;
     */
    getId(): UUID;

}


/**
 * Bus Transactions
 */
export interface TransactionReceipt {
    totalRequests: number;
    requestsSent: number;
    requestsCompleted: number;
    complete: boolean;
    aborted: boolean;
    startedTime: Date;
    completedTime: Date;
    abortedTime: Date;
}

/**
 * Type of transaction? Sync or Async? Default is Async.
 */
export enum TransactionType {
    ASYNC = 'Async', // will send all requests at the same time and return when all are complete
    SYNC = 'Sync'   // will send requests one at a time and move on after each command is completed in sequence.
}

export interface BusTransaction {

    /**
     * Create a command to a channel as a part of this transaction.
     * @param {string} channel channel to send the command to
     * @param {payload} any what ever you want to send.
     */
    sendRequest<ReqT>(channel: string, payload: ReqT): void;

    /**
     * Wait for a store to be ready / initialzed as a part of this transaction.
     * @param {StoreType} channel channel to send the command to
     */
    waitForStoreReady<ReqT>(storeType: StoreType): void;

    /**
     * Once all responses to requests have been received, the transaction is complete.
     * The handler will return an array or all responses in the order the requests were sent.
     * @param {MessageFunction<T>} completeHandler the closure you want to handle the completed payload.
     */
    onComplete<RespT>(completeHandler: MessageFunction<[RespT]>): void;

    /**
     * If an error is thrown by any of the responders, the transaction is aborted and the
     * error sent to the errorHandler.
     * @param {MessageFunction<T>} errorHandler the closure you want to handle any errors during the transaction.
     */
    onError<ErrT>(errorHandler: MessageFunction<ErrT>): void;

    /**
     * Commit the transaction, all requests will be sent and will wait for responses.
     * Once all the responses are in, onComplete will be called with the responses.
     * @returns {TransactionReceipt} allows observer to track state of the transaction for monitoring purposes.
     */
    commit(): TransactionReceipt;

}

export interface EventBusEnabled {
    getName(): string;
}
