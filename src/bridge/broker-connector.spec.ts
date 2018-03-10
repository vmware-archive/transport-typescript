import { Message, BifrostEventBus } from '../';
import { BrokerConnector } from './broker-connector';
import { StompChannel, StompBusCommand, StompConfig, StompSession } from './stomp.model';
import { StompParser } from './stomp.parser';
import { StompClient } from './stomp.client';
import { MonitorChannel, MonitorObject, MonitorType } from '../bus/model/monitor.model';
import { Syslog } from '../log/syslog';
import 'rxjs/add/operator/take';
import { EventBus } from '../bus.api';
import { LogLevel } from '../log/logger.model';
import { GeneralUtil } from '../util/util';

/**
 * Main BrokerConnector tests.
 */

describe('BrokerConnector [broker-connector.ts]', () => {

    let bus: EventBus;
    let ss: BrokerConnector;
    let config: StompConfig;
    let configNoTopics: StompConfig;
    let configMultiBroker: StompConfig;
    let configCustomId: StompConfig;
    let configApplicationPrefix: StompConfig;

    let subId: string;

    const topicA: string = '/topic/testA';

    afterEach(() => {
        bus.api.destroyAllChannels();
    });

    beforeEach(
        () => {

            bus = new BifrostEventBus(LogLevel.Error, true);
            ss = window.AppBrokerConnector;

            config = createStandardConfig();
            configNoTopics = createStandardConfig(false); // no topics.
            configMultiBroker = createStandardConfig(false, true); // multiple brokers.
            configCustomId = createStandardConfig(false, false, 'puppy-love'); //custom forced Id for session.
            configApplicationPrefix = createStandardConfig(true, false, 'anything', '/dogs'); // custom check for application prefix.

            subId = GeneralUtil.genUUIDShort();

            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);

        });

    describe('Service configuration and basic connect/disconnect', () => {

        it('We should be able to set the configuration',
            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONFIGURED:
                                expect(true).toBeTruthy();
                                done();
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should be able to determine that we\'re connected',
            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                expect(true).toBeTruthy();
                                done();
                                break;
                            default:
                                break;
                        }
                    });

                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should be able to determine that we\'re disconnected',
            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                BrokerConnector.fireDisconnectCommand(bus, command.session);
                                break;

                            case StompClient.STOMP_DISCONNECTED:
                                expect(true).toBeTruthy();
                                done();
                                break;
                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );
    });

    describe('Subscribing, messaging and un-subscribing', () => {

        it('We should be able to subscribe to a broker destination',
            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
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
                                break;
                        }
                    });

                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should be able to subscribe to a broker destination and send/receive messages',

            (done) => {

                let outboundMessage = 'a lovely horse';

                let mId: string = StompParser.genUUID();
                let headers: any = { id: mId, subscription: subId };

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId
                                );
                                break;

                            case StompClient.STOMP_SUBSCRIBED:
                                headers.session = command.session;
                                let message = StompParser.generateStompBusCommand(
                                    StompClient.STOMP_SEND,
                                    command.session,
                                    topicA,
                                    StompParser.generateStompReadyMessage(outboundMessage, headers)
                                );

                                bus.sendResponseMessage(StompChannel.messages, message);
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(StompChannel.messages)
                    .handle(
                    (command: StompBusCommand) => {
                        const stompMessage = StompParser.extractStompMessageFromBusCommand(command);
                        expect(stompMessage.body).toEqual(outboundMessage);
                        expect(stompMessage.headers['session']).toEqual(command.session);
                        done();
                    });

                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should be able to unsubscribe to a broker destination',

            (done) => {

                let sessId: string;

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                sessId = command.session;
                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId
                                );

                                break;

                            case StompClient.STOMP_SUBSCRIBED:

                                expect(command.destination).toEqual(topicA);
                                BrokerConnector.fireUnSubscribeCommand(
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
                                break;
                        }
                    });

                BrokerConnector.fireConnectCommand(bus, config);
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
                const badCommand = StompParser.generateStompBusCommand('CARROT', '', '', config);
                bus.sendRequestMessage(StompChannel.connection, badCommand);

                expect(ss.connectClient).not.toHaveBeenCalled();

                bus.sendRequestMessage(StompChannel.connection, 'CAMELOT');

                expect(ss.connectClient).not.toHaveBeenCalled();

                // wrong command message
                let wrongCommand =
                    StompParser.generateStompBusCommand(StompClient.STOMP_CONNECTED, '', '', config);

                bus.sendRequestMessage(StompChannel.connection, wrongCommand);

                expect(ss.connectClient).not.toHaveBeenCalled();

                done();
            }
        );

        it('We should only respond to valid disconnection messages sent on the bus',
            (done) => {

                spyOn(ss, 'disconnectClient')
                    .and
                    .callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                // create a bad command message
                                let badCommand = StompParser.generateStompBusCommand('DISCOMMAND', '', '', config);
                                bus.sendRequestMessage(StompChannel.connection, badCommand);

                                expect(ss.disconnectClient).not.toHaveBeenCalled();

                                // create a bad bus message
                                bus.sendRequestMessage(StompChannel.connection, 'DISCONACRT');

                                expect(ss.disconnectClient).not.toHaveBeenCalled();

                                // wrong command message
                                let wrongCommand =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_DISCONNECTING,
                                        '',
                                        '',
                                        config
                                    );

                                bus.sendRequestMessage(StompChannel.connection, wrongCommand);

                                expect(ss.disconnectClient).not.toHaveBeenCalled();
                                done();

                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should only respond to valid subscription messages sent on the bus',
            (done) => {

                spyOn(ss, 'subscribeToDestination')
                    .and
                    .callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

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

                                bus.sendRequestMessage(StompChannel.subscription, missingProperties);

                                expect(ss.subscribeToDestination).not.toHaveBeenCalled();

                                // create a bad bus message
                                bus.sendRequestMessage(StompChannel.connection, StompClient.STOMP_SUBSCRIBE);

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
                                bus.sendRequestMessage(StompChannel.subscription, wrongCommand);

                                expect(ss.subscribeToDestination).not.toHaveBeenCalled();

                                done();
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should only respond to valid unsubscription messages sent on the bus',
            (done) => {

                spyOn(ss, 'unsubscribeFromDestination')
                    .and
                    .callThrough();

                let sessId: string;

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                sessId = command.session;
                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId
                                );

                                break;

                            case StompClient.STOMP_SUBSCRIBED:

                                expect(command.destination).toEqual(topicA);

                                // create a bad bus message
                                bus.sendRequestMessage(StompChannel.connection, StompClient.STOMP_UNSUBSCRIBE);

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
                                bus.sendRequestMessage(StompChannel.subscription, wrongCommand);

                                expect(ss.unsubscribeFromDestination).not.toHaveBeenCalled();

                                let missingPayload =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_UNSUBSCRIBE,
                                        null,
                                        null,
                                        null
                                    );

                                // send missing payload and distribution
                                bus.sendRequestMessage(StompChannel.subscription, missingPayload);

                                expect(ss.unsubscribeFromDestination).not.toHaveBeenCalled();

                                done();
                                break;

                            default:
                                break;

                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('We should only respond to valid outbound messages sent on the bus',
            (done) => {

                let outboundMessage = 'anyone fancy a pint?';

                let mId: string = StompParser.genUUID();
                let headers: Object = { id: mId, subscription: subId };

                spyOn(ss, 'sendPacket')
                    .and
                    .callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
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
                                bus.sendRequestMessage(
                                    StompChannel.messages,
                                    message
                                );

                                message = StompParser.generateStompBusCommand(
                                    StompClient.STOMP_MESSAGE,
                                    command.session,
                                    topicA,
                                    StompParser.generateStompReadyMessage(outboundMessage, headers)
                                );

                                // valid message, wrong command
                                bus.sendRequestMessage(
                                    StompChannel.messages,
                                    message
                                );

                                message = StompParser.generateStompBusCommand(
                                    StompClient.STOMP_SEND,
                                    command.session,
                                    null,
                                    StompParser.generateStompReadyMessage(outboundMessage, headers)
                                );

                                // valid message, missing destination
                                bus.sendRequestMessage(
                                    StompChannel.messages,
                                    message
                                );
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(StompChannel.status)
                    .handle(
                    () => {
                        expect(ss.sendPacket).not.toHaveBeenCalled();
                        done();
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );
    });

    describe('Error handling and socket failure recovery', () => {
        it('We should be able to handle errors on the socket correctly',

            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                let session = ss.getSession(command.session);
                                setTimeout(
                                    () => session.client.clientSocket.triggerEvent('error', ['unknown'])
                                );
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(StompChannel.error)
                    .handle(
                    null,
                    (busCommand: StompBusCommand) => {

                        expect(busCommand.command).toEqual(StompClient.STOMP_ERROR);
                        expect(busCommand.payload).toEqual('unknown');
                        done();
                    });

                BrokerConnector.fireConnectCommand(bus, config);
            }
        );


        it('trying to subscribe with an invalid broker session should throw an error',

            (done) => {

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    'bee-doh-bee-doh-bee-doh',
                                    topicA,
                                    subId
                                );

                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(StompChannel.error)
                    .handle(
                    null,
                    (busCommand: StompBusCommand) => {

                        expect(busCommand.command).toEqual(StompClient.STOMP_ERROR);
                        expect(busCommand.payload).toEqual('cannot subscribe, session does not exist.');
                        done();
                    });

                BrokerConnector.fireConnectCommand(bus, config);
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

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                // trigger some expected traffic on the monitor channel
                                bus.api.getGalacticChannel('fancycats', getName());
                                break;

                            case StompClient.STOMP_SUBSCRIBED:
                                expect(ss.galacticChannels.size).toEqual(1);

                                // trigger an unsubscription via channel close
                                bus.closeChannel('fancycats', getName());
                                break;

                            case StompClient.STOMP_UNSUBSCRIBED:
                                done();
                                break;

                            default:
                                done();
                        }

                    });

                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('The monitor stream message handler should be able to drop any invalid monitor events',

            (done) => {

                /*

                 This test checks if the stomp service drops & reports that a monitor message is invalid
                 and should be ignored

                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_INVALIDMONITOR:
                                done();
                                break;

                            default:
                                break;

                        }
                    });

                const mo: MonitorObject = new MonitorObject().build(
                    MonitorType.MonitorNewChannel,
                    null,
                    null
                );

                bus.sendRequestMessage(MonitorChannel.stream, mo);

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

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_SUBSCRIBED:
                                expect(ss.galacticChannels.size).toEqual(2);

                                // trigger an unsubscription via channel close
                                bus.closeGalacticChannel('happy-puppers', getName());
                                break;

                            case StompClient.STOMP_UNSUBSCRIBED:
                                ss.sessions.forEach(
                                    (session: StompSession) => {
                                        BrokerConnector.fireDisconnectCommand(bus, session.id);
                                    }
                                );
                                break;

                            case StompClient.STOMP_DISCONNECTED:
                                done();
                                break;

                            default:
                                break;
                        }

                    });

                bus.api.getGalacticChannel('happy-puppers', getName());
                bus.api.getGalacticChannel('naughty-kitties', getName());

                BrokerConnector.fireConnectCommand(bus, config);

            }
        );

        it('check galactic channels can operate against low level messages',

            (done) => {
                let count = 0;
                /*
 
                This tests that galatic channels operate over low level API's
 
                 */

                const chan = bus.api.getGalacticChannel('bouncy-pups');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('puppy1');
                        count++;
                        if (count == 3) {
                            done();
                        }
                    }
                );
                bus.sendResponseMessage('bouncy-pups', 'puppy1');
                bus.api.sendResponse('bouncy-pups', 'puppy1');
                bus.api.send('bouncy-pups', new Message().response('puppy1'));


            }
        );

        it('check galactic messages are sent when sessions are in play',

            (done) => {

                spyOn(ss, 'sendPacket').and.callThrough();

                /**
                 * Will check that sendPacket is fired when valid connection sessions exist.
                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.sendGalacticMessage('sometopic', 'hello!');

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(ss.sendPacket).toHaveBeenCalled();
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );


        it('check galactic messages are sent with or without application prefix ',

            (done) => {
                const logger = bus.api.logger();
                spyOn(logger, 'debug').and.callThrough();

                /**
                 * Will check that application prefix is applied if part of config
                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    bus.sendGalacticMessage('sometopic', 'hello!');

                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(logger.debug).toHaveBeenCalledWith(
                                                'Sending Galactic Message for session anything to ' +
                                                'destination /dogs/sometopic', 'BrokerConnector');
                                            done();
                                        }
                                    );
                                    break;

                                default:
                                    break;
                            }
                        });


                BrokerConnector.fireConnectCommand(bus, configApplicationPrefix);
            }
        );


        it('check galactic messages are sent when sessions are in play and no topics are configured',

            (done) => {

                const logger = bus.api.logger();
                spyOn(logger, 'warn').and.callThrough();

                /**
                 * Will check that sendPacket is fired when valid connection sessions exist.
                 * only a syslog will be triggered however as there are no topics configured.
                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.sendGalacticMessage('sometopic', 'hello!');

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(logger.warn)
                                            .toHaveBeenCalledWith(
                                            'Cannot send galactic message, topics not ' +
                                            'enabled for broker, queues not implemented yet.', 'BrokerConnector');
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, configNoTopics);
            }
        );

        it('check galactic channels are not opened if topics are not configured.',

            (done) => {

                const logger = bus.api.logger();
                spyOn(logger, 'warn').and.callThrough();

                /**
                 * check galactic channels cannot be opened if topics are no configured for the broker.
                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.listenGalacticStream('pop');

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(logger.warn)
                                            .toHaveBeenCalledWith(
                                            'Unable to open galactic channel, ' +
                                            'topics not configured and queues not supported yet.', 'BrokerConnector');
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, configNoTopics);
            }
        );

        it('check galactic channels are not closed if topics are not configured.',

            (done) => {

                const logger = bus.api.logger();
                spyOn(logger, 'warn').and.callThrough();

                /**
                 * Check that galactic channels cannot be closed if topics are no configured
                 */

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.listenGalacticStream('pop');
                                bus.closeGalacticChannel('pop');

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(logger.warn)
                                            .toHaveBeenCalledTimes(2);
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, configNoTopics);
            }
        );

        it('check galactic channels are not closed if there are no sessions active.',

            (done) => {

                spyOn(Syslog, 'warn').and.callThrough();
                spyOn(Syslog, 'info').and.callThrough();

                /**
                 * Check that galactic channels cannot be closed if topics are no configured
                 */
                bus.listenGalacticStream('pop');
                bus.closeGalacticChannel('pop');

                bus.api.tickEventLoop(
                    () => {

                        //Added galactic channel to broker subscription requests:
                        expect(Syslog.warn)
                            .toHaveBeenCalledWith(
                            'unable to close galactic channel, no open sessions.');
                        done();
                    }
                );
            }
        );

        // it('check that incoming stomp messages are not processed if they are invalid.',

        //     (done) => {

        //         spyOn(Syslog, 'warn').and.callThrough();
        //         spyOn(ss, 'sendPacket').and.callThrough();

        //         /**
        //          * Check that incoming messages for stomp comms are valid, no processing otherwise.
        //          */
        //         bus.sendRequestMessage(StompChannel.messages, 'invalid msg');

        //         bus.api.tickEventLoop(
        //             () => {

        //                 //Added galactic channel to broker subscription requests:

        //                 expect(Syslog.warn)
        //                     .toHaveBeenCalledWith(
        //                     'unable to validate inbound message, invalid: invalid msg');

        //                 expect(ss.sendPacket).not.toHaveBeenCalled();
        //                 done();
        //             }, 50
        //         );
        //     }
        // );

        it('check that incoming stomp subscriptions are not processed if they are invalid commands',

            (done) => {

                spyOn(Syslog, 'warn').and.callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.listenGalacticStream('pop');

                                BrokerConnector.fireSubscriptionCommand(bus,
                                    '123',
                                    'somewhere',
                                    '123456',
                                    StompClient.STOMP_ABORT);


                                bus.api.tickEventLoop(
                                    () => {
                                        expect(Syslog.warn)
                                            .toHaveBeenCalledWith(
                                            'unable to validate inbound subscription message, invalid');
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('check that a broker with multiple relays responds correctly.',

            (done) => {

                spyOn(Syslog, 'info').and.callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                done();
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, configMultiBroker);
                bus.api.tickEventLoop(
                    () => {
                        expect(Syslog.info).toHaveBeenCalledWith('Connection message 1 of 2 received');

                        // fire second connection from relay.
                        configMultiBroker.connectionSubjectRef.next(true);
                    }, 30
                );
            }
        );

        it('try disconnecting a client when there is no session.',

            () => {

                spyOn(Syslog, 'warn').and.callThrough();
                ss.disconnectClient('ember-pup');
                expect(Syslog.warn)
                    .toHaveBeenCalledWith('unable to disconnect client, no active session with id: ember-pup');

            }
        );

        it('sendPacket() works with and without the correct headers and session properties.',

            (done) => {

                spyOn(Syslog, 'warn').and.callThrough();
                spyOn(Syslog, 'debug').and.callThrough();
                ss.sendPacket(
                    {
                        payload: {
                            command: 'none',
                            headers: null,
                            body: 'nothing'
                        },
                        command: 'none',
                        destination: 'nowhere',
                        session: null
                    }
                );
                expect(Syslog.warn)
                    .toHaveBeenCalledWith('unable to send packet, session is empty');

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:



                                ss.sendPacket(
                                    {
                                        payload: {
                                            command: 'none',
                                            headers: {},
                                            body: 'nothing'
                                        },
                                        command: 'none',
                                        destination: 'nowhere',
                                        session: 'puppy-love'
                                    }
                                );
                                expect(Syslog.debug)
                                    .toHaveBeenCalledWith('sendPacket(): adding local broker session ' +
                                    'ID to message: puppy-love');

                                ss.sendPacket(
                                    {
                                        payload: {
                                            command: 'none',
                                            headers: { session: 'pants' },
                                            body: 'nothing'
                                        },
                                        command: 'none',
                                        destination: 'nowhere',
                                        session: 'puppy-love'
                                    }
                                );
                                expect(Syslog.debug)
                                    .toHaveBeenCalledWith('sendPacket(): message headers already contain sessionId');
                                //
                                done();
                                break;

                            default:
                                break;
                        }
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, configCustomId);

            }
        );

        it('subscribeToDestination() forwards any message sent on galatic channel',

            (done) => {

                spyOn(ss, 'sendPacket').and.callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                bus.listenGalacticStream('space-dogs');

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(ss.sendPacket).toHaveBeenCalled();
                                        done();
                                    }, 20
                                );


                                break;

                            default:
                                break;
                        }
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, config);

            }
        );

        it('unsubscribeFromDestination() behaves correctly if incorrect session state exists.',

            (done) => {

                spyOn(Syslog, 'warn').and.callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                ss.unsubscribeFromDestination({ session: 'none', destination: 'none', id: 'none' });

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(Syslog.warn)
                                            .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                            'no session found for id: none');
                                        done();
                                    }, 20
                                );


                                break;

                            default:
                                break;
                        }
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('unsubscribeFromDestination() behaves correctly if no galatic subscriptions can be found.',

            (done) => {

                spyOn(Syslog, 'warn').and.callThrough();

                bus.listenStream(StompChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                ss.unsubscribeFromDestination(
                                    { session: 'puppy-love', destination: 'none', id: 'none' }
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(Syslog.warn)
                                            .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                            'no galactic subscription found for id: puppy-love');
                                        done();
                                    }, 20
                                );


                                break;

                            default:
                                break;
                        }
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, configCustomId);
            }
        );

    });
});


// set the test mode for configuration to on, so mock socket will enage instead of a real socket.
function setTestMode(config: StompConfig): void {
    config.testMode = true;
}

// helper to create a standard mocked config
function createStandardConfig(
    useTopics: boolean = true,
    multiBroker: boolean = false,
    customSession?: string,
    applicationPrefix?: string): StompConfig {
    let configuration = new StompConfig(
        'somwehere',
        'somehost',
        12345,
        '',
        '',
        false,
        applicationPrefix
    );

    configuration.brokerConnectCount = 1;

    if (multiBroker) {
        configuration.brokerConnectCount = 2;
    }
    configuration.topicLocation = '/topic';
    configuration.useTopics = useTopics;
    if (customSession) {
        configuration.sessionId = customSession;
    }

    setTestMode(configuration);
    return configuration;
}

function getName() {
    return 'stomp.service.spec';
}


