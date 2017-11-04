/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { MessageBusEnabled } from './messagebus.service';
import { ChannelName, EventBus, EventBusLowApi, SentFrom } from './bus.api';
import { Channel } from './model/channel.model';
import { Message, MessageHandler, MessageHandlerConfig, MessageResponder, MessageType } from './model/message.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { MonitorChannel, MonitorObject, MonitorType } from './model/monitor.model';
import { LogUtil } from '../log/util';
import { Subscription } from 'rxjs/Subscription';

export class EventBusLowLevelApiImpl implements MessageBusEnabled, EventBusLowApi {

    readonly channelMap: Map<ChannelName, Channel>;
    private log: LoggerService;
    private monitorChannel = MonitorChannel.stream;
    private monitorStream: Channel;
    private dumpMonitor: boolean;
    private internalChannelMap: Map<string, Channel>;


    constructor(private eventBusRef: EventBus, channelMap: Map<string, Channel>) {
        this.internalChannelMap = channelMap;

        // create monitor stream.
        this.monitorStream = new Channel(this.monitorChannel);
        this.internalChannelMap.set(this.monitorChannel, this.monitorStream);

        // set up logging.
        this.log = new LoggerService();
        this.log.logLevel = LogLevel.Info;

        // disable monitor dump by default.
        this.enableMonitorDump(false);
        this.monitorBus();

        this.channelMap = this.internalChannelMap;
    }

    getName(): string {
        return 'EventBusLowLevelApi';
    }

    getChannel(cname: ChannelName, from: SentFrom): Observable<Message> {
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

    getChannelObject(name: ChannelName, from?: SentFrom): Channel {
        let channel: Channel;
        let symbol = ' + ';

        if (this.internalChannelMap.has(name)) {
            channel = this.internalChannelMap.get(name);
        } else {
            channel = new Channel(name);
            this.internalChannelMap.set(name, channel);
            symbol = ' +++ ';

            let mo = new MonitorObject().build(MonitorType.MonitorNewChannel, name, from, symbol);
            this.monitorStream.send(new Message().request(mo));
        }
        channel.increment();
        return channel;
    }

    getRequestChannel(name: ChannelName, from?: SentFrom): Observable<Message> {
        return this.getChannel(name, from)
            .filter((message: Message) => {
                return (message.isRequest());
            });
    }

    getResponseChannel(cname: ChannelName, from?: SentFrom): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isResponse());
            });
    }

    getErrorChannel(cname: ChannelName, from?: SentFrom): Observable<Message> {
        return this.getChannel(cname, from)
            .filter((message: Message) => {
                return (message.isError());
            });
    }

    getGalacticChannel(cname: ChannelName, from: SentFrom): Observable<Message> {
        this.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorNewGalacticChannel, cname, from)
            )
        );

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

    sendRequest(cname: string, payload: any, name?: string, schema?: any): void {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.send(mh.sendChannel, new Message().request(mh, schema), name);
    }

    sendResponse(cname: string, payload: any, name?: string, schema?: any): void {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.tickEventLoop(
            () => {
                this.send(mh.sendChannel, new Message().response(mh, schema), name);
            }
        );
    }

    complete(cname: ChannelName, from?: SentFrom): boolean {
        if (!this.internalChannelMap.has(cname)) {
            return false;
        }
        this.monitorStream.send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorCompleteChannel, cname, from)
            )
        );

        const channel = this.internalChannelMap.get(cname);
        channel.complete();
        this.destroy(channel, from);
        return true;
    }

    close(cname: ChannelName, from?: SentFrom): boolean {
        if (!this.internalChannelMap.has(cname)) {
            return false;
        }

        let channel = this.internalChannelMap.get(cname);
        channel.decrement();
        let mo = new MonitorObject().build(MonitorType.MonitorCloseChannel, cname, from, ' ' + channel.refCount);
        this.monitorStream.send(new Message().request(mo));

        if (channel.refCount === 0) {
            this.destroy(channel, from);
            return true;
        }
    }

    countListeners(): number {
        let count = 0;
        this.channelMap.forEach((channel) => {
            count += channel.refCount;
        });
        return count;
    }

    destroyAllChannels(): void {
        this.channelMap.forEach((channel, name) => {
            this.destroy(channel, name);
        });
    }

    refCount(cname: ChannelName): number {
        if (!this.internalChannelMap.has(cname)) {
            return -1;
        }

        return this.internalChannelMap.get(cname).refCount;
    }

    increment(cname: string): number {
        return this.channelMap.get(cname).increment();
    }

    getMonitor(): Subject<Message> {
        return this.monitorStream.stream;
    }

    getMonitorStream(): Channel {
        return this.monitorStream;
    }

    isLoggingEnabled(): boolean {
        return this.dumpMonitor;
    }

    enableMonitorDump(flag: boolean): void {
        this.dumpMonitor = flag;
    }

    logger(): LoggerService {
        return this.log;
    }

    messageLog(msg: string, from?: SentFrom): void {
        this.log.info(msg, from);
    }

    suppressLog(set: boolean): void {
        this.log.suppress(set);
    }

    silenceLog(set: boolean): void {
        this.log.silent(set);
    }

    setLogLevel(logLevel: LogLevel): void {
        this.log.logLevel = logLevel;
    }

    send(cname: ChannelName, message: Message, from?: SentFrom): boolean {
        let mo = new MonitorObject;
        if (!this.internalChannelMap.has(cname)) {
            mo = new MonitorObject().build(MonitorType.MonitorDropped, cname, from, message);
            this.monitorStream.send(new Message().request(mo));
            return false;
        }

        mo = new MonitorObject().build(MonitorType.MonitorData, cname, from, message);
        this.monitorStream.send(new Message().request(mo));
        this.internalChannelMap.get(cname)
            .send(message);
        return true;
    }

    error(cname: ChannelName, err: any): boolean {
        if (!this.internalChannelMap.has(cname)) {
            return false;
        }

        const mo: MonitorObject = new MonitorObject().build(MonitorType.MonitorError, cname, 'bus error');
        this.monitorStream.send(new Message().error(mo));

        this.internalChannelMap.get(cname)
            .error(err);
        return true;
    }

    tickEventLoop(func: Function): void {
        setTimeout(func);
    };

    request<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom, schema?: any): MessageHandler<R, E> {

        // ignore schema for now.
        this.send(handlerConfig.sendChannel, new Message().request(handlerConfig, schema), name);

        return this.createMessageHandler(handlerConfig, false, name);
    }

    respond<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom, schema?: any): MessageResponder<R, E> {

        return this.createMessageResponder(handlerConfig, name, schema);
    }

    listen<R>(handlerConfig: MessageHandlerConfig, requestStream?: boolean, name?: SentFrom): MessageHandler<R> {
        return this.createMessageHandler(handlerConfig, requestStream, name);
    }

    /**
     * PRIVATE METHODS.
     */

    /**
     * Create a message Responder.
     *
     * @param {MessageHandlerConfig} handlerConfig
     * @param {string} name
     * @param schema
     * @returns {MessageResponder<T, E>}
     */
    private createMessageResponder<T, E = any>(handlerConfig: MessageHandlerConfig,
                                               name = this.getName(), schema?: any): MessageResponder<T, E> {
        let schemaRef = schema;
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
                            this.tickEventLoop(
                                () => {
                                    this.eventBusRef.sendResponseMessage(
                                        handlerConfig.returnChannel,
                                        generateSuccessResponse(pl),
                                        name,
                                        schemaRef,
                                    );
                                }
                            );
                        } else {
                            let err: Function;
                            if (generateErrorResponse) {
                                err = generateErrorResponse;
                            } else {
                                err = generateSuccessResponse;
                            }
                            this.tickEventLoop(
                                () => {
                                    this.eventBusRef.sendErrorMessage(
                                        handlerConfig.returnChannel,
                                        err(pl),
                                        name,
                                        schemaRef,
                                    );
                                }
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
     * Create a message handler.
     * @param {MessageHandlerConfig} handlerConfig
     * @param {boolean} requestStream
     * @param {string} name
     * @returns {MessageHandler<any>}
     */
    private createMessageHandler(handlerConfig: MessageHandlerConfig, requestStream: boolean = false,
                                 name = this.getName()): MessageHandler<any> {
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
                    this.eventBusRef.sendRequestMessage(handlerConfig.sendChannel, payload);
                }
            },
            error: (payload: any): void => {
                if (sub && !sub.closed) {
                    this.eventBusRef.sendErrorMessage(handlerConfig.returnChannel, payload);
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
     * Destroy a Channel and remove it from our map. If it is not closed, close it first.
     *
     * @param {Channel} channel
     * @param {string} from
     * @returns {boolean}
     */
    private destroy(channel: Channel, from: SentFrom): void {
        this.monitorStream.send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorDestroyChannel, channel.name, from)
            )
        );

        this.internalChannelMap.delete(channel.name);
    }

    /**
     * Dump data flowing through the monitor API into the console.
     *
     * @param {MonitorObject} mo
     * @param {string} tag
     */
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