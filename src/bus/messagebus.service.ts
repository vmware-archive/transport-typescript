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
import { StoreImpl } from './store/store';
import { BusStore, BusStoreApi } from './store.api';
import { StoreType, UUID } from './store/store.model';
import { StompBusCommand, StompChannel, StompConfig } from '../bridge/stomp.model';
import { StompClient } from '../bridge/stomp.client';
import { StompParser } from '../bridge/stomp.parser';
import { ChannelName, EventBus, EventBusLowApi, SentFrom, TransactionType, BusTransaction } from './bus.api';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/merge';
import { EventBusLowLevelApiImpl } from './bus.lowlevel';
import { LoggerService } from '../log/logger.service';
import { LogLevel } from '../log/logger.model';
import { GalacticRequest } from './model/request.model';
import { GalacticResponse } from './model/response.model';
import { Observable } from 'rxjs/Observable';
import { StoreManager } from './store/store.manager';
import { BusTransactionImpl } from './transaction';

export abstract class MessageBusEnabled {
    abstract getName(): string;
}

export class MessagebusService extends EventBus implements MessageBusEnabled {

    private internalChannelMap: Map<string, Channel>;
    private log: LoggerService;


    // low level API
    readonly api: EventBusLowApi;
    readonly stores: BusStoreApi;

    constructor(logLevel: LogLevel = LogLevel.Info, disableBootMessage: boolean = false) {
        super();
        this.internalChannelMap = new Map<string, Channel>();

        // logging
        this.log = new LoggerService();

        // Low Level API.
        this.api = new EventBusLowLevelApiImpl(this, this.internalChannelMap, this.log);

        // Store API
        this.stores = new StoreManager(this, this.log);
        
        // wire up singleton to the window object under a custom namespace.
        window.AppEventBus = this as EventBus;
        window.AppBrokerConnector = new StompService();
        window.AppBrokerConnector.init(this);
        window.AppSyslog = Syslog;
        
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
            StompChannel.connection,
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
        name = this.getName(), 
        schema = new MessageSchema()): void {

        this.api.send(cname, new Message().request(payload, schema), name);
    }

    public sendRequestMessageWithId<R>(
        cname: string, 
        payload: R, 
        id: UUID, 
        from?: string, 
        schema?: MessageSchema): void {
       
            this.api.send(cname, new Message(null, id).request(payload, schema), name);
    }

    public sendRequestMessageWithIdAndVersion<R>(
        cname: string, 
        payload: R, 
        id: UUID, 
        version: number, 
        from?: string, 
        schema?: MessageSchema): void {
            this.api.send(
                cname, 
                new Message(null, id, version).request(payload, schema), 
                name
            );
    }


    public sendResponseMessage(
        cname: ChannelName, 
        payload: any,
        name = this.getName(), 
        schema = new MessageSchema()): boolean {

        this.api.tickEventLoop(
            () => {
                this.api.send(
                    cname, 
                    new Message().response(payload, schema), 
                    name
                );
            }
        );
        return true;
    }

    sendResponseMessageWithId<R>(
        cname: string, 
        payload: R, 
        id: UUID, 
        from?: string, 
        schema?: MessageSchema): void {
            this.api.tickEventLoop(
                () => {
                    this.api.send(
                        cname, 
                        new Message(null, id).response(payload, schema), 
                        name
                    );
                }
            );
    }
   
    sendResponseMessageWithIdAndVersion<R>(
        cname: string,
        payload: R, 
        id: UUID,
        version: number, 
        from?: string, 
        schema?: MessageSchema): void {
            this.api.tickEventLoop(
                () => {
                    this.api.send(
                        cname, 
                        new Message(null, id, version).response(payload, schema), 
                        name
                    );
                }
            );
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
        }

        const conversationId: UUID = request.id;

        const stream: Observable<Message> = this.api.getGalacticChannel(channel)
        .filter((message: Message) => {
            return (message.isResponse());
        }).filter((message: Message) => {
            const resp: GalacticResponse<R> = message.payload as GalacticResponse<R>;
            return conversationId === resp.id;
        });

        const sub = stream.subscribe(
            (msg: Message) => {
                const resp: GalacticResponse<R> = msg.payload;
                if (resp.error) {
                    errorHandler(resp);
                } else {
                    successHandler(resp);
                }
                sub.unsubscribe();
                this.closeGalacticChannel(channel);
            }
        );

        this.sendGalacticMessage(channel, request);

    }

    public createTransaction(type: TransactionType = TransactionType.ASYNC, 
                             name: string = 'Transaction' + StompParser.genUUIDShort()): BusTransaction {
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
