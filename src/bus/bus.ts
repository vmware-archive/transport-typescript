/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { Channel } from './model/channel.model';
import { MonitorObject, MonitorType } from './model/monitor.model';
import {
    Message,
    MessageHandlerConfig
} from './model/message.model';
import { BusStoreApi } from '../store.api';
import { UUID } from './store/store.model';
import { BrokerConnectorChannel, StompBusCommand, StompConfig } from '../bridge/stomp.model';
import { StompClient } from '../bridge/stomp.client';
import { StompParser } from '../bridge/stomp.parser';
import {
    BusTransaction,
    ChannelName,
    EventBus,
    EventBusEnabled,
    EventBusLowApi, MessageFunction, MessageHandler, MessageResponder,
    SentFrom,
    TransactionType
} from '../bus.api';
import { EventBusLowLevelApiImpl } from './bus.lowlevel';
import { Logger } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { GalacticRequest } from './model/request.model';
import { GalacticResponse } from './model/response.model';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StoreManager } from './store/store.manager';
import { BusTransactionImpl } from './transaction';
import { BrokerConnector } from '../bridge/broker-connector';
import { GeneralUtil } from '../util/util';
import { MessageProxy, MessageProxyConfig, ProxyControl } from '../proxy/message.proxy';

export class BifrostEventBus extends EventBus implements EventBusEnabled {

    private static _instance: EventBus;

    /**
     * Destroy the bus completely.
     */
    public static destroy(): void {
        this._instance = null;
    }

    public static getInstance(): EventBus {
        return BifrostEventBus.boot();
    }

    /**
     * Boot and create a singleton EventBus instance with default options
     * @returns {EventBus} the bus.
     */
    public static boot(): EventBus {
        return this._instance || (this._instance = new this());
    }

    /**
     * Boot and create a singleton EventBus instance with custom options for logging level and boot message
     * @param {LogLevel} logLevel log level to set
     * @param {boolean} disableBootMessage set to true to turn off the boot message.
     * @returns {EventBus} the bus
     */
    public static bootWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        return this._instance || (this._instance = new this(logLevel, disableBootMessage));
    }

    /**
     * Reboot the bus, critical for tests, reboot destroys the singleton and re-creates it.
     * @param {LogLevel} logLevel  log level to set
     * @param {boolean} disableBootMessage set true to turn off the boot message.
     * @returns {EventBus} the newly rebooted bus
     */
    public static rebootWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        return (this._instance = new this(logLevel, disableBootMessage));
    }

    /**
     * Reboot the bus, critical for tests, reboot destroys the singleton and re-creates it.
     * @returns {EventBus} the newly rebooted event bus.
     */
    public static reboot(): EventBus {
        return (this._instance = new this());
    }

    private internalChannelMap: Map<string, Channel>;
    private log: Logger;
    private windowRef = window;
    private messageProxy: MessageProxy;

    // low level API
    readonly api: EventBusLowApi;
    readonly stores: BusStoreApi;

    private constructor(logLevel: LogLevel = LogLevel.Off, disableBootMessage: boolean = true) {
        super();
        this.internalChannelMap = new Map<string, Channel>();

        // logging
        this.log = new Logger();

        // Low Level API.
        this.api = new EventBusLowLevelApiImpl(this, this.internalChannelMap, this.log);

        // Store API
        this.stores = new StoreManager(this, this.log);

        // wire up singleton to the window object under a custom namespace.
        this.windowRef.AppEventBus = this as EventBus;
        this.windowRef.AppBrokerConnector = new BrokerConnector(this.log);
        this.windowRef.AppBrokerConnector.init(this);
        this.windowRef.window.AppSyslog = this.log;
        this.windowRef.AppStoreManager = this.stores;

        if (!disableBootMessage) {
            this.log.setStylingVisble(true);
            this.log.info('🌈 Bifröst ' + EventBus.version + ' Initialized', 'window.AppEventBus');
        }

        // set up logging.
        this.log.logLevel = logLevel;
        this.api.setLogLevel(logLevel);

        // say hi to magnum.
        // this.easterEgg();
    }

    public get logger(): Logger {
        return this.log;
    }

    public getName() {
        return 'EventBus';
    }


    public enableMessageProxy(config: MessageProxyConfig): ProxyControl {

        this.messageProxy = MessageProxy.getInstance();
        this.messageProxy.enableProxy(config);
        return null;

    }

    public connectBridge(
        readyHandler: MessageFunction<string>,
        endpoint: string,
        topicLocation: string,
        queueLocation?: string,
        numBrokerRelays: number = 1,
        host?: string,
        port?: number,
        applicationDestinationPrefix?: string,
        user?: string,
        pass?: string,
        useSSL?: boolean): MessageHandler<StompBusCommand> {

        const config: StompConfig = StompConfig.generate(
            endpoint,
            host,
            port,
            useSSL,
            user,
            pass,
            applicationDestinationPrefix
        );
        config.topicLocation = topicLocation;
        config.queueLocation = queueLocation;
        config.brokerConnectCount = numBrokerRelays;
        const handler: MessageHandler<StompBusCommand> = this.requestStream(
            BrokerConnectorChannel.connection,
            StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, '', '', config),
        );
        handler.handle(
            (command: StompBusCommand) => {
                if (command.command === StompClient.STOMP_CONNECTED) {
                    readyHandler(command.session);
                } else {
                    this.api.logger()
                        .info('connection handler received command message: ' + command.command, this.getName());
                }
            }
        );
        return handler;
    }

    public listenGalacticStream<T>(cname: ChannelName, name: SentFrom = this.getName()): MessageHandler<T> {

        this.api.getChannelObject(cname, name, true, false).setGalactic();

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
        cname: ChannelName,
        payload: any,
        name = this.getName()
    ): void {

        this.api.send(cname, new Message().request(payload), name);
    }

    public sendRequestMessageWithId<R>(
        cname: string,
        payload: R,
        id: UUID,
        from?: string): void {

        this.api.send(cname, new Message(id).request(payload), from);
    }

    public sendRequestMessageWithIdAndVersion<R>(
        cname: string,
        payload: R,
        id: UUID,
        version: number,
        from?: string): void {
        this.api.send(
            cname,
            new Message(id, version).request(payload),
            from
        );
    }


    public sendResponseMessage(
        cname: ChannelName,
        payload: any,
        name = this.getName()): boolean {

        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname,
                    new Message().response(payload),
                    name
                );
            }
        );
        return true;
    }

    public sendResponseMessageWithId<R>(
        cname: string,
        payload: R,
        id: UUID,
        from?: string): void {
        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname,
                    new Message(id).response(payload),
                    from
                );
            }
        );
    }

    public sendResponseMessageWithIdAndVersion<R>(
        cname: string,
        payload: R,
        id: UUID,
        version: number,
        from?: string): void {
        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname,
                    new Message(id, version).response(payload),
                    from
                );
            }
        );
    }


    public sendErrorMessage(
        cname: ChannelName,
        payload: any,
        name = this.getName()): void {

        this.api.send(cname, new Message().error(payload), name);
    }


    public respondOnce<R>(
        sendChannel: ChannelName,
        returnChannel?: ChannelName,
        name = this.getName()): MessageResponder<R> {

        return this.api.respond(
            new MessageHandlerConfig(sendChannel, null, true, returnChannel),
            name
        );
    }

    public respondStream<R>(
        sendChannel: ChannelName,
        returnChannel?: ChannelName,
        name = this.getName()): MessageResponder<R> {

        return this.api.respond(
            new MessageHandlerConfig(sendChannel, null, false, returnChannel),
            name
        );

    }

    public requestStream<T, R>(
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        name = this.getName()): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, false, returnChannel),
            name
        );

    }

    public requestStreamWithId<T, R>(
        uuid: UUID,
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        name = this.getName()): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, false, returnChannel),
            name,
            uuid
        );
    }

    public requestOnce<T, R>(
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        name = this.getName()): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, true, returnChannel),
            name
        );
    }

    public requestOnceWithId<T, R>(
        uuid: UUID,
        sendChannel: ChannelName,
        requestPayload: T,
        returnChannel?: ChannelName,
        from?: SentFrom): MessageHandler<R> {

        return this.api.request(
            new MessageHandlerConfig(sendChannel, requestPayload, true, returnChannel),
            name,
            uuid
        );
    }

    public listenOnce<R>(channel: ChannelName, name = this.getName(), id?: UUID): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, true, channel),
            false,
            name
        );
    }

    public listenStream<R>(channel: ChannelName, name = this.getName(), id?: UUID): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, false, channel),
            false,
            name,
            id
        );
    }

    public listenRequestOnce<R>(channel: ChannelName, name = this.getName(), id?: UUID): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, true, channel),
            true,
            name,
            id
        );
    }

    public listenRequestStream<R>(channel: ChannelName, name = this.getName(), id?: UUID): MessageHandler<R> {
        return this.api.listen(
            new MessageHandlerConfig(channel, null, false, channel),
            true,
            name,
            id
        );
    }

    public closeChannel(cname: ChannelName, from?: SentFrom): boolean {
        return this.api.close(cname, from);
    }

    public requestGalactic<T, R>(
        channel: string,
        request: GalacticRequest<T>,
        successHandler: MessageFunction<GalacticResponse<R>>,
        errorHandler: MessageFunction<GalacticResponse<R>>,
        from?: string): void {

        if (!channel || !request) {
            this.log.error('Cannot send Galactic Request, payload or channel is empty.', this.getName());
            return;
        }

        const conversationId: UUID = request.id;

        const stream: Observable<Message> = this.api.getGalacticChannel(channel)
            .pipe(
                filter((message: Message) => {
                    return (message.isResponse());
                }),
                filter((message: Message) => {
                    const resp: GalacticResponse<R> = message.payload as GalacticResponse<R>;
                    return conversationId === resp.id;
                }));

        const sub = stream.subscribe(
            (msg: Message) => {
                const resp: GalacticResponse<R> = msg.payload;
                if (resp.error) {
                    errorHandler(resp);
                } else {
                    this.log.debug('Galactic Response Incoming: ' + resp.id);
                    successHandler(resp);
                }
                sub.unsubscribe();
                this.closeGalacticChannel(channel);
            }
        );

        this.sendGalacticMessage(channel, request);

    }

    public createTransaction(type: TransactionType = TransactionType.ASYNC,
                             name: string = 'Transaction' + GeneralUtil.genUUIDShort()): BusTransaction {
        return new BusTransactionImpl(this, this.log, type, name);
    }

    public easterEgg(): void {

        const chan = this.api.getRequestChannel('__maglingtonpuddles__', this.getName(), true);
        chan.subscribe(
            () => {
                const msg = 'Maggie wags his little nubby tail at you, ' +
                    'as he sits under his little yellow boat on the beach';
                this.sendResponseMessage('__maglingtonpuddles__', msg);
            }
        );
    }
}
