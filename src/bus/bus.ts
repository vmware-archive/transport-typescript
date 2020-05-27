/*
 * Copyright 2017-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
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
import { BridgeConnectionAdvancedConfig } from '../bridge/bridge.model';
import {
    BusTransaction, ChannelBrokerMapping,
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
import { StoreManager } from './store/store.manager';
import { BusTransactionImpl } from './transaction';
import { BrokerConnector } from '../bridge/broker-connector';
import { GeneralUtil } from '../util/util';
import { MessageProxyConfig, ProxyControl } from '../proxy/message.proxy.api';
import { MessageProxy } from '../proxy/message.proxy';
import { FabricApi } from '../fabric.api';
import { FabricApiImpl } from '../fabric/fabric';


export class BifrostEventBus extends EventBus implements EventBusEnabled {

    private static instance: EventBus;

    /**
     * Destroy the bus completely.
     */
    public static destroy(): void {
        this.instance = null;
    }

    public static getInstance(): EventBus {
        return BifrostEventBus.boot();
    }

    /**
     * Boot and create a singleton EventBus instance with default options
     * @returns {EventBus} the bus.
     */
    public static boot(): EventBus {
        return this.instance || (this.instance = new this());
    }

    /**
     * Boot and create a singleton EventBus instance with custom options for logging level and boot message
     * @param {LogLevel} logLevel log level to set
     * @param {boolean} disableBootMessage set to true to turn off the boot message.
     * @param {boolean} darkTheme enable dark theme logging (defaults to false)
     * @returns {EventBus} the bus
     */
    public static bootWithOptions(logLevel: LogLevel, disableBootMessage: boolean, darkTheme: boolean = false): EventBus {
        return this.instance || (this.instance = new this(logLevel, disableBootMessage, darkTheme));
    }

    /**
     * Reboot the bus, critical for tests, reboot destroys the singleton and re-creates it.
     * @param {LogLevel} logLevel  log level to set
     * @param {boolean} disableBootMessage set true to turn off the boot message.
     * @returns {EventBus} the newly rebooted bus
     */
    public static rebootWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        this.instance = new this(logLevel, disableBootMessage);
        return this.instance;
    }

    /**
     * Reboot the bus, critical for tests, reboot destroys the singleton and re-creates it.
     * @returns {EventBus} the newly rebooted event bus.
     */
    public static reboot(): EventBus {
        //EventBus.id = EventBus.rebuildId(); // reset the ID attached to the abstract class.
        //this.instance = null;
        //delete this.instance;
        return (this.instance = new this());
    }

    private internalChannelMap: Map<string, Channel>;
    private log: Logger;
    private windowRef: any = window;
    private messageProxy: MessageProxy;
    private proxyControl: ProxyControl;
    private devModeEnabled = false;

    // low level API
    readonly api: EventBusLowApi;
    readonly stores: BusStoreApi;
    readonly fabric: FabricApi;
    readonly brokerConnector: BrokerConnector;

    private constructor(logLevel: LogLevel = LogLevel.Off, disableBootMessage: boolean = true,
                        darkTheme: boolean = false) {
        super();

        this.internalChannelMap = new Map<string, Channel>();

        // logging
        this.log = new Logger();

        // enable dark theme on logging.
        if (darkTheme) {
            this.log.useDarkTheme(true);
        }

        // Low Level API.
        this.api = new EventBusLowLevelApiImpl(this, this.internalChannelMap, this.log);

        // Store API
        this.stores = new StoreManager(this);

        this.brokerConnector = new BrokerConnector(this.log);

        // wire up singleton to the window object under a custom namespace.
        this.windowRef.AppEventBus = this;
        this.windowRef.AppBrokerConnector = this.brokerConnector;
        this.windowRef.AppBrokerConnector.init(this);
        this.windowRef.window.AppSyslog = this.log;
        this.windowRef.AppStoreManager = this.stores;

        if (!disableBootMessage) {
            this.log.setStylingVisble(true);
            this.log.info(`🌈 Bifröst v${EventBus.version} Initialized with Id: ${EventBus.id}, Hi!`,
                'EventBus');

        }

        // set up logging.
        this.log.logLevel = logLevel;
        this.api.setLogLevel(logLevel);

        this.fabric = new FabricApiImpl(this);

        // say hi to magnum.
        // this.easterEgg();
    }

    public get logger(): Logger {
        return this.log;
    }

    public getName() {
        return 'EventBus';
    }

    public enableDevMode(): void {
        this.devModeEnabled = true;
        this.log.warn('Dev Mode Enabled on Event Bus, This should never be enabled in production');
    }

    public enableMessageProxy(config: MessageProxyConfig): ProxyControl {

        this.messageProxy = new MessageProxy(this);
        this.proxyControl = this.messageProxy.enableProxy(config);
        return this.proxyControl;

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
        useSSL?: boolean,
        autoReconnect: boolean = true,
        advancedConfig?: BridgeConnectionAdvancedConfig): MessageHandler<StompBusCommand> {

        const config: StompConfig = StompConfig.generate(
            endpoint,
            host,
            port,
            useSSL,
            user,
            pass,
            applicationDestinationPrefix,
        );
        config.topicLocation = topicLocation;
        config.queueLocation = queueLocation;
        config.brokerConnectCount = numBrokerRelays;
        config.autoReconnect = autoReconnect;

        if (advancedConfig) {
            config.heartbeatIn = advancedConfig.heartbeatIncomingInterval;
            config.heartbeatOut = advancedConfig.heartbeatOutgoingInterval;
            config.startIntervalFunction = advancedConfig.startIntervalFunction;
        }

        // create fake socket instead of a real socket, should never be used in production.
        if (this.devModeEnabled) {
            config.testMode = true;
        }

        const handler: MessageHandler<StompBusCommand> = this.requestStreamWithId(
            `${config.host}:${config.port}${config.endpoint}`,
            BrokerConnectorChannel.connection,
            StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, '', '', config),
        );
        handler.handle(
            (command: StompBusCommand) => {
                if (command.command === StompClient.STOMP_CONNECTED) {
                    readyHandler(command.session);
                    handler.close();
                } else {
                    this.api.logger()
                        .info('connection handler received command message: ' + command.command, this.getName());
                }
            }
        );
        return handler;
    }

    public listenGalacticStream<T>(cname: ChannelName, name: SentFrom = this.getName(),
                                   galacticConfig?: ChannelBrokerMapping): MessageHandler<T> {
        if (!this.internalChannelMap.has(cname)) {
            this.api.getGalacticChannel(
                cname, galacticConfig, name, false); // create a public galactic channel by default;
        }
        return this.listenStream(cname, name);
    }

    public isGalacticChannel(cname: ChannelName): boolean {
        if (this.internalChannelMap.has(cname)) {
            return this.internalChannelMap.get(cname).galactic;
        }
        return false;
    }

    public closeGalacticChannel(cname: ChannelName, from?: SentFrom, brokerIdentity?: ChannelBrokerMapping): void {
        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(
                    MonitorType.MonitorGalacticUnsubscribe,
                    cname,
                    from,
                    brokerIdentity)
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
        from?: string,
        proxyBroadcast: boolean = false): void {

        this.api.send(cname, new Message(id, 1, proxyBroadcast).request(payload), from);
    }

    public sendRequestMessageWithIdAndVersion<R>(
        cname: string,
        payload: R,
        id: UUID,
        version: number,
        from?: string,
        proxyBroadcast: boolean = false): void {
        this.api.send(
            cname,
            new Message(id, version, proxyBroadcast).request(payload),
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
        from?: string,
        proxyBroadcast: boolean = false): void {
        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname,
                    new Message(id, 1, proxyBroadcast).response(payload),
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
        from?: string,
        proxyBroadcast: boolean = false): void {
        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname,
                    new Message(id, version, proxyBroadcast).response(payload),
                    from
                );
            }
        );
    }

    sendErrorMessageWithId<E>(
        cname: ChannelName,
        payload: E,
        id: UUID,
        from?: SentFrom,
        proxyBroadcast?: boolean): void {
        this.api.send(
            cname,
            new Message(id, 1, proxyBroadcast).error(payload),
            from
        );

    }

    sendErrorMessageWithIdAndVersion<E>(
        cname: ChannelName,
        payload: E,
        id: UUID,
        version: number,
        from?: SentFrom,
        proxyBroadcast?: boolean): void {

        this.api.send(
            cname,
            new Message(id, version, proxyBroadcast).error(payload),
            from
        );
    }


    public sendErrorMessage(
        cname: ChannelName,
        payload: any,
        name = this.getName(),
        proxyBroadcast: boolean = false): void {

        this.api.send(cname, new Message(GeneralUtil.genUUID(), 1, proxyBroadcast).error(payload), name);
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

    public createTransaction(type: TransactionType = TransactionType.ASYNC,
                             name: string = 'Transaction' + GeneralUtil.genUUID()): BusTransaction {
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

    public markChannelsAsGalactic(channelNames: Iterable<ChannelName>): void {
        for (const channelName of channelNames) {
            this.markChannelAsGalactic(channelName);
        }
    }

    public markChannelAsGalactic(channelName: ChannelName, brokerIdentity?: string, isPrivate?: boolean): void {
        const channel = this.api.getChannelObject(channelName);
        channel.setGalactic();
        if (isPrivate === true) {
            channel.setPrivate();
        } else {
            channel.setPublic();
        }

        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(
                    MonitorType.MonitorNewGalacticChannel,
                    channelName,
                    this.getName(),
                    {isPrivate: channel.isPrivate, brokerIdentity: brokerIdentity} as ChannelBrokerMapping)
            )
        );
    }

    public markChannelsAsLocal(channelNames: Iterable<ChannelName>): void {
        for (const channelName of channelNames) {
            this.markChannelAsLocal(channelName);
        }
    }

    public markChannelAsLocal(channelName: ChannelName, brokerIdentity?: string) {
        const channel = this.api.getChannelObject(channelName);
        channel.setLocal();

        this.api.getMonitorStream().send(
            new Message().request(
                new MonitorObject().build(
                    MonitorType.MonitorGalacticUnsubscribe,
                    channelName,
                    this.getName(),
                    {isPrivate: channel.isPrivate, brokerIdentity} as ChannelBrokerMapping)
            )
        );
    }
}
