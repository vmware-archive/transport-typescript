import { StompClient } from './stomp.client';
import { Observable,  Subscription } from 'rxjs';
import {
    StompSession, StompChannel, StompBusCommand, StompSubscription, StompMessage,
    StompConfig
} from '../bridge/stomp.model';
import { StompParser } from '../bridge/stomp.parser';
import { StompValidator } from './stomp.validator';
import { MonitorChannel, MonitorObject, MonitorType } from '../bus/model/monitor.model';
import { Message } from '../bus/model/message.model';
import { BifrostEventBus, BifrostEventBusEnabled } from '../bus/bus';
import { EventBus } from '../bus.api';
import { LoggerService } from '../log';

/**
 * Service is responsible for handling all STOMP communications over a socket.
 */

export class BrokerConnector implements BifrostEventBusEnabled {

    static serviceName: string = 'stomp.service';
    public reconnectDelay: number = 5000;
    public connectDelay: number = 20;
    public connecting: boolean = false;

    // helper methods for boilerplate commands.
    static fireSubscriptionCommand(bus: EventBus,
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
        bus.api.send(StompChannel.subscription,
            new Message().request(command), BrokerConnector.serviceName);

    }

    // helper function for subscriptions.
    static fireSubscribeCommand(bus: EventBus,
                                sessionId: string,
                                destination: string,
                                subscriptionId: string): void {

        BrokerConnector.fireSubscriptionCommand(bus,
            sessionId,
            destination,
            subscriptionId,
            StompClient.STOMP_SUBSCRIBE);
    }

    // helper function for unsubscriptions.
    static fireUnSubscribeCommand(bus: EventBus,
                                  sessionId: string,
                                  destination: string,
                                  subscriptionId: string): void {

        BrokerConnector.fireSubscriptionCommand(bus,
            sessionId,
            destination,
            subscriptionId,
            StompClient.STOMP_UNSUBSCRIBE);
    }

    // helper function for connecting
    static fireConnectCommand(bus: EventBus, config: StompConfig = null): void {

        let command = StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, null, null, config);
        bus.api.send(StompChannel.connection,
            new Message().request(command), BrokerConnector.serviceName);
    }

    // helper function for disconnecting
    static fireDisconnectCommand(bus: EventBus, sessionId: string): void {

        let command = StompParser.generateStompBusCommand(StompClient.STOMP_DISCONNECT, sessionId);
        bus.api.send(StompChannel.connection,
            new Message().request(command), BrokerConnector.serviceName);
    }

    constructor(private log: LoggerService) {

    }

    getName(): string {
        return (this as any).constructor.name;
    }

    private _errorObservable: Observable<Error>;
    private _closeObservable: Observable<CloseEvent>;
    private _sessions: Map<string, StompSession>;
    private _galaticChannels: Map<string, boolean>;
    private bus: BifrostEventBus;
    private reconnectTimerInstance: any;
    private reconnecting: boolean = false;

    setBus(bus: BifrostEventBus) {
        this.bus = bus;
    }

    init(bus: BifrostEventBus) {

        this.setBus(bus);

        let connectionChannel =
            this.bus.api.getRequestChannel(StompChannel.connection, this.getName());

        let subscriptionChannel =
            this.bus.api.getRequestChannel(StompChannel.subscription, this.getName());

        let monitorChannel =
            this.bus.api.getRequestChannel(MonitorChannel.stream, this.getName());

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

        monitorChannel.subscribe(
            (msg: Message) => {
                this.processMonitorStreamMessage(msg);
            }
        );

        this._sessions = new Map<string, StompSession>();
        this._galaticChannels = new Map<string, boolean>();

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
            case MonitorType.MonitorNewGalacticChannel:
                this.openGalacticChannel(mo.channel);
                break;

            case MonitorType.MonitorGalacticData:
                this.sendGalacticMessage(mo.channel, mo.data);
                break;

            case MonitorType.MonitorCompleteChannel:
            case MonitorType.MonitorGalacticUnsubscribe:
                if (this._galaticChannels.get(mo.channel)) {
                    this.closeGalacticChannel(mo.channel);
                }
                break;
            default:
                break;
        }
    }

    private sendGalacticMessage(channel: string, payload: any): void {

        let cleanedChannel = StompParser.convertChannelToSubscription(channel);

        this._sessions.forEach(session => {
            const config = session.config;
            if (session.applicationDestinationPrefix) {
                cleanedChannel = session.applicationDestinationPrefix + '/' + cleanedChannel;
            }

            if (config.useTopics) {
                const destination = cleanedChannel;
                const command: StompBusCommand = StompParser.generateStompBusCommand(
                    StompClient.STOMP_MESSAGE,
                    session.id,
                    destination,
                    StompParser.generateStompReadyMessage(payload)
                );
                this.log.debug('Sending Galactic Message for session ' + session.id +
                    ' to destination ' + destination, this.getName());
                this.sendPacket(command);
            } else {
                this.log.warn('Cannot send galactic message, topics not enabled for ' +
                      'broker, queues not implemented yet.', this.getName());
            }
        });
    }

    private generateSubscriptionId(sessionId: string, channel: string): string {
        return sessionId + '-' + channel;
    }

    private openGalacticChannel(channel: string) {
        let cleanedChannel = StompParser.convertChannelToSubscription(channel);
        this._galaticChannels.set(channel, true);

        // if we're connected, kick things off
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
                } else {
                    this.log.warn('Unable to open galactic channel, topics not ' +
                        'configured and queues not supported yet.', this.getName());
                }
            });
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
                } else {
                    this.log.warn('Unable to close galactic channel, topics not ' +
                        'configured and queues not supported yet.', this.getName());
                }

            });

            this._galaticChannels.delete(cleanedChannel);
        } else {
            this.log.warn('unable to close galactic channel, no open sessions.', 'BrokerConnector');
        }
    }

    private processSubscriptionMessage(msg: Message): void {
        if (!StompValidator.validateSubscriptionMessage(msg)) {
            this.log.warn('unable to validate inbound subscription message, invalid', 'BrokerConnector');
            return;
        }

        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
        let sub: StompSubscription = busCommand.payload as StompSubscription;

        // handle subscribe / un-subscribe requests
        switch (busCommand.command) {
            case StompClient.STOMP_SUBSCRIBE:

                this.log.info('subscribing to destination: ' + sub.destination, this.getName());

                // create a subscription payload and throw it on the bus.
                this.subscribeToDestination(sub);
                break;

            case StompClient.STOMP_UNSUBSCRIBE:

                this.log.info('unsubscribing from destination: ' + sub.destination, this.getName());

                // create an unsubscription payload and throw it on the bus.
                this.unsubscribeFromDestination(sub);
                break;

            default:
                break;
        }
    }

    private processConnectionMessage(msg: Message): void {

        if (!StompValidator.validateConnectionMessage(msg)) {
            this.log.warn('unable to validate connection message, invalid command', this.getName());
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
                this.bus.api.tickEventLoop(
                    () => {
                        this.connectClient(config);
                    }, this.connectDelay
                );
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
            new Message().response(command);
        if (error) {
            messageType =
                new Message().error(command);
        }
        this.bus.api.send(
            channel,
            messageType,
            this.getName()
        );

        if (echoStatus) {
            this.bus.api.send(
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
        let session = new StompSession(config, this.log);

        let connection = session.connect();
        this.connecting = true;

        config.connectionSubjectRef = connection;

        connection.subscribe(
            () => {
                clearInterval(this.reconnectTimerInstance);
                this.reconnecting = false;
                this.connecting = false;

                session.connectionCount++;

                if (session.connectionCount < session.config.brokerConnectCount) {
                    this.log.info('Connection message ' +
                        session.connectionCount + ' of ' + config.brokerConnectCount + ' received', this.getName());
                }

                // this checks to see if the number of brokers configured send by the bus connectBroker() method
                // has been hit yet for this session. The broker connect count is equivalent to how many CONNECTED
                // events will be sent down the socket.
                if (session.config.brokerConnectCount === session.connectionCount) {

                    // Making sure any duplicate runs (just in case things go mad), only run once per session.
                    if (!session.connected) {

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

                        // subscribe to all open channels
                        this._galaticChannels.forEach((open, channel) => this.openGalacticChannel(channel));

                        session.connected = true;
                    }
                } else if (session.config.brokerConnectCount > session.connectionCount) {
                    // more connected messages than expected, ignore, but tell the bus duplicates came in beyond
                    // what we were expecting.
                    let message: StompBusCommand =
                        StompParser.generateStompBusCommand(
                            StompClient.STOMP_CONNECTED_DUPLICATE, // Spring broker sends double CONNECT on
                            session.id                              // each broker requires a session.
                        );

                    this.sendBusCommandResponseRaw(message, StompChannel.connection, true);
                }

            }
        );
    }

    public disconnectClient(sessionId: string): void {

        let session = this._sessions.get(sessionId);
        if (session && session !== null) {
            session.disconnect();
            this._sessions.delete(sessionId);
        } else {
            this.log.warn('unable to disconnect client, no active session with id: ' +
                sessionId, 'BrokerConnector');
        }
    }

    public sendPacket(data: StompBusCommand): void {
        let session = this._sessions.get(data.session);
        if (session && session !== null) {
            let message: StompMessage = data.payload as StompMessage;

            // wire in the local broker session id.
            if (!message.headers['session']) {
                this.log.debug('sendPacket(): adding local broker session ID to message: '
                    + data.session, this.getName());

                message.headers.session = data.session;
            } else {
                this.log.debug('sendPacket(): message headers already contain sessionId', this.getName());
            }
            session.send(data.destination, message.headers, message.body);
        } else {
            this.log.warn('unable to send packet, session is empty', this.getName());
        }
    }

    private reconnectTimer(config: StompConfig) {
        const connect = () => {
            this.log.warn('Trying to reconnect to broker....', this.getName());
            this.bus.api.tickEventLoop(
                () => {
                    if (!this.connecting) {
                        this.connectClient(config);
                    }
                }, this.connectDelay
            );
        };
        this.reconnectTimerInstance = setInterval(connect, this.reconnectDelay);
    }

    private subscribeToClientObservables(): void {

        this._closeObservable.subscribe(
            (evt: any) => {
                this.log.warn('WebSocket to broker closed!', this.getName());
                this.sessions.clear();

                if (!this.reconnecting) {
                    this.log.info('Starting re-connection timer', this.getName());
                    this.reconnecting = true;
                    this.reconnectTimer(evt.config);
                }
                this.sendBusCommandResponse(
                    StompClient.STOMP_DISCONNECTED,
                    StompChannel.connection, true);
            }
        );

        this._errorObservable.subscribe(
            (err: any) => {
                this.log.error('Error occurred with WebSocket, Unable to connect to broker!', this.getName());
                this._sessions.clear();
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

            const channel: string = StompParser.convertTopicToChannel(data.destination);

            const chan: Observable<Message> =
                this.bus.api.getRequestChannel(channel, this.getName());

            const sub: Subscription = chan.subscribe(
                (msg: Message) => {
                    const command: StompBusCommand = StompParser.generateStompBusCommand(
                        StompClient.STOMP_MESSAGE,
                        session.id,
                        data.destination,
                        StompParser.generateStompReadyMessage(msg.payload)
                    );
                    this.sendPacket(command);
                }
            );
            session.addGalacticSubscription(channel, sub);

            // let the bus know.
            this.sendBusCommandResponseRaw(message, StompChannel.subscription, true);

            let subjectSubscription = subscriptionSubject.subscribe(
                (msg: StompMessage) => {

                    let busResponse: StompBusCommand =
                        StompParser.generateStompBusCommand(
                            StompClient.STOMP_MESSAGE,
                            session.id,
                            data.destination,
                            StompParser.frame(
                                StompClient.STOMP_MESSAGE,
                                msg.headers,
                                msg.body
                            )
                        );

                    let respChan =
                        StompParser.convertSubscriptionToChannel(data.destination, session.config.topicLocation);

                    let payload = JSON.parse(msg.body);
                    this.bus.sendResponseMessage(respChan, payload);

                    // duplicate to stomp messages.
                    this.bus.api.send(StompChannel.messages,
                        new Message().response(busResponse),
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
            const channel: string = StompParser.convertTopicToChannel(data.destination);

            const sub: Subscription = session.getGalacticSubscription(channel);

            if (sub) {
                sub.unsubscribe();
                session.removeGalacticSubscription(channel);
                this.bus.api.close(channel, this.getName());
            } else {
                this.log.warn('unable to unsubscribe, no galactic subscription found for id: '
                    + data.session, this.getName());

                this.bus.api.close(channel, this.getName());
            }
        } else {
            this.log.warn('unable to unsubscribe, no session found for id: ' + data.session, this.getName());
        }
    }
}


