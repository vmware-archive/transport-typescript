import {TestBed, inject} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {StompService} from './stomp.service';
import {StompChannel, StompBusCommand, StompConfig, StompSession} from './stomp.model';
import {StompConfigSchema, StompCommandSchema} from './stomp.schema';
import {StompParser} from './stomp.parser';
import {StompClient} from './stomp.client';
import {MonitorChannel, MonitorObject, MonitorType} from '../bus/monitor.model';
import {Message} from '../bus/message.model';
import {MessagebusService} from '../bus/messagebus.service';
import {Syslog} from '../log/syslog';
import 'rxjs/add/operator/take';
import createSpy = jasmine.createSpy;

/**
 * Main StompService tests.
 */
export function main() {

    describe('StompService [stomp.service]', () => {

        let bus: MessagebusService;
        let ss: StompService;
        let config: StompConfig;
        let subId: string;

        let topicA: string = '/topic/testA';

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    StompService,
                    MessagebusService,
                    Map
                ]
            });
        });

        beforeEach(inject([Injector], (injector: Injector) => {
            bus = injector.get(MessagebusService);
            ss = injector.get(StompService);
            config = createStandardConfig();
            subId = StompParser.genUUID();
            ss.init(bus);

            bus.logger().silent(true);
            Syslog.silent(false);
            //Syslog.setLogLevel(LogLevel.Debug);

        }));

        describe('Service configuration and basic connect/disconnect', () => {

            it('We should be able to set the configuration',
                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONFIGURED:
                                    expect(true).toBeTruthy();
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should be able to determine that we\'re connected',
                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    expect(true).toBeTruthy();
                                    done();
                                    break;
                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should be able to determine that we\'re disconnected',
                (done) => {
                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    StompService.fireDisconnectCommand(bus, command.session);
                                    break;

                                case StompClient.STOMP_DISCONNECTED:
                                    expect(true).toBeTruthy();
                                    done();
                                    break;
                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );
        });

        describe('Subscribing, messaging and un-subscribing', () => {

            it('We should be able to subscribe to a broker destination',
                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    StompService.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );

                                    break;

                                case StompClient.STOMP_SUBSCRIBED:
                                    expect(command.destination).toEqual(topicA);
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should be able to subscribe to a broker destination and send/receive messages',

                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let inboundMessageChannel = bus.getResponseChannel(StompChannel.messages, getName());
                    let outboundMessage = 'a lovely horse';

                    let mId: string = StompParser.genUUID();
                    let headers: Object = {id: mId, subscription: subId};

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    StompService.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );
                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    let message = StompParser.generateStompBusCommand(
                                        StompClient.STOMP_SEND,
                                        command.session,
                                        topicA,
                                        StompParser.generateStompReadyMessage(outboundMessage, headers)
                                    );

                                    bus.send(
                                        StompChannel.messages,
                                        new Message().request(message, new StompCommandSchema()),
                                        getName()
                                    );
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    inboundMessageChannel.subscribe(
                        (msg: Message) => {

                            let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
                            let stompMessage = StompParser.extractStompMessageFromBusMessage(msg);
                            expect(stompMessage.body).toEqual(outboundMessage);
                            expect(stompMessage.headers['session']).toEqual(busCommand.session);

                            done();
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should be able to unsubscribe to a broker destination',

                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let sessId: string;

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    sessId = command.session;
                                    StompService.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );

                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    expect(command.destination).toEqual(topicA);
                                    StompService.fireUnSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );
                                    break;

                                case StompClient.STOMP_UNSUBSCRIBED:
                                    expect(command.destination).toEqual(topicA);
                                    expect(command.session).toEqual(sessId);
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

        });

        describe('Service should only respond to properly formed/valid messages', () => {
            it('We should only respond to valid connection messages sent on the bus',
                (done) => {

                    spyOn(ss, 'connectClient')
                        .and
                        .callThrough();

                    // create a bad command message
                    let badCommand = StompParser.generateStompBusCommand('CARROT', '', '', config);
                    bus.send(StompChannel.connection,
                        new Message().request(badCommand, new StompConfigSchema()), getName());

                    expect(ss.connectClient).not.toHaveBeenCalled();

                    // create a bad bus message
                    bus.send(StompChannel.connection,
                        new Message().request('CAMELOT', new StompConfigSchema()), getName());

                    expect(ss.connectClient).not.toHaveBeenCalled();

                    // wrong command message
                    let wrongCommand =
                        StompParser.generateStompBusCommand(StompClient.STOMP_CONNECTED, '', '', config);

                    bus.send(StompChannel.connection,
                        new Message().request(wrongCommand, new StompConfigSchema()), getName());

                    expect(ss.connectClient).not.toHaveBeenCalled();

                    done();
                }
            );

            it('We should only respond to valid disconnection messages sent on the bus',
                (done) => {

                    spyOn(ss, 'disconnectClient')
                        .and
                        .callThrough();

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    // create a bad command message
                                    let badCommand = StompParser.generateStompBusCommand('DISCOMMAND', '', '', config);
                                    bus.send(StompChannel.connection,
                                        new Message().request(badCommand, new StompConfigSchema()), getName());

                                    expect(ss.disconnectClient).not.toHaveBeenCalled();

                                    // create a bad bus message
                                    bus.send(StompChannel.connection,
                                        new Message().request('DISCONACRT', new StompConfigSchema()), getName());

                                    expect(ss.disconnectClient).not.toHaveBeenCalled();

                                    // wrong command message
                                    let wrongCommand =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_DISCONNECTING,
                                            '',
                                            '',
                                            config
                                        );

                                    bus.send(StompChannel.connection,
                                        new Message().request(wrongCommand, new StompConfigSchema()), getName());

                                    expect(ss.disconnectClient).not.toHaveBeenCalled();
                                    done();

                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });
                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should only respond to valid subscription messages sent on the bus',
                (done) => {

                    spyOn(ss, 'subscribeToDestination')
                        .and
                        .callThrough();

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    let missingProperties =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_SUBSCRIBE,
                                            null,
                                            null,
                                            StompParser.generateStompBrokerSubscriptionRequest(
                                                '123', null, null
                                            )
                                        );

                                    bus.send(StompChannel.subscription,
                                        new Message().request(missingProperties,
                                            new StompConfigSchema()), getName());

                                    expect(ss.subscribeToDestination).not.toHaveBeenCalled();

                                    // create a bad bus message
                                    bus.send(StompChannel.connection,
                                        new Message().request(StompClient.STOMP_SUBSCRIBE,
                                            new StompConfigSchema()), getName());

                                    expect(ss.subscribeToDestination).not.toHaveBeenCalled();

                                    let wrongCommand =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_SUBSCRIBED,
                                            '123',
                                            '234',
                                            StompParser.generateStompBrokerSubscriptionRequest(
                                                '123', 'abc', '456'
                                            )
                                        );

                                    // send wrong command
                                    bus.send(StompChannel.subscription,
                                        new Message().request(wrongCommand, new StompConfigSchema()), getName());

                                    expect(ss.subscribeToDestination).not.toHaveBeenCalled();

                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });
                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should only respond to valid unsubscription messages sent on the bus',
                (done) => {

                    spyOn(ss, 'unsubscribeFromDestination')
                        .and
                        .callThrough();

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let sessId: string;

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    sessId = command.session;
                                    StompService.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );

                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    expect(command.destination).toEqual(topicA);

                                    // create a bad bus message
                                    bus.send(StompChannel.connection,
                                        new Message().request(StompClient.STOMP_UNSUBSCRIBE,
                                            new StompConfigSchema()), getName());

                                    expect(ss.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    let wrongCommand =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_UNSUBSCRIBED,
                                            '123',
                                            '234',
                                            StompParser.generateStompBrokerSubscriptionRequest(
                                                '123', 'abc', '456'
                                            )
                                        );


                                    // send wrong command
                                    bus.send(StompChannel.subscription,
                                        new Message().request(wrongCommand, new StompConfigSchema()), getName());

                                    expect(ss.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    let missingPayload =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_UNSUBSCRIBE,
                                            null,
                                            null,
                                            null
                                        );

                                    // send missing payload and distribution
                                    bus.send(StompChannel.subscription,
                                        new Message().request(missingPayload, new StompConfigSchema()), getName());

                                    expect(ss.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();

                            }
                        });
                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('We should only respond to valid outbound messages sent on the bus',
                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let outboundMessageChannel = bus.getRequestChannel(StompChannel.messages, getName()).take(3);
                    let outboundMessage = 'anyone fancy a pint?';

                    let mId: string = StompParser.genUUID();
                    let headers: Object = {id: mId, subscription: subId};

                    spyOn(ss, 'sendPacket')
                        .and
                        .callThrough();

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    StompService.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId
                                    );
                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    let message = StompParser.generateStompBusCommand(
                                        StompClient.STOMP_SEND,
                                        '',
                                        '',
                                        null
                                    );

                                    // missing message payload
                                    bus.send(
                                        StompChannel.messages,
                                        new Message().request(message, new StompCommandSchema()),
                                        getName()
                                    );

                                    message = StompParser.generateStompBusCommand(
                                        StompClient.STOMP_MESSAGE,
                                        command.session,
                                        topicA,
                                        StompParser.generateStompReadyMessage(outboundMessage, headers)
                                    );

                                    // valid message, wrong command
                                    bus.send(
                                        StompChannel.messages,
                                        new Message().request(message, new StompCommandSchema()),
                                        getName()
                                    );

                                    message = StompParser.generateStompBusCommand(
                                        StompClient.STOMP_SEND,
                                        command.session,
                                        null,
                                        StompParser.generateStompReadyMessage(outboundMessage, headers)
                                    );

                                    // valid message, missing destination
                                    bus.send(
                                        StompChannel.messages,
                                        new Message().request(message, new StompCommandSchema()),
                                        getName()
                                    );
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    outboundMessageChannel.subscribe(
                        () => {
                            expect(ss.sendPacket).not.toHaveBeenCalled();
                        },
                        () => { return; },
                        () => done()
                    );
                    StompService.fireConnectCommand(bus, config);
                }
            );
        });

        describe('Error handling and socket failure recovery', () => {
            it('We should be able to handle errors on the socket correctly',

                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let errorChannel = bus.getResponseChannel(StompChannel.error, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    let session = ss.getSession(command.session);
                                    setTimeout(
                                        () => session.client.clientSocket.triggerEvent('error', ['unknown'])
                                    );
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    errorChannel.subscribe(
                        (msg: Message) => {

                            let busCommand = StompParser.extractStompBusCommandFromMessage(msg);

                            expect(msg.isError).toBeTruthy();
                            expect(busCommand.command).toEqual(StompClient.STOMP_ERROR);
                            expect(busCommand.payload).toEqual('unknown');
                            done();
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );


            it('trying to subscribe with an invalid broker session should throw an error',

                (done) => {

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());
                    let errorChannel = bus.getResponseChannel(StompChannel.error, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    StompService.fireSubscribeCommand(
                                        bus,
                                        'bee-doh-bee-doh-bee-doh',
                                        topicA,
                                        subId
                                    );

                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }
                        });

                    errorChannel.subscribe(
                        (msg: Message) => {

                            let busCommand = StompParser.extractStompBusCommandFromMessage(msg);

                            expect(msg.isError).toBeTruthy();
                            expect(busCommand.command).toEqual(StompClient.STOMP_ERROR);
                            expect(busCommand.payload).toEqual('cannot subscribe, session does not exist.');
                            done();
                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

        });

        describe('Galactic channel events and message bus monitor consumption', () => {
            it('We should be able to ensure that the stomp service is listening on the monitor channel',

                (done) => {

                    /*

                     The Stomp service listens to the bus monitor. The bus monitor broadcasts channel events
                     like creation, closure and completion. The stomp service picks up a channel creation/closure
                     message and then checks to see if that channel is galactic, or not.

                     If the channel is galactic, the stomp service wil subscribe to a topic and/or a queue with the
                     same channel name i.e. /topic/mychannel on the broker

                     when the channel is closed or completed, the subscription is closed.

                     This test is checking to make sure that the stomp service is responding correctly to the
                     bus.getGalacticChannel() method, that method causes a monitor message declaring a new channel
                     creation.

                     */

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    // trigger some expected traffic on the monitor channel
                                    bus.getGalacticChannel('fancycats', getName());
                                    break;

                                case StompClient.STOMP_SUBSCRIBED:
                                    expect(ss.galacticChannels.size).toEqual(1);

                                    // trigger an unsubscription via channel close
                                    bus.close('fancycats', getName());
                                    break;

                                case StompClient.STOMP_UNSUBSCRIBED:
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }

                        });

                    StompService.fireConnectCommand(bus, config);
                }
            );

            it('The monitor stream message handler should be able to drop any invalid monitor events',

                (done) => {

                    /*

                     This test checks if the stomp service drops & reports that a monitor message is invalid
                     and should be ignored

                     */

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);
                            switch (command.command) {
                                case StompClient.STOMP_INVALIDMONITOR:
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();

                            }
                        });

                    let mo: MonitorObject = new MonitorObject().build(
                        MonitorType.MonitorNewChannel,
                        null,
                        null
                    );

                    bus.send(MonitorChannel.stream, new Message().request(mo), getName());

                }
            );

            it('galactic channels created before the stomp client has connected should be proxied once connected',

                (done) => {

                    /*

                     This tests that any galactic channels that are created before the stomp service has
                     connected to the broker, are extended/subscribed to once the broker has connected successfully.

                     This way we can ensure no race conditions occur by having to ensure a broker connection before
                     requesting a galactic channel.

                     */

                    let statusChannel = bus.getResponseChannel(StompChannel.status, getName());

                    statusChannel.subscribe(
                        (msg: Message) => {
                            let command: StompBusCommand
                                = StompParser.extractStompBusCommandFromMessage(msg);

                            switch (command.command) {
                                case StompClient.STOMP_SUBSCRIBED:
                                    expect(ss.galacticChannels.size).toEqual(2);

                                    // trigger an unsubscription via channel close
                                    bus.complete('happy-puppers', getName());
                                    break;

                                case StompClient.STOMP_UNSUBSCRIBED:
                                    ss.sessions.forEach(
                                        (session: StompSession) => {
                                            StompService.fireDisconnectCommand(bus, session.id);
                                        }
                                    );
                                    break;

                                case StompClient.STOMP_DISCONNECTED:
                                    done();
                                    break;

                                default:
                                    expect(false).toBeTruthy();
                                    done();
                            }

                        });

                    bus.getGalacticChannel('happy-puppers', getName());
                    bus.getGalacticChannel('naughty-kitties', getName());

                    StompService.fireConnectCommand(bus, config);

                }
            );
        });
    });
}

// set the test mode for configuration to on, so mock socket will enage instead of a real socket.
function setTestMode(config: StompConfig): void {
    config.testMode = true;
}

// helper to create a standard mocked config
function createStandardConfig(): StompConfig {
    let configuration = new StompConfig(
        'somwehere',
        'somehost',
        12345,
        '',
        ''
    );
    setTestMode(configuration);
    return configuration;
}

function getName() {
    return 'stomp.service.spec';
}


