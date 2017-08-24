/**
 * Copyright(c) VMware Inc., 2016
 */
import { Injectable } from '@angular/core';
import { Channel } from './channel.model';
import { LogUtil } from '../log/util';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { MonitorObject, MonitorType, MonitorChannel } from './monitor.model';
import { Message, MessageHandlerConfig, MessageResponder, MessageHandler, MessageType } from './message.model';
import { Subject, Subscription, Observable } from 'rxjs';
import { MessageSchema, ErrorSchema } from './message.schema';
import { CacheImpl } from './cache/cache';
import { BusCache } from './cache/cache.api';
import 'rxjs/add/operator/merge';
import { CacheType, UUID } from './cache/cache.model';


// import * as Ajv from 'ajv';

/**
 * SEE DOCS.
 *
 * https://confluence.eng.vmware.com/pages/viewpage.action?pageId=214302828
 *
 */

export abstract class MessageBusEnabled {
    abstract getName(): string;
}

@Injectable()
export class MessagebusService implements MessageBusEnabled {
    private log: LoggerService;
    private monitorChannel = MonitorChannel.stream;
    private monitorStream: Channel;
    private dumpMonitor: boolean;
    private _channelMap: Map<string, Channel>;


    private cacheMap: Map<string, BusCache<any>>;

    // private ajv = new Ajv({allErrors: true});

    constructor() {
        this._channelMap = new Map<string, Channel>();

        // Create Monitor channel
        this.monitorStream = new Channel(this.monitorChannel);
        this._channelMap.set(this.monitorChannel, this.monitorStream);

        this.log = new LoggerService();
        this.log.logLevel = LogLevel.Info;

        this.enableMonitorDump(false);
        this.monitorBus();
        this.cacheMap = new Map<CacheType, BusCache<any>>();
    }

    public createCache<T>(objectType: CacheType, map?: Map<UUID, T>): BusCache<T> {
        if (!this.getCache(objectType)) {
            const cache: BusCache<T> = new CacheImpl<T>(this);
            if (map) {
                cache.populateCache(map);
            }
            this.cacheMap.set(objectType, cache);
            return cache;
        } else {
            return this.getCache(objectType);
        }
    }

    public getCache<T>(objectType: CacheType): BusCache<T> {
        return this.cacheMap.get(objectType);
    }

    public destroyCache(objectType: CacheType): boolean {
        if (this.cacheMap.has(objectType)) {
            this.cacheMap.delete(objectType);
            return true;
        }
        return false;
    }


    public getName() {
        return 'MessagebusService';
    }

    public increment(cname: string) {
        this.channelMap.get(cname)
            .increment();
    }

    /**
     * Returns the map for monitoring externally (read-only)
     *
     * @returns {Map<string, Channel>}
     */
    get channelMap() {
        return this._channelMap;
    }

    /**
     * Get a subscription to the monitor channel.
     *
     * @returns {BehaviorSubject<any>}
     */
    public getMonitor(): Subject<Message> {
        return this.monitorStream.stream;
    }

    /**
     * Get current bus logging state
     *
     * @returns {boolean}
     */
    get isLoggingEnabled() {
        return this.dumpMonitor;
    }

    /**
     * Turn logging on/off
     *
     * @param flag
     * @returns {boolean}
     */
    public enableMonitorDump(flag: boolean) {
        this.dumpMonitor = flag;
        return this.dumpMonitor;
    }

    /**
     * Access to private logger so messages can be sequentialized.
     *
     * @returns {LoggerService}
     */
    public logger(): LoggerService {
        return this.log;
    }

    /**
     * For external access to messagebus private logger (so output streams are sequentialized).
     *
     * @param msg
     * @param from
     */
    public messageLog(msg: string, from: string) {
        this.log.info(msg, from);
    }

    /**
     * Set the log suppression on or off
     *
     * @param set
     */
    public suppressLog(set: boolean) {
        this.log.suppress(set);
    }

    public silenceLog(set: boolean) {
        this.log.silent(set);
    }

    /**
     * Externally set messagebus private log level
     *
     * @param logLevel
     */
    public setLogLevel(logLevel: LogLevel) {
        this.log.logLevel = logLevel;
    }

    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     * Automatically unpack wrapped messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    public getChannel(cname: string, from: string): Observable<Message> {
        return this.getChannelObject(cname, from)
            .stream
            .map(
                (msg: Message) => {
                    if (msg.payload.hasOwnProperty('_sendChannel')) {
                        msg.payload = msg.payload.body;
                    }
                    return msg;
                }
            );

    }

    /**
     * Activate the bridge to subscribe to a topic/queue on broker with the same channel name.
     * Automatically unpack wrapped messages.
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    public getGalacticChannel(cname: string, from: string): Observable<Message> {
        return this.getChannelObject(cname, from)
            .setGalactic().stream
            .map(
                (msg: Message) => {
                    if (msg.payload.hasOwnProperty('_sendChannel')) {
                        msg.payload = msg.payload.body;
                    }
                    return msg;
                }
            );
    }

    /**
     * Returns true if a channel is Galactic. Galactic status requires a bit flipped on the channel object.
     * @param cname
     * @returns {boolean}
     */
    public isGalacticChannel(cname: string): boolean {
        if (this._channelMap.has(cname)) {
            return this._channelMap.get(cname).galactic;
        }

        return false;
    }

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
    public getChannelObject(cname: string, from: string) {
        let channel: Channel;
        let symbol = ' + ';

        if (this._channelMap.has(cname)) {
            channel = this._channelMap.get(cname);
        } else {
            channel = new Channel(cname);
            this._channelMap.set(cname, channel);
            symbol = ' +++ ';
        }


        let mo = new MonitorObject().build(MonitorType.MonitorNewChannel, cname, from, symbol);
        this.monitorStream.send(new Message().request(mo));
        channel.increment();
        return channel;
    }

    /**
     * Filter bus events that contain request messages
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    public getRequestChannel(cname: string, from: string): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isRequest());
            });
    }

    /**
     * Filter bus events that contain response messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    public getResponseChannel(cname: string, from: string): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isResponse());
            });
    }

    /**
     * Filter bus events that contain error messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    public getErrorChannel(cname: string, from: string): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isError());
            });
    }

    /**
     * Channel reference count
     *
     * @param cname
     * @returns {number}
     */
    public refCount(cname: string): number {
        if (!this._channelMap.has(cname)) {
            return -1;
        }

        return this._channelMap.get(cname).refCount;
    }

    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    public close(cname: string, from: string): boolean {
        if (!this._channelMap.has(cname)) {
            return false;
        }

        let channel = this._channelMap.get(cname);

        channel.decrement();
        let mo = new MonitorObject().build(MonitorType.MonitorCloseChannel, cname, from, ' ' + channel.refCount);
        this.monitorStream.send(new Message().request(mo));

        if (channel.refCount === 0) {
            return this.destroy(channel, from);
        }
        return false;
    }

    /**
     * Transmit arbitrary data on a channel on the message bus if it exists.
     * This routine is called with traceback strings to allow for debugging and monitoring
     * bus traffic.
     *
     * This method will soon become private, avoid using!
     *
     * @param cname -> Channel to send to
     * @param message -> Message
     * @param from -> Caller name
     * @returns {boolean} -> on successful transmission
     */
    public send(cname: string, message: Message, from: string): boolean {
        // Disabled until Schema's are fully implemented.
        // if (!message.messageSchema) {
        //     this.logger()
        //         .warn('* No schema in message to ' + cname, from);
        // }

        if (!this._channelMap.has(cname)) {
            let mo = new MonitorObject().build(MonitorType.MonitorDropped, cname, from, message);
            this.monitorStream.send(new Message().request(mo));
            return false;
        }

        let mo = new MonitorObject().build(MonitorType.MonitorData, cname, from, message);
        this.monitorStream.send(new Message().request(mo));
        this._channelMap.get(cname)
            .send(message);

        return true;
    }

    /**
     * Send simple API message to MessageResponder enabled calls.
     * @param cname
     * @param payload
     * @param schema
     * @param name
     * @returns {boolean}
     */
    public sendRequest(cname: string, payload: any, schema = new MessageSchema(), name = this.getName()): boolean {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.send(mh.sendChannel, new Message().request(mh, schema), name);
        return true;
    }

    /**
     * Send simple API message to MessageHandler enabled calls.
     * @param cname
     * @param payload
     * @param schema
     * @param name
     * @returns {boolean}
     */
    public sendResponse(cname: string, payload: any, schema = new MessageSchema(), name = this.getName()): boolean {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.send(mh.sendChannel, new Message().response(mh, schema), name);
        return true;
    }


    /**
     * Wrap a payload in a request Message and send to the bus channel
     * @param cname
     * @param payload
     * @param schema any
     * @param name string
     */
    public sendRequestMessage(cname: string, payload: any,
                              schema = new MessageSchema(), name = this.getName()): boolean {
        return this.send(cname, new Message().request(payload, schema), name);
    }

    /**
     * Wrap a payload in a response Message and send to the bus channel.
     * @param cname
     * @param payload
     * @param schema any
     * @param name string
     */
    public sendResponseMessage(cname: string, payload: any,
                               schema = new MessageSchema(), name = this.getName()): boolean {
        return this.send(cname, new Message().response(payload, schema), name);
    }


    /**
     * Wrap a payload in a response Message with type error and send to the bus channel.
     *
     * @param cname
     * @param payload
     * @param schema
     * @param name string
     * @returns {boolean}
     */
    public sendErrorMessage(cname: string, payload: any, schema = new ErrorSchema(), name = this.getName()): boolean {
        return this.send(cname, new Message().error(payload, schema), name);
    }

    /**
     * Transmit an error on a channel on the message bus if it exists.
     *
     * This method will become private soon, avoid!
     *
     * @param cname
     * @param err Error object
     * @returns {boolean} channel existed and transmission made
     */
    public error(cname: string, err: any): boolean {
        if (!this._channelMap.has(cname)) {
            return false;
        }

        let mo = new MonitorObject().build(MonitorType.MonitorError, cname, 'bus error');
        this.monitorStream.send(new Message().error(mo));

        this._channelMap.get(cname)
            .error(err);
        return true;
    }

    /**
     * Respond Once to a single channel and unsubscribe
     * @param sendChannel
     * @param returnChannel
     * @param schema any
     * @param name string
     * @returns {MessageResponder}
     */
    public respondOnce(sendChannel: string, returnChannel?: string,
                       schema?: any, name = this.getName()): MessageResponder {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, null, true, returnChannel);
        return this.respond(mh, schema, name);

    }

    /**
     * Respond to all events until responders unsubscribe() method is called.
     * @param sendChannel
     * @param returnChannel
     * @param schema any
     * @param name string
     * @returns {MessageResponder}
     */
    public respondStream(sendChannel: string, returnChannel?: string,
                         schema?: any, name = this.getName()): MessageResponder {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, null, false, returnChannel);
        return this.respond(mh, schema, name);

    }

    /**
     * Handle all incoming responses via handler until unsubscribe() method is called
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @param schema any
     * @param name string
     * @returns {MessageHandler}
     */
    public requestStream(sendChannel: string,
                         body: any,
                         returnChannel?: string,
                         schema?: any,
                         name = this.getName()): MessageHandler {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, body, false, returnChannel);
        return this.request(mh, schema, name);

    }

    /**
     * Handle a single response on channel response stream, then immediately unsubscribe.
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @param schema any
     * @param name string
     * @returns {MessageHandler}
     */
    public requestOnce(sendChannel: string,
                       body: any,
                       returnChannel?: string,
                       schema?: any,
                       name = this.getName()): MessageHandler {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, body, true, returnChannel);
        return this.request(mh, schema, name);
    }

    /**
     * Listen to a response stream once, unsubscribe after single message comes through.
     * @param channel
     * @param name string
     * @returns {MessageHandler}
     */
    public listenOnce(channel: string, name = this.getName()): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, true, channel);
        return this.listen(mh, false, name);
    }

    /**
     * Listen to a channel and stream all events to hander until manually unsubscribed.
     * @param channel
     * @param name string
     * @returns {MessageHandler}
     */
    public listenStream(channel: string, name = this.getName()): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, false, channel);
        return this.listen(mh, false, name);
    }

    /**
     * Listen to a request stream once, unsubscribe after single message comes through.
     * @param channel
     * @param name string
     * @returns {MessageHandler}
     */
    public listenRequestOnce(channel: string, name = this.getName()): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, true, channel);
        return this.listen(mh, true, name);

    }

    /**
     * Listen to a  request stream of a channel and stream all events to hander until manually unsubscribed.
     * @param channel
     * @param name string
     * @returns {MessageHandler}
     */
    public listenRequestStream(channel: string, name = this.getName()): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, false, channel);
        return this.listen(mh, true, name);
    }


    /**
     * Simplified responder will respond to any message sent on handler config send channel
     * with return value of generateResponse function.
     *
     * @param handlerConfig
     * @param schema any
     * @param name string
     * @returns MessageResponder
     */
    public respond(handlerConfig: MessageHandlerConfig, schema?: any, name = this.getName()): MessageResponder {
        let schemaRef: any;
        if (schemaRef) {
            schemaRef = schema;
        } else {
            // TODO: build an intelligent schema generator.
            schemaRef = new MessageSchema();
        }

        let sub: Subscription;
        const errorChannel: Observable<Message> = this.getErrorChannel(handlerConfig.sendChannel, name);
        const requestChannel: Observable<Message> = this.getRequestChannel(handlerConfig.sendChannel, name);

        return {
            generate: (generateSuccessResponse: Function, generateErrorResponse: Function): Subscription => {
                const mergedStreams = Observable.merge(errorChannel, requestChannel);
                sub = mergedStreams.subscribe(
                    (msg: Message) => {
                        let pl = msg.payload;
                        // check if message is using wrapped API or not.
                        if (pl.hasOwnProperty('_sendChannel')) {
                            pl = msg.payload.body;
                        }
                        if (!msg.isError()) {
                            this.sendResponseMessage(
                                handlerConfig.returnChannel,
                                generateSuccessResponse(pl),
                                schemaRef,
                                name
                            );
                        } else {
                            let err: Function;
                            if (generateErrorResponse) {
                                err = generateErrorResponse;
                            } else {
                                err = generateSuccessResponse;
                            }
                            this.sendErrorMessage(
                                handlerConfig.returnChannel,
                                err(pl),
                                schemaRef,
                                name
                            );
                        }
                        if (handlerConfig.singleResponse) {
                            if (sub) {
                                sub.unsubscribe();
                            }
                        }
                    }
                );
                return sub;
            },
            tick: (payload: any): void => {
                if (sub && !sub.closed) {
                    this.sendResponse(handlerConfig.returnChannel, payload);
                }
            },
            close: (): boolean => {
                if (!handlerConfig.singleResponse) {
                    if (sub) {
                        sub.unsubscribe();
                    }
                    sub = null;
                }
                return true;
            },
            isClosed(): boolean {
                return (!sub || sub.closed);
            },
            getObservable(): Observable<any> {
                const chan = Observable.merge(requestChannel, errorChannel);
                return chan.map(
                    (msg: Message) => {
                        let pl = msg.payload;
                        if (pl.hasOwnProperty('_sendChannel')) {
                            pl = msg.payload.body;
                        }
                        if (msg.isError()) {
                            throw new Error(pl);
                        } else {
                            return pl;
                        }
                    }
                );
            }
        };
    }

    /**
     * Simplified requester will send handler config body on send channel and handle success or error messages
     * and call handler functions with message payload.
     *
     * @param handlerConfig
     * @param schema any
     * @param name string
     * @returns MessageHandler
     */
    public request(handlerConfig: MessageHandlerConfig, schemaRef?: any, name = this.getName()): MessageHandler {
        let _schema: any;

        // if a schema is supplied, use it!
        if (schemaRef) {
            _schema = schemaRef;
        } else {
            // TODO: build intelligent schema builder if none is supplied.
            _schema = new MessageSchema();
        }

        this.send(handlerConfig.sendChannel, new Message().request(handlerConfig, _schema), name);

        return this.createMessageHandler(handlerConfig, false, name);
    }

    /**
     * Simplified listener, same as request, except no outbound message is sent.
     *
     * @param handlerConfig
     * @param requestStream boolean
     * @param name string
     * @returns MessageHandler
     */
    public listen(handlerConfig: MessageHandlerConfig, requestStream: boolean = false,
                  name = this.getName()): MessageHandler {
        return this.createMessageHandler(handlerConfig, requestStream, name);
    }


    /**
     * Handle the creation and destruction of subscriptions based on the handler type.
     *
     * @param handlerConfig
     * @param requestStream
     * @param name string
     * @returns Subscription
     */
    private createMessageHandler(handlerConfig: MessageHandlerConfig, requestStream: boolean = false,
                                 name = this.getName()) {
        let sub: Subscription;
        const errorChannel: Observable<Message> = this.getErrorChannel(handlerConfig.returnChannel, name);
        const requestChannel: Observable<Message> = this.getRequestChannel(handlerConfig.returnChannel, name);
        const responseChannel: Observable<Message> = this.getResponseChannel(handlerConfig.returnChannel, name);
        const fullChannel: Observable<Message> = this.getChannel(handlerConfig.returnChannel, name);
        return {

            handle: (success: Function, error?: Function): Subscription => {
                let _chan: Observable<Message>;
                if (requestStream) {
                    _chan = requestChannel;
                } else {
                    _chan = responseChannel;
                }
                const mergedStreams = Observable.merge(errorChannel, _chan);
                sub = mergedStreams.subscribe(
                    (msg: Message) => {
                        let _pl = msg.payload;
                        if (_pl.hasOwnProperty('_sendChannel')) {
                            _pl = msg.payload.body;
                        }
                        if (msg.isError()) {
                            if (error) {
                                error(_pl);
                            }
                        } else {
                            if (success) {
                                success(_pl);
                            }
                        }
                        if (handlerConfig.singleResponse) {
                            if (sub) {
                                sub.unsubscribe();
                            }
                        }
                    },
                    (data: any) => {
                        if (error) {
                            error(data);
                        }
                        if (sub) {
                            sub.unsubscribe();
                        }
                    }
                );
                return sub;
            },
            tick: (payload: any): void => {
                if (sub && !sub.closed) {
                    this.sendRequestMessage(handlerConfig.sendChannel, payload);
                }
            },
            error: (payload: any): void => {
                if (sub && !sub.closed) {
                    this.sendErrorMessage(handlerConfig.returnChannel, payload);
                }
            },
            close: (): boolean => {
                if (!handlerConfig.singleResponse) {
                    if (sub) {
                        sub.unsubscribe();
                    }
                    sub = null;
                }
                return true;
            },
            isClosed(): boolean {
                return (!sub || sub.closed);
            },
            getObservable(type?: MessageType): Observable<any> {

                let chan = fullChannel;
                if (type) {
                    switch (type) {
                        case MessageType.MessageTypeResponse:
                            chan = responseChannel;
                            break;
                        case MessageType.MessageTypeError:
                            chan = errorChannel;
                            break;
                        default:
                            chan = requestChannel;
                            break;
                    }
                }
                return chan.map(
                    (msg: Message) => {
                        let pl = msg.payload;
                        if (pl.hasOwnProperty('_sendChannel')) {
                            pl = msg.payload.body;
                        }
                        if (msg.isError()) {
                            throw new Error(pl);
                        } else {
                            return pl;
                        }
                    }
                );
            }
        };
    }

    /**
     * Transmit complete() on stream.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    public complete(cname: string, from: string): boolean {
        if (!this._channelMap.has(cname)) {
            return false;
        }

        let mo = new MonitorObject().build(MonitorType.MonitorCompleteChannel, cname, from);
        this.monitorStream.send(new Message().request(mo));

        let channel = this._channelMap.get(cname);
        channel.complete();
        return this.destroy(channel, from);
    }

    /**
     * Count listeners across all channels.
     *
     * @returns {number}
     */
    public countListeners(): number {
        let count = 0;
        this.channelMap.forEach((channel) => {
            count += channel.refCount;
        });
        return count;
    }

    /**
     * Destroy all channels, regardless of whether they still have subscribers.
     * This is intended to be used in afterEach during jasmine tests, so that
     * subscribers from previous tests never fire in subsequent tests.
     *
     * @returns {void}
     */
    public destroyAllChannels() {
        this.channelMap.forEach((channel, name) => {
            this.destroy(channel, name);
        });
    }

    /**
     *  Destroy a Channel and remove it from our map. If it is not closed, close it first.
     *
     * @param channel
     * @param from
     * @returns {boolean}
     */
    private destroy(channel: Channel, from: string): boolean {
        let mo = new MonitorObject().build(MonitorType.MonitorDestroyChannel, channel.name, from);
        this.monitorStream.send(new Message().request(mo));

        this._channelMap.delete(channel.name);

        return true;
    }

    private dumpData(mo: MonitorObject, tag: string) {

        let message = mo.data as Message;

        this.log.group(LogLevel.Info, tag);
        this.log.info(' -> ' + mo.channel, 'Channel');

        if (message.isRequest()) {
            this.log.info('REQUEST', 'Type');
        } else {
            if (message.isError()) {
                this.log.info('ERROR', 'Type');
            } else {
                this.log.info('RESPONSE', 'Type');
            }
        }

        this.log.group(LogLevel.Info, message.isError() ? 'Error' : 'Payload');

        this.log.info(LogUtil.pretty(message.payload), mo.from);
        this.log.groupEnd(LogLevel.Info);

        if (message.messageSchema) {
            this.log.group(LogLevel.Info, 'Schema: ' + message.messageSchema._title);
            this.log.info(LogUtil.pretty(message.messageSchema), 'Schema');
            this.log.groupEnd(LogLevel.Info);
        }

        this.log.groupEnd(LogLevel.Info);
    }

    /**
     * This is a listener on the monitor channel which dumps message events to the console
     */
    private monitorBus() {
        this.getMonitor()
            .subscribe(
                (message: Message) => {
                    if (!message.isError()) {
                        if (this.dumpMonitor) {
                            let mo = message.payload as MonitorObject;

                            switch (mo.type) {
                                case MonitorType.MonitorNewChannel:
                                    this.log.info(mo.data + mo.channel, mo.from);
                                    break;

                                case MonitorType.MonitorCloseChannel:
                                    this.log.info(' X ' + mo.channel + '[' + mo.data + ']', mo.from);
                                    break;

                                case MonitorType.MonitorCompleteChannel:
                                    this.log.info(' C ' + mo.channel, mo.from);
                                    break;

                                case MonitorType.MonitorDestroyChannel:
                                    this.log.info('XXX ' + mo.channel, mo.from);
                                    break;

                                case MonitorType.MonitorData:
                                    this.dumpData(mo, mo.from + ' -> ' + mo.channel +
                                        (message.messageSchema
                                            ? '  ['
                                            + message.messageSchema._title
                                            + ']'
                                            : ''));
                                    break;

                                case MonitorType.MonitorDropped:
                                    this.dumpData(mo, '*DROP* message from ' + mo.from + ' -> ' + mo.channel +
                                        (message.messageSchema
                                            ? '  ['
                                            + message.messageSchema._title
                                            + ']'
                                            : ''));
                                    break;
                                default:
                                    break;
                            }
                        }
                    } else {
                        this.log.error('Error on monitor channel: ' + LogUtil.pretty(message), this.getName());
                    }
                }
            );
    }
}
