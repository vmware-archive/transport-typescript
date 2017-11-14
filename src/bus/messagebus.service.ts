/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { Syslog } from '../log/syslog';

import { StompService } from '../';
import { Channel } from './model/channel.model';
import { MonitorObject, MonitorType } from './model/monitor.model';
import {
    Message, MessageHandlerConfig, MessageResponder, MessageHandler,
    MessageFunction
} from './model/message.model';
import { MessageSchema, ErrorSchema } from './model/message.schema';
import { StoreImpl } from './cache/cache';
import { BusStore } from './cache.api';
import { StoreType, UUID } from './cache/cache.model';
import { StompBusCommand, StompChannel, StompConfig } from '../bridge/stomp.model';
import { StompClient } from '../bridge/stomp.client';
import { StompParser } from '../bridge/stomp.parser';
import { ChannelName, EventBus, EventBusLowApi, SentFrom } from './bus.api';
import 'rxjs/add/operator/merge';
import { EventBusLowLevelApiImpl } from './bus.lowlevel';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';

export abstract class MessageBusEnabled {
    abstract getName(): string;
}

export class MessagebusService extends EventBus implements MessageBusEnabled {

    private internalChannelMap: Map<string, Channel>;
    private internalStoreMap: Map<string, BusStore<any>>;
    private log: LoggerService;


    // low level API
    readonly api: EventBusLowApi;

    constructor(logLevel: LogLevel = LogLevel.Info, disableBootMessage: boolean = false) {
        super();
        this.internalChannelMap = new Map<string, Channel>();

        // Low Level API.
        this.api = new EventBusLowLevelApiImpl(this, this.internalChannelMap);

        // Store map.
        this.internalStoreMap = new Map<StoreType, BusStore<any>>();

        // wire up singleton to the window object under a custom namespace.
        window.AppEventBus = this as EventBus;
        window.AppBrokerConnector = new StompService();
        window.AppBrokerConnector.init(this);
        window.AppSyslog = Syslog;

        // set up logging.
        this.api.setLogLevel(logLevel);
        if (!disableBootMessage) {
            this.log = new LoggerService();
            this.log.logLevel = logLevel;
            this.log.setStylingVisble(false);
            this.log.info('🌈 Bifröst ' + EventBus.version + ' Initialized', 'window.AppEventBus');
        }
    }

    public createStore<T>(objectType: StoreType, map?: Map<UUID, T>): BusStore<T> {
        if (!this.getStore(objectType)) {
            const cache: BusStore<T> = new StoreImpl<T>(this);
            if (map) {
                cache.populate(map);
            }
            this.internalStoreMap.set(objectType, cache);
            return cache;
        } else {
            return this.getStore(objectType);
        }
    }

    public getStore<T>(objectType: StoreType): BusStore<T> {
        return this.internalStoreMap.get(objectType);
    }

    public destroyStore(objectType: StoreType): boolean {
        if (this.internalStoreMap.has(objectType)) {
            this.internalStoreMap.delete(objectType);
            return true;
        }
        return false;
    }

    public getName() {
        return 'MessagebusService';
    }

    public connectBridge(
        readyHandler: MessageFunction<string>,
        endpoint: string,
        topicLocation: string,
        queueLocation?: string,
        numBrokerRelays: number = 1,
        host?: string,
        port?: number,
        user?: string,
        pass?: string,
        useSSL?: boolean): MessageHandler<StompBusCommand> {

        const config: StompConfig = StompConfig.generate(
            endpoint,
            host,
            port,
            useSSL,
            user,
            pass
        );
        config.topicLocation = topicLocation;
        config.queueLocation = queueLocation;
        config.brokerConnectCount = numBrokerRelays;
        const handler: MessageHandler<StompBusCommand> = this.requestStream(
            StompChannel.connection,
            StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, '', '', config),
        );
        handler.handle(
            (command: StompBusCommand) => {
                if (command.command === StompClient.STOMP_CONNECTED) {
                    readyHandler(command.session);
                }
            }
        );
        return handler;
    }

    public listenGalacticStream<T>(cname: ChannelName, name: SentFrom = this.getName()): MessageHandler<T> {

        this.api.getChannelObject(cname, name).setGalactic();

        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject()
                    .build(MonitorType.MonitorNewGalacticChannel, cname, null, null)
            )
        );

        return this.listenStream(cname, name);
    }

    public isGalacticChannel(cname: ChannelName): boolean {
        if (this.internalChannelMap.has(cname)) {
            return this.internalChannelMap.get(cname).galactic;
        }

        return false;
    }

    public closeGalacticChannel(cname: ChannelName, from?: SentFrom): void {
        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorGalacticUnsubscribe, cname, from)
            )
        );
    }

    public sendGalacticMessage(cname: ChannelName, payload: any, from?: SentFrom): void {
        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(MonitorType.MonitorGalacticData, cname, from, payload)
            )
        );
    }

    public sendRequestMessage(
        cname: ChannelName, payload: any,
        name = this.getName(), 
        schema = new MessageSchema()): void {

        this.api.send(cname, new Message().request(payload, schema), name);
    }

    public sendResponseMessage(
        cname: ChannelName, 
        payload: any,
        name = this.getName(), 
        schema = new MessageSchema()): boolean {

        this.api.tickEventLoop(
            () => {
                this.api.send(cname, new Message().response(payload, schema), name);
            }
        );
        return true;
    }

    public sendErrorMessage(
        cname: ChannelName, 
        payload: any,
        name = this.getName(), 
        schema = new ErrorSchema()): void {

        this.api.send(cname, new Message().error(payload, schema), name);
    }


    public respondOnce<R>(
        sendChannel: ChannelName, 
        returnChannel?: ChannelName,
        name = this.getName(),
        schema?: any): MessageResponder<R> {

        return this.api.respond(
            new MessageHandlerConfig(sendChannel, null, true, returnChannel),
            name,
            schema
        );
    }

    public respondStream<R>(
        sendChannel: ChannelName, 
        returnChannel?: ChannelName,
        name = this.getName(), 
        schema?: any): MessageResponder<R> {

        return this.api.respond(
            new MessageHandlerConfig(sendChannel, null, false, returnChannel),
            name,
            schema
        );

    }

    public requestStream<T, R>(
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        name = this.getName(),
        schema?: any): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, false, returnChannel),
            name,
            schema
        );

    }

    public requestOnce<T, R>(
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        name = this.getName(),
        schema?: any): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, true, returnChannel),
            name,
            schema
        );
    }

    public listenOnce<R>(channel: ChannelName, name = this.getName()): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, true, channel),
            false,
            name
        );
    }

    public listenStream<R>(channel: ChannelName, name = this.getName()): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, false, channel),
            false,
            name
        );
    }

    public listenRequestOnce<R>(channel: ChannelName, name = this.getName()): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, true, channel),
            true,
            name
        );
    }

    public listenRequestStream<R>(channel: ChannelName, name = this.getName()): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, false, channel),
            true,
            name
        );
    }

    public closeChannel(cname: ChannelName, from?: SentFrom): boolean {
        return this.api.close(cname, from);
    }


}
