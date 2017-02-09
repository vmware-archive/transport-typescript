/**
 * Copyright(c) VMware Inc., 2016
 */
import {Injectable} from '@angular/core';
import {Channel} from './channel.model';
import {LogUtil} from '../log/util';
import {LoggerService} from '../log/logger.service';
import {LogLevel} from '../log/logger.model';
import {MonitorObject, MonitorType, MonitorChannel} from './monitor.model';
import {Message, MessageHandlerConfig, MessageResponder, MessageHandler} from './message.model';
import {Subject, Subscription} from 'rxjs';
import {Observable} from 'rxjs';
import {MessageSchema} from './message.schema';


// import * as Ajv from 'ajv';

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

export abstract class MessageBusEnabled {
    abstract getName(): string;
}

@Injectable()
export class MessagebusService implements MessageBusEnabled {
    private log: LoggerService;
    private monitorChannel = MonitorChannel.stream;
    private monitorStream: Channel;
    // Disable bus monitor in tests by default
    private enableMonitor = typeof(jasmine) === 'undefined';
    private dumpMonitor = true;

    // private ajv = new Ajv({allErrors: true});

    constructor(private _channelMap: Map<string, Channel>) {
        this._channelMap = new Map<string, Channel>();

        // Create Monitor channel
        this.monitorStream = new Channel(this.monitorChannel);
        this._channelMap.set(this.monitorChannel, this.monitorStream);

        this.log = new LoggerService();
        this.log.logLevel = LogLevel.Info;

        if (this.enableMonitor) {
            this.monitorBus();
        }
    }

    getName() {
        return (this as any).constructor.name;
    }

    increment(cname: string) {
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
    getMonitor(): Subject<Message> {
        return this.monitorStream.stream;
    }

    /**
     * Turn
     * @param flag
     */
    enableMonitorDump(flag: boolean) {
        this.dumpMonitor = flag;
        return this.dumpMonitor;
    }

    /**
     * Access to private logger so messages can be sequentialized.
     *
     * @returns {LoggerService}
     */
    logger(): LoggerService {
        return this.log;
    }

    /**
     * For external access to messagebus private logger (so output streams are sequentialized).
     *
     * @param msg
     * @param from
     */
    messageLog(msg: string, from: string) {
        this.log.info(msg, from);
    }

    /**
     * Set the log suppression on or off
     *
     * @param set
     */
    suppressLog(set: boolean) {
        this.log.suppress(set);
    }

    silenceLog(set: boolean) {
        this.log.silent(set);
    }

    /**
     * Externally set messagebus private log level
     *
     * @param logLevel
     */
    setLogLevel(logLevel: LogLevel) {
        this.log.logLevel = logLevel;
    }

    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     *
     * @param cname
     * @param from
     * @returns {Subject<Message>}
     */
    getChannel(cname: string, from: string): Subject<Message> {
        return this.getChannelObject(cname, from).stream;
    }

    getGalacticChannel(cname: string, from: string): Subject<Message> {
        return this.getChannelObject(cname, from)
            .setGalactic().stream;
    }

    isGalacticChannel(cname: string): boolean {
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
    getChannelObject(cname: string, from: string) {
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
    getRequestChannel(cname: string, from: string): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isRequest());
            });
    }

    /**
     * Filter bus events that contain response messages. Errors are always response messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    getResponseChannel(cname: string, from: string): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isResponse() || message.isError());
            });
    }

    /**
     * Channel reference count
     *
     * @param cname
     * @returns {number}
     */
    refCount(cname: string): number {
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
    close(cname: string, from: string): boolean {
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
     * @param cname -> Channel to send to
     * @param message -> Message
     * @param from -> Caller name
     * @returns {boolean} -> on successful transmission
     */
    send(cname: string, message: Message, from: string): boolean {
        // TEMPORARY - flag all messages without schema
        if (!message.messageSchema) {
            this.logger()
                .warn('* No schema in message to ' + cname, from);
        }

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
     * Wrap a payload in a request Message and send to the bus channel
     * @param cname
     * @param payload
     */
    sendRequestMessage(cname: string, payload: any): boolean {
        return this.send(cname, new Message().request(payload, new MessageSchema()), this.getName());
    }

    /**
     * Wrap a payload in a response Message and send to the bus channel.
     * @param cname
     * @param payload
     */
    sendResponseMessage(cname: string, payload: any): boolean {
        return this.send(cname, new Message().response(payload, new MessageSchema()), this.getName());
    }


    /**
     * Wrap a payload in a response Message with type error and send to the bus channel.
     * @param cname
     * @param payload
     */
    sendErrorMessage(cname: string, payload: any): boolean {
        return this.send(cname, new Message().error(payload, new MessageSchema()), this.getName());
    }

    /**
     * Transmit an error on a channel on the message bus if it exists.
     *
     * @param cname
     * @param err Error object
     * @returns {boolean} channel existed and transmission made
     */
    error(cname: string, err: any): boolean {
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
     * @returns {MessageResponder}
     */
    public respondOnce(sendChannel: string): MessageResponder {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, null);
        return this.respond(mh);

    }

    /**
     * Respond to all events until responders unsubscribe() method is called.
     * @param sendChannel
     * @returns {MessageResponder}
     */
    public respondStream(sendChannel: string): MessageResponder {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, null, false);
        return this.respond(mh);

    }

    /**
     * Handle all incoming responses via handler until unsubscribe() method is called
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @returns {MessageHandler}
     */
    public requestStream(sendChannel: string,
                         body: any,
                         returnChannel?: string): MessageHandler {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, body, false, returnChannel);
        return this.request(mh);

    }

    /**
     * Handle a single response on channel response stream, then immediately unsubscribe.
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @returns {MessageHandler}
     */
    public requestOnce(sendChannel: string,
                       body: any,
                       returnChannel?: string): MessageHandler {

        let mh: MessageHandlerConfig = new MessageHandlerConfig(sendChannel, body, true, returnChannel);
        return this.request(mh);

    }

    /**
     * Listen to a response stream once, unsubscribe after single message comes through.
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @returns {MessageHandler}
     */
    public listenOnce(channel: string): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, true, channel);
        return this.listen(mh);

    }

    /**
     * Listen to a channel and stream all events to hander until manually unsubscribed.
     * @param channel
     * @returns {MessageHandler}
     */
    public listenStream(channel: string): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, false, channel);
        return this.listen(mh);
    }

    /**
     * Listen to a request stream once, unsubscribe after single message comes through.
     * @param sendChannel
     * @param body
     * @param returnChannel
     * @returns {MessageHandler}
     */
    public listenRequestOnce(channel: string): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, true, channel);
        return this.listen(mh, true);

    }

    /**
     * Listen to a  request stream of a channel and stream all events to hander until manually unsubscribed.
     * @param channel
     * @returns {MessageHandler}
     */
    public listenRequestStream(channel: string): MessageHandler {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(channel, null, false, channel);
        return this.listen(mh, true);
    }


    /**
     * Simplified responder will respond to any message sent on handler config send channel
     * with return value of generateResponse function.
     *
     * @param handlerConfig
     * @returns {{generate: ((generateResponse:Function)=>Subscription)}}
     */
    public respond(handlerConfig: MessageHandlerConfig): MessageResponder {

        return {
            generate: (generateResponse: Function): Subscription => {
                let _chan = this.getChannelObject(handlerConfig.sendChannel, this.getName());
                let _sub = _chan.stream.subscribe(
                    (msg: Message) => {
                        this.send(handlerConfig.returnChannel,
                            new Message().response(generateResponse(msg.payload.body),
                                new MessageSchema()), this.getName());

                        if (handlerConfig.singleResponse) {
                            _sub.unsubscribe();
                        }
                    }
                );
                return _sub;
            }
        };
    }

    /**
     * Simplified requester will send handler config body on send channel and handle success or error messages
     * and call handler functions with message payload.
     *
     * @param handlerConfig
     * @returns {{handle: ((success:Function, error?:Function)=>Subscription)}}
     */
    public request(handlerConfig: MessageHandlerConfig): MessageHandler {
        this.send(handlerConfig.sendChannel,
            new Message().request(handlerConfig, new MessageSchema()), this.getName());

        return this.createMessageHandler(handlerConfig);
    }

    /**
     * Simplified listener, same as request, except no outbound message is sent.
     *
     * @param handlerConfig
     * @returns {{handle: ((success:Function, error?:Function)=>Subscription)}}
     */
    public listen(handlerConfig: MessageHandlerConfig, requestStream: boolean = false): MessageHandler {
        return this.createMessageHandler(handlerConfig, requestStream);
    }

    private createMessageHandler(handlerConfig: MessageHandlerConfig, requestStream: boolean = false) {
        return {
            handle: (success: Function, error?: Function): Subscription => {
                let _chan: Observable<Message>;
                if (requestStream) {
                    _chan = this.getRequestChannel(handlerConfig.returnChannel, this.getName());
                } else {
                    _chan = this.getResponseChannel(handlerConfig.returnChannel, this.getName());
                }
                let _sub = _chan.subscribe(
                    (msg: Message) => {
                        if (msg.isError()) {
                            error(msg.payload);
                        } else {
                            success(msg.payload);
                        }
                        if (handlerConfig.singleResponse) {
                            _sub.unsubscribe();
                        }
                    },
                    (data: any) => {
                        if (error) {
                            error(data);
                        }
                        _sub.unsubscribe();
                    }
                );
                return _sub;
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
    complete(cname: string, from: string): boolean {
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
    countListeners(): number {
        let count = 0;
        this.channelMap.forEach((channel, name) => {
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
    destroyAllChannels() {
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

        delete this._channelMap.get(channel.name);
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
                                if (!this.dumpMonitor) {
                                    break;
                                }

                                this.dumpData(mo, mo.from + ' -> ' + mo.channel +
                                    (message.messageSchema
                                        ? '  ['
                                        + message.messageSchema._title
                                        + ']'
                                        : ''));
                                break;

                            case MonitorType.MonitorDropped:
                                if (!this.dumpMonitor) {
                                    break;
                                }

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
                    } else {
                        this.log.error('Error on monitor channel: ' + LogUtil.pretty(message), this.getName());
                    }
                }
            );
    }
}
