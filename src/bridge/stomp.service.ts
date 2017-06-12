import {Injectable} from '@angular/core';
import {StompClient} from './stomp.client';
import {Observable, ReplaySubject} from 'rxjs';
import {
    StompSession, StompChannel, StompBusCommand, StompSubscription, StompMessage,
    StompConfig
} from '../bridge/stomp.model';
import {StompCommandSchema, StompConfigSchema} from './stomp.schema';
import {StompParser} from '../bridge/stomp.parser';
import {StompValidator} from './stomp.validator';
import {Syslog} from '../log/syslog';
import {MonitorChannel, MonitorObject, MonitorType} from '../bus/monitor.model';
import {Message} from '../bus/message.model';
import {MessagebusService, MessageBusEnabled} from '../bus/messagebus.service';

// max length of a subscription ID before truncation
const SUBSCRIPTION_ID_LENGTH = 13;

/**
 * Service is responsible for handling all STOMP communications over a socket.
 */

@Injectable()
export class StompService implements MessageBusEnabled {

    static serviceName: string = 'stomp.service';

    // helper methods for boilerplate commands.
    static fireSubscriptionCommand(bus: MessagebusService,
                                   sessionId: string,
                                   destination: string,
                                   subscriptionId: string,
                                   subType: string): void {

        let subscription =
            StompParser.generateStompBrokerSubscriptionRequest(
                sessionId, destination, subscriptionId
            );

        let command =
            StompParser.generateStompBusCommand(
                subType,
                sessionId,
                destination,
                subscription
            );
        bus.send(StompChannel.subscription,
            new Message().request(command, new StompConfigSchema()), StompService.serviceName);

    }

    // helper function for subscriptions.
    static fireSubscribeCommand(bus: MessagebusService,
                                sessionId: string,
                                destination: string,
                                subscriptionId: string): void {

        StompService.fireSubscriptionCommand(bus,
            sessionId,
            destination,
            subscriptionId,
            StompClient.STOMP_SUBSCRIBE);
    }

    // helper function for unsubscriptions.
    static fireUnSubscribeCommand(bus: MessagebusService,
                                  sessionId: string,
                                  destination: string,
                                  subscriptionId: string): void {

        StompService.fireSubscriptionCommand(bus,
            sessionId,
            destination,
            subscriptionId,
            StompClient.STOMP_UNSUBSCRIBE);
    }

    // helper function for connecting
    static fireConnectCommand(bus: MessagebusService, config: StompConfig = null): void {

        let command = StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, null, null, config);
        bus.send(StompChannel.connection,
            new Message().request(command, new StompConfigSchema()), StompService.serviceName);
    }

    // helper function for disconnecting
    static fireDisconnectCommand(bus: MessagebusService, sessionId: string): void {

        let command = StompParser.generateStompBusCommand(StompClient.STOMP_DISCONNECT, sessionId);
        bus.send(StompChannel.connection,
            new Message().request(command, new StompConfigSchema()), StompService.serviceName);
    }


    getName(): string {
        return (this as any).constructor.name;
    }

    private _errorObservable: Observable<Error>;
    private _closeObservable: Observable<CloseEvent>;
    private _sessions: Map<string, StompSession>;
    private _galaticChannels: Map<string, boolean>;
    private _galacticRequests: ReplaySubject<string>;
    private bus: MessagebusService;

    setBus(bus: MessagebusService) {
        this.bus = bus;
    }

    init(bus: MessagebusService) {

        this.setBus(bus);

        let connectionChannel =
            this.bus.getRequestChannel(StompChannel.connection, this.getName());

        let subscriptionChannel =
            this.bus.getRequestChannel(StompChannel.subscription, this.getName());

        let inboundChannel =
            this.bus.getRequestChannel(StompChannel.messages, this.getName());

        let monitorChannel =
            this.bus.getRequestChannel(MonitorChannel.stream, this.getName());

        connectionChannel.subscribe(
            (msg: Message) => {
                this.processConnectionMessage(msg);
            }
        );

        subscriptionChannel.subscribe(
            (msg: Message) => {
                this.processSubscriptionMessage(msg);
            }
        );

        inboundChannel.subscribe(
            (msg: Message) => {
                this.processInboundMessage(msg);
            }
        );

        monitorChannel.subscribe(
            (msg: Message) => {
                this.processMonitorStreamMessage(msg);
            }
        );

        this._sessions = new Map<string, StompSession>();
        this._galaticChannels = new Map<string, boolean>();
        this._galacticRequests = new ReplaySubject<string>();
    }

    get galacticChannels(): Map<string, boolean> {
        return this._galaticChannels;
    }

    public getSession(id: string): StompSession {
        return this._sessions.get(id);
    }

    get sessions(): Map<string, StompSession> {
        return this._sessions;
    }

    private processMonitorStreamMessage(msg: Message): void {
        if (!StompValidator.validateMonitorMessage(msg)) {
            this.sendBusCommandResponse(StompClient.STOMP_INVALIDMONITOR);
            return;
        }
        let mo = msg.payload as MonitorObject;
        switch (mo.type) {
            case MonitorType.MonitorNewChannel:
                if (this.bus.isGalacticChannel(mo.channel)) {
                    this.openGalacticChannel(mo.channel);
                }
                break;

            case MonitorType.MonitorCompleteChannel:
            case MonitorType.MonitorCloseChannel:
                if (this._galaticChannels.get(mo.channel)) {
                    this.closeGalacticChannel(mo.channel);
                }
                break;
            default:
                break;
        }
    }

    private generateSubscriptionId(sessionId: string, channel: string): string {
        return sessionId + '-' + channel;
    }

    private openGalacticChannel(channel: string) {

        let cleanedChannel = StompParser.convertChannelToSubscription(channel);
        this._galaticChannels.set(channel, true);

        // if we're connected, kick things off, if not then fill the requests stream up
        // and consume once we are connected.
        if (this._sessions.size >= 1) {

            this._sessions.forEach(session => {
                let config = session.config;
                let subscriptionId = this.generateSubscriptionId(session.id, cleanedChannel);

                if (config.useTopics) {
                    let destination =
                        StompParser.generateGalacticTopicDesintation(config.topicLocation, cleanedChannel);

                    let subscription =
                        StompParser.generateStompBrokerSubscriptionRequest(
                            session.id, destination, subscriptionId
                        );
                    this.subscribeToDestination(subscription);
                }
            });

        } else {
            // stream will be subscribed to on connection.
            this._galacticRequests.next(channel);
        }
    }

    private closeGalacticChannel(channel: string) {

        let cleanedChannel = StompParser.convertChannelToSubscription(channel);
        if (this._sessions.size >= 1) {

            this._sessions.forEach(session => {
                let config = session.config;
                let subscriptionId = this.generateSubscriptionId(session.id, cleanedChannel);

                if (config.useTopics) {
                    let destination =
                        StompParser.generateGalacticTopicDesintation(config.topicLocation, cleanedChannel);

                    let subscription =
                        StompParser.generateStompBrokerSubscriptionRequest(
                            session.id, destination, subscriptionId
                        );
                    this.unsubscribeFromDestination(subscription);
                }
            });

            this._galaticChannels.delete(cleanedChannel);
        }
    }

    private processInboundMessage(msg: Message): void {

        if (!StompValidator.validateInboundMessage(msg)) {
            return;
        }
        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);

        this.sendPacket(busCommand);
    }

    private processSubscriptionMessage(msg: Message): void {

        if (!StompValidator.validateSubscriptionMessage(msg)) {
            return;
        }

        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
        let sub: StompSubscription = busCommand.payload as StompSubscription;

        // handle subscribe / un-subscribe requests
        switch (busCommand.command) {
            case StompClient.STOMP_SUBSCRIBE:

                Syslog.debug('subscribing to destination: ' + sub.destination, this.getName());

                // create a subscription payload and throw it on the bus.
                this.subscribeToDestination(sub);
                break;

            case StompClient.STOMP_UNSUBSCRIBE:

                Syslog.debug('unsubscribing from destination: ' + sub.destination, this.getName());

                // create an unsubscription payload and throw it on the bus.
                this.unsubscribeFromDestination(sub);
                break;

            default:
                break;
        }
    }

    private processConnectionMessage(msg: Message): void {

        if (!StompValidator.validateConnectionMessage(msg)) {
            return;
        }

        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);

        // handle connect, disconnect requests

        switch (busCommand.command) {

            case StompClient.STOMP_CONNECT:
                let config: StompConfig = busCommand.payload as StompConfig;

                // let everyone know the configuration is good.
                this.sendBusCommandResponse(StompClient.STOMP_CONFIGURED);

                // connect, or re-use existing socket.
                this.connectClient(config);
                break;

            case StompClient.STOMP_DISCONNECT:
                // let everyone know we're disconnecting
                this.sendBusCommandResponse(StompClient.STOMP_DISCONNECTING);

                // disconnect
                this.disconnectClient(busCommand.session);
                break;

            default:
                break;
        }
    }

    private sendBusCommandResponseRaw(command: StompBusCommand,
                                      channel: string = StompChannel.status,
                                      echoStatus: boolean = false,
                                      error: boolean = false): void {

        let messageType: Message =
            new Message().response(command, new StompCommandSchema());
        if (error) {
            messageType =
                new Message().error(command, new StompCommandSchema());
        }
        this.bus.send(
            channel,
            messageType,
            this.getName()
        );

        if (echoStatus) {
            this.bus.send(
                StompChannel.status,
                messageType,
                this.getName()
            );
        }
    }

    private sendBusCommandResponse(status: string,
                                   channel: string = StompChannel.status,
                                   echoStatus: boolean = false): void {
        let msg: StompBusCommand = StompParser.generateStompBusCommand(status);
        this.sendBusCommandResponseRaw(msg, channel, echoStatus);
    }

    public connectClient(config: StompConfig): void {

        let session = new StompSession(config);

        let connection = session.connect();

        connection.subscribe(
            () => {

                let message: StompBusCommand =
                    StompParser.generateStompBusCommand(
                        StompClient.STOMP_CONNECTED,    // not a command, but used for local notifications.
                        session.id                      // each broker requires a session.
                    );

                this.sendBusCommandResponseRaw(message, StompChannel.connection, true);

                // these are now available;
                this._errorObservable = session.client.socketErrorObserver;
                this._closeObservable = session.client.socketCloseObserver;

                // add session to map
                this._sessions.set(session.id, session);
                this.subscribeToClientObservables();

                // if we have pending galactic channels waiting, lets open the replay
                // and subscribe to those destinations
                this._galacticRequests.subscribe(
                    (channel: string) => {
                        this.openGalacticChannel(channel);
                    }
                );
            }
        );
    }

    public disconnectClient(sessionId: string): void {

        let session = this._sessions.get(sessionId);
        if (session && session !== null) {
            session.disconnect();
            this._sessions.delete(sessionId);
        }
    }

    public sendPacket(data: StompBusCommand): void {
        let session = this._sessions.get(data.session);
        if (session && session !== null) {
            let message: StompMessage = data.payload as StompMessage;

            // wire in the local broker session id.
            if (!message.headers['session']) {
                message.headers.session = data.session;
            }
            session.send(data.destination, message.headers, message.body);
        }
    }

    private subscribeToClientObservables(): void {

        this._closeObservable.subscribe(
            () => {
                this.sendBusCommandResponse(
                    StompClient.STOMP_DISCONNECTED,
                    StompChannel.connection, true);
            }
        );

        this._errorObservable.subscribe(
            (err: any) => {
                let msg
                    = StompParser.generateStompBusCommand(
                    StompClient.STOMP_ERROR, '', '', err);

                this.sendBusCommandResponseRaw(msg, StompChannel.error, true, true);
            }
        );
    }

    public subscribeToDestination(data: StompSubscription): void {

        let session = this._sessions.get(data.session);
        if (session && session !== null) {

            // subscribe to broker destination
            let subscriptionSubject = session.subscribe(data.destination, data.id);

            let message: StompBusCommand =
                StompParser.generateStompBusCommand(
                    StompClient.STOMP_SUBSCRIBED,
                    session.id,
                    data.destination
                );

            // let the bus know.
            this.sendBusCommandResponseRaw(message, StompChannel.subscription, true);

            let subjectSubscription = subscriptionSubject.subscribe(
                (message: StompMessage) => {

                    let busResponse: StompBusCommand =
                        StompParser.generateStompBusCommand(
                            StompClient.STOMP_MESSAGE,
                            session.id,
                            data.destination,
                            StompParser.frame(
                                StompClient.STOMP_MESSAGE,
                                message.headers,
                                message.body
                            )
                        );

                    let channel =
                        StompParser.convertSubscriptionToChannel(data.destination, session.config.topicLocation);

                    // send to galactic channel on bus.
                    this.bus.send(channel,
                        new Message().response(busResponse, new StompCommandSchema()),
                        this.getName()
                    );

                    // duplicate to stomp messages.
                    this.bus.send(StompChannel.messages,
                        new Message().response(busResponse, new StompCommandSchema()),
                        this.getName()
                    );
                }
            );

            this._closeObservable.subscribe(
                () => {
                    subjectSubscription.unsubscribe();
                }
            );

        } else {
            let msg
                = StompParser.generateStompBusCommand(
                StompClient.STOMP_ERROR, '', '', 'cannot subscribe, session does not exist.');

            this.sendBusCommandResponseRaw(msg, StompChannel.error, true, true);
        }
    }

    public unsubscribeFromDestination(data: StompSubscription): void {
        let session = this._sessions.get(data.session);
        if (session && session !== null) {
            session.unsubscribe(data.id);

            let message: StompBusCommand =
                StompParser.generateStompBusCommand(
                    StompClient.STOMP_UNSUBSCRIBED,
                    session.id,
                    data.destination
                );

            // let the bus know.
            this.sendBusCommandResponseRaw(message, StompChannel.subscription, true);
        }
    }
}


