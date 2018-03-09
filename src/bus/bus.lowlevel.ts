/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { ChannelName, EventBus, EventBusLowApi, SentFrom } from './bus.api';
import { Channel } from './model/channel.model';
import { 
    Message, 
    MessageHandler, 
    MessageHandlerConfig, 
    MessageResponder, 
    MessageType
} from './model/message.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { MonitorChannel, MonitorObject, MonitorType } from './model/monitor.model';
import { LogUtil } from '../log/util';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from './store/store.model';

export class EventBusLowLevelApiImpl implements EventBusLowApi {

    readonly channelMap: Map<ChannelName, Channel>;
    private log: LoggerService;
    private monitorChannel = MonitorChannel.stream;
    private monitorStream: Channel;
    private dumpMonitor: boolean;
    private internalChannelMap: Map<string, Channel>;
    public loggerInstance: LoggerService;


    constructor(private eventBusRef: EventBus, channelMap: Map<string, Channel>, logger: LoggerService) {
        this.internalChannelMap = channelMap;

        // create monitor stream.
        this.monitorStream = new Channel(this.monitorChannel);
        this.internalChannelMap.set(this.monitorChannel, this.monitorStream);

        // set up logging.
        this.log = logger;
    
        // disable monitor dump by default.
        this.enableMonitorDump(false);
        this.monitorBus();

        this.channelMap = this.internalChannelMap;
        this.loggerInstance = this.log;

    }

    getChannel(cname: ChannelName, from: SentFrom, noRefCount: boolean = false): Observable<Message> {
        return this.getChannelObject(cname, from, noRefCount)
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

    getChannelObject(
        name: ChannelName, 
        from?: SentFrom, 
        noRefCount: boolean = false, 
        broadcast: boolean = true): Channel {

        let channel: Channel;
        let symbol;

        const monitorNewReference = () => {

            const observerId: UUID = channel.createObserver();
            let mo = new MonitorObject().build(MonitorType.MonitorObserverJoinedChannel,
                name, from, { count: channel.refCount, id: observerId, from: from });
            this.monitorStream.send(new Message().request(mo));
        };

        const newChannelCreated = () => {
            let mo = new MonitorObject().build(MonitorType.MonitorNewChannel, name, from, '');
            this.monitorStream.send(new Message().request(mo));
        };

        let newChannel: boolean = false;

        if (this.internalChannelMap.has(name)) {
            channel = this.internalChannelMap.get(name);

        } else {
            channel = new Channel(name);
            this.internalChannelMap.set(name, channel);
            newChannel = true;
        }

        if (!noRefCount) {
            channel.increment();
        }

        if (newChannel && broadcast) { 
            newChannelCreated();
        }

        if (!noRefCount && broadcast) {
            monitorNewReference();
        }


        return channel;
    }

    getRequestChannel(name: ChannelName, from?: SentFrom, noRefCount: boolean = false): Observable<Message> {
        return this.getChannel(name, from, noRefCount)
            .filter((message: Message) => {
                return (message.isRequest());
            });
    }

    getResponseChannel(cname: ChannelName, from?: SentFrom, noRefCount: boolean = false): Observable<Message> {
        return this.getChannel(cname, from, noRefCount)
            .filter((message: Message) => {
                return (message.isResponse());
            });
    }

    getErrorChannel(cname: ChannelName, from?: SentFrom, noRefCount: boolean = false): Observable<Message> {
        return this.getChannel(cname, from, noRefCount)
            .filter((message: Message) => {
                return (message.isError());
            });
    }

    getGalacticChannel(cname: ChannelName, from?: SentFrom, noRefCount: boolean = false): Observable<Message> {
        this.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorNewGalacticChannel, cname, from)
            )
        );

        return this.getChannelObject(cname, from, noRefCount)
            .setGalactic().stream
            .map(
            (msg: Message) => {
                // just an FYI -  I hate this... I made a bad choice and I will fix it!
                if (msg.payload.hasOwnProperty('_sendChannel')) {
                    msg.payload = msg.payload.body;
                }
                return msg;
            }
            );
    }

    sendRequest(cname: string, payload: any, name?: string): void {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.send(mh.sendChannel, new Message().request(mh), name);
    }

    sendResponse(cname: string, payload: any, name?: string): void {
        let mh: MessageHandlerConfig = new MessageHandlerConfig(cname, payload, true, cname);
        this.tickEventLoop(
            () => {
                this.send(mh.sendChannel, new Message().response(mh), name);
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

    close(cname: ChannelName, from?: SentFrom, observerId: UUID = 'none'): boolean {
        if (!this.internalChannelMap.has(cname)) {
            return false;
        }

        let channel = this.internalChannelMap.get(cname);
        channel.decrement();
        let mo = new MonitorObject().build(MonitorType.MonitorObserverLeftChannel, cname, from,
            { count: channel.refCount, from: from, id: observerId });
        this.monitorStream.send(new Message().request(mo));

        if (channel.refCount === 0) {

            mo = new MonitorObject().build(MonitorType.MonitorCloseChannel, cname, from, channel.refCount);
            this.monitorStream.send(new Message().request(mo));

            this.destroy(channel, from);
            return true;
        }
    }

    countListeners(): number {
        let count = 0;
        this.channelMap.forEach((channel) => {
            //console.log('channel open: ' + channel.name + ' - ' + channel.refCount);
            count += channel.refCount;
        });
        //console.log('----\n\n');
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

        const mo: MonitorObject = new MonitorObject().build(MonitorType.MonitorError, cname, err);
        this.monitorStream.send(new Message().error(mo));

        this.internalChannelMap.get(cname)
            .error(err);
        return true;
    }

    tickEventLoop(func: Function, delay: number = 0): void {
        setTimeout(func, delay);
    }

    request<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom,
                        schema?: any, id?: UUID): MessageHandler<R, E> {

        // ignore schema for now.
        const handler: MessageHandler<R, E> = this.createMessageHandler(handlerConfig, false, name, id);
        this.send(handlerConfig.sendChannel, new Message(id).request(handlerConfig), name);
        return handler;
    }

    respond<R, E = any>(handlerConfig: MessageHandlerConfig, name?: SentFrom, schema?: any): MessageResponder<R, E> {

        return this.createMessageResponder(handlerConfig, name);
    }

    listen<R>(handlerConfig: MessageHandlerConfig, requestStream?: boolean, 
              name?: SentFrom, id?: UUID): MessageHandler<R> {
        return this.createMessageHandler(handlerConfig, requestStream, name, id);
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
    private createMessageResponder<T, E = any>(
        handlerConfig: MessageHandlerConfig, name?: string): MessageResponder<T, E> {


        let sub: Subscription;
        const errorChannel: Observable<Message> = this.getErrorChannel(handlerConfig.sendChannel, name, true);
        const requestChannel: Observable<Message> = this.getRequestChannel(handlerConfig.sendChannel, name);
        let closed: boolean = false;
        const chanObject: Channel = this.getChannelObject(handlerConfig.returnChannel, name, true);
        const subscriberId: UUID = chanObject.createSubscriber();
        const latestObserver = chanObject.latestObserver;
        
        const killSubscription = () => { 
            sub.unsubscribe();
            this.sendUnsubscribedMonitorMessage(subscriberId, chanObject.name, name);
            chanObject.removeSubscriber(subscriberId);
            this.close(handlerConfig.sendChannel, name, latestObserver);
            sub = null;
            closed = true;
        };

        return {
            generate: (generateSuccessResponse: Function, generateErrorResponse: Function): Subscription => {
                this.sendSubscribedMonitorMessage(subscriberId, chanObject.name, name);
                const mergedStreams = Observable.merge(errorChannel, requestChannel);
                sub = mergedStreams.subscribe(
                    (msg: Message) => {
                        let pl = msg.payload;
                        if (!msg.isError()) {
                            this.tickEventLoop(
                                () => {
                                    this.eventBusRef.sendResponseMessageWithId(
                                        handlerConfig.returnChannel,
                                        generateSuccessResponse(pl),
                                        msg.id,
                                        name
                                    );
                                }
                            );
                        } else {
                            let err: Function;
                            if (generateErrorResponse) {
                                err = generateErrorResponse;
                            } else {
                                err = generateSuccessResponse; // what else should we do here?
                            }
                            this.tickEventLoop(
                                () => {
                                    this.eventBusRef.sendErrorMessage(
                                        handlerConfig.returnChannel,
                                        err(pl),
                                        name
                                    );
                                }
                            );
                        }
                        if (handlerConfig.singleResponse) {
                            
                            killSubscription();
                        }
                    },
                    (errorData: any) => {

                        this.log.error('responder caught error, discarding.', name);
                        if (sub) {
                            killSubscription();
                        }
                    }
                );
                return sub;
            },
            tick: (payload: any): void => {
                if (!closed) {
                    this.sendResponse(handlerConfig.returnChannel, payload);
                }
            },
            close: (): boolean => {
                if (!handlerConfig.singleResponse) {
                    sub.unsubscribe();

                    // return refcount
                    this.close(handlerConfig.sendChannel, name, latestObserver);
                    this.sendUnsubscribedMonitorMessage(subscriberId, chanObject.name, name);
                    closed = true;
                    sub = null;
                }
                return true;
            },
            isClosed(): boolean {
                return closed;
            },
            getObservable(): Observable<any> {
                const chan = Observable.merge(requestChannel, errorChannel);
                return chan.map(
                    (msg: Message) => {
                        let pl = msg.payload;
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

    private sendSubscribedMonitorMessage(uuid: UUID, channelName: ChannelName, from?: SentFrom): void {
        this.monitorStream.send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorObserverSubscribedChannel, channelName, name,
                    { id: uuid, from: from })
            )
        );
    }

    private sendUnsubscribedMonitorMessage(uuid: UUID, channelName: ChannelName, from?: SentFrom): void {
        this.monitorStream.send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorObserverUnsubscribedChannel, channelName, name,
                    { id: uuid, from: from })
            )
        );
    }
    /**
     * Create a message handler.
     * @param {MessageHandlerConfig} handlerConfig
     * @param {boolean} requestStream
     * @param {string} name
     * @returns {MessageHandler<any>}
     */
    private createMessageHandler(
        handlerConfig: MessageHandlerConfig, 
        requestStream: boolean = false,
        name?: string, 
        messageId?: UUID): MessageHandler<any> {

        let sub: Subscription;
        const errorChannel: Observable<Message> = this.getErrorChannel(handlerConfig.returnChannel, name, true);
        const requestChannel: Observable<Message> = this.getRequestChannel(handlerConfig.returnChannel, name, true);
        const responseChannel: Observable<Message> = this.getResponseChannel(handlerConfig.returnChannel, name, true);
        const fullChannel: Observable<Message> = this.getChannel(handlerConfig.returnChannel, name, false);
        const chanObject: Channel = this.getChannelObject(handlerConfig.returnChannel, name, true);
        const subscriberId: UUID = chanObject.createSubscriber();
        const latestObserver = chanObject.latestObserver;
        this.sendSubscribedMonitorMessage(subscriberId, chanObject.name, name);
        let closed: boolean = false;
        const registeredId = messageId;

        const killSubscription = () => { 
            sub.unsubscribe();
            chanObject.removeSubscriber(subscriberId);
            this.sendUnsubscribedMonitorMessage(subscriberId, chanObject.name, name);
            this.close(handlerConfig.returnChannel, name, latestObserver);
            sub = null;
            closed = true;
        };

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
                        
                        // If you have registered your handler with a message ID, this will check and
                        // and in some more checks to ensure only messages with a matching ID will proceed.
                        // this logic will only kick in if the response (inbound) message has an ID, if no ID is
                        // found on the inbound, then validation is bypassed and the gates open regardless.

                        let validateId: boolean = false;
                        let proceedToHandle: boolean = true;
                        
                        if (registeredId && msg.id) {
                            validateId = true;
                        }
                        if (validateId && msg.id && registeredId !== msg.id) {
                            proceedToHandle = false;
                        }

                        if (proceedToHandle) {
                            let _pl = msg.payload;
                            if (msg.isError()) {
                                if (error) {
                                    error(_pl);
                                }
                            } else {
                                if (success) {
                                    success(_pl);
                                } else {
                                    this.log.error('unable to handle response, no handler function supplied', name);
                                }
                            }
                            if (handlerConfig.singleResponse) {
                                if (sub) {
                                    killSubscription();
                                }
                            }
                        } else {
                            this.log.debug('* Dropping Message ' + msg.id 
                                            + ', handler only listening for ' + registeredId, name);
                        }     
                    },
                    (errorData: any) => {
                        if (error) {
                            error(errorData);
                        } else {
                            this.log.error('unable to handle error, no error handler function supplied', name);
                        }
                        if (sub) {
                            killSubscription();
                        }
                    }
                );
                return sub;
            },
            tick: (payload: any): void => {
                if (!closed) {
                    this.eventBusRef.sendRequestMessageWithId(handlerConfig.sendChannel, payload, messageId);
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
                        killSubscription();
                    }
                    sub = null;
                }
                return true;
            },
            isClosed(): boolean {
                return closed;
            },
            getObservable(type?: MessageType): Observable<any> {

                let chan;
                //if (type) {
                switch (type) {
                    case MessageType.MessageTypeResponse:
                        chan = responseChannel;
                        break;
                    case MessageType.MessageTypeError:
                        chan = errorChannel;
                        break;
                    case MessageType.MessageTypeRequest:
                        chan = requestChannel;
                        break;
                    default:
                        chan = fullChannel;
                        break;
                }
                //}
                return chan.map(
                    (msg: Message) => {
                        let pl = msg.payload;
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
    private dumpData(mo: MonitorObject, tag: string, dropped: boolean = false) {

        let message = mo.data as Message;

        this.log.group(LogLevel.Info, tag);
        if (message.isRequest()) {
            this.log.info('📤 Request (outbound)', null);
        } else {
            if (message.isError()) {
                this.log.info('⁉️ ERROR!', null);
            } else {
                this.log.info('📥 Response (inbound)', 'message type');
            }
        }
        this.log.info('📤 Channel: ' + mo.channel, null);
        if (dropped) {
            this.log.warn('💩 Message Was Dropped!', null);
        }
        this.log.group(LogLevel.Info, message.isError() ? '⚠️ Error Payload' : '📦 Message Payload');

        this.log.info(LogUtil.pretty(message.payload), null);
        this.log.groupEnd(LogLevel.Info);
        this.log.groupEnd(LogLevel.Info);
    }

    /**
     * This is a listener on the monitor channel which dumps message events to the console
     */
    private monitorBus() {

        this.getMonitor()
            .subscribe(
            (message: Message) => {
                //if (!message.isError()) {
                if (this.dumpMonitor) {

                    let mo = message.payload as MonitorObject;
                    let type: string = 'Response';
                    let pload: Message = mo.data as Message;
                    
                    // bypass easteregg.
                    if (mo.channel === '__maglingtonpuddles__') {
                        return;
                    }
                    switch (mo.type) {
                        case MonitorType.MonitorNewChannel:
                            this.log.info('✨ (channel created)-> ' + mo.channel, mo.from);
                            break;
                        
                        case MonitorType.MonitorNewGalacticChannel:
                            this.log.info('🌌 (galactic channel mapped)-> ' + mo.channel, mo.from);
                            break;

                        case MonitorType.MonitorObserverJoinedChannel:
                            this.log.info('👁 (new observer ' + mo.data.id + ' [' + mo.data.count + '])-> ' +
                                mo.channel, mo.data.from);
                            break;

                        case MonitorType.MonitorObserverSubscribedChannel:
                            this.log.info('📡 (observer subscribed [' + mo.data.id + '])-> '
                                + mo.channel, mo.data.from);
                            break;

                        case MonitorType.MonitorObserverUnsubscribedChannel:
                            this.log.info('💨 (observer un-subscribed [' + mo.data.id + '])-> '
                                + mo.channel, mo.data.from);
                            break;

                        case MonitorType.MonitorObserverLeftChannel:
                            this.log.info('🗑️ (observer closed [' + mo.data.id + '])-> ' +
                                mo.channel, mo.data.from);
                            break;

                        case MonitorType.MonitorCloseChannel:
                            this.log.info('🚫 (channel closed)-> ' + mo.channel, mo.from);
                            break;

                        case MonitorType.MonitorCompleteChannel:
                            this.log.info('🏁 (channel completed)-> ' + mo.channel, mo.from);
                            break;

                        case MonitorType.MonitorDestroyChannel:
                            this.log.info('💣 (channel destroyed)-> ' + mo.channel, mo.from);
                            break;

                        case MonitorType.MonitorData:
                            if (pload.isRequest()) {
                                type = 'Request';
                            }
                            if (pload.isError()) {
                                type = 'Error';
                            }
                            this.dumpData(mo, '💬 (' + type + ')-> ' + mo.channel + ' [' + mo.from + ']');
                            break;

                        case MonitorType.MonitorDropped:
                            this.dumpData(mo, '💩 (dropped)->  ' + mo.from + ' -> ' + mo.channel, true);
                            break;

                        case MonitorType.MonitorError:
                            this.log.error('(error)-> ' + mo.channel, mo.from);
                            break;

                        default:
                            break;
                    }
                }
            }
            );
    }

}