/*
 * Copyright 2017-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BrokerConnector } from './broker-connector';
import { BrokerConnectorChannel, StompBusCommand, StompConfig, StompSession } from './stomp.model';
import { StompParser } from './stomp.parser';
import { StompClient } from './stomp.client';
import { MonitorChannel, MonitorObject, MonitorType } from '../bus/model/monitor.model';
import { ChannelBrokerMapping, EventBus } from '../bus.api';
import { LogLevel } from '../log/logger.model';
import { GeneralUtil } from '../util/util';
import { Logger } from '../log';
import { MockSocket } from './stomp.mocksocket';
import { Message } from '../bus';
import { BusTestUtil } from '../util/test.util';

/**
 * Main BrokerConnector tests.
 */

describe('BrokerConnector [broker-connector.ts]', () => {

    let bus: EventBus;
    let bc: BrokerConnector;
    let config: StompConfig;
    let configNoTopics: StompConfig;
    let configMultiBroker: StompConfig;
    let configCustomId: StompConfig;
    let configApplicationPrefix: StompConfig;
    let log: Logger;

    let subId: string;

    const topicA: string = '/topic/testA';

    afterEach(() => {
        bus.api.destroyAllChannels();
    });

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Off, true);
            bc = bus.brokerConnector;
            log = bus.logger;

            config = createStandardConfig();
            configNoTopics = createStandardConfig(false); // no topics.
            configMultiBroker = createStandardConfig(false, true); // multiple brokers.
            configCustomId = createStandardConfig(false, false, 'puppy-love'); //custom forced Id for session.
            configApplicationPrefix = createStandardConfig(true, false, 'anything', '/dogs'); // custom check for application prefix.

            subId = GeneralUtil.genUUID();

            //bus.api.silenceLog(true);
            //bus.api.suppressLog(true);
            bus.api.logger().setStylingVisble(false);

        });

    describe('Global headers should be passed to the StompSession', () => {
        beforeEach(() => {
            // Patch the currentSessionMap to spy on the objects it creates.
            const origCurrentSessionMapSetter = bc['currentSessionMap'].set.bind(bc['currentSessionMap']);
            spyOn(bc['currentSessionMap'], 'set').and.callFake((key: string, value: StompSession) => {
                spyOn(value, 'connect').and.callThrough();
                spyOn(value, 'subscribe').and.callThrough();
                spyOn(value, 'unsubscribe').and.callThrough();
                spyOn(value, 'disconnect').and.callThrough();
                return origCurrentSessionMapSetter(key, value);
            });
        });

        it('CONNECT, SUBSCRIBE, UNSUBSCRIBE and DISCONNECT messages should include global headers', (done) => {
            const connString: string = GeneralUtil.getFabricConnectionString(config.host, config.port, config.endpoint);
            const globalHeaderKeys = Object.keys(bc['getGlobalHeaders']());

            // Test 1: CONNECT message should include global headers.
            bc.connectClient(config);
            const session = bc['currentSessionMap'].get(connString) as jasmine.SpyObj<StompSession>;
            const subscriptionData = {
                id: 'whatever',
                destination: 'wherever',
                session: session.id,
                isQueue: false,
                brokerPrefix: 'fake'
            };
            let headers = session.connect.calls.mostRecent().args[0];
            let headerKeys = Object.keys(headers);
            expect(globalHeaderKeys.every(key => headerKeys.includes(key))).toBeTruthy();

            bus.api.tickEventLoop(
                () => {
                    // Test 2: SUBSCRIBE message should include global headers.
                    bc.subscribeToDestination(subscriptionData);
                    headers = session.subscribe.calls.mostRecent().args[2];
                    headerKeys = Object.keys(headers);
                    expect(globalHeaderKeys.every(key => headerKeys.includes(key))).toBeTruthy();

                    // Test 3: UNSUBSCRIBE message should include global headers.
                    bc.unsubscribeFromDestination(subscriptionData);
                    headers = session.unsubscribe.calls.mostRecent().args[1];
                    headerKeys = Object.keys(headers);
                    expect(globalHeaderKeys.every(key => headerKeys.includes(key))).toBeTruthy();

                    // Test 4: DISCONNECT message should include global headers.
                    bc.disconnectClient(session.id);
                    headers = session.disconnect.calls.mostRecent().args[0];
                    headerKeys = Object.keys(headers);
                    expect(globalHeaderKeys.every(key => headerKeys.includes(key))).toBeTruthy();

                    done();
                },
                10 // found by trial and error.
            );
        });
    });

    describe('Service configuration and basic connect/disconnect', () => {

        it('We should be able to set the configuration',
            (done) => {

                bus.listenStream(BrokerConnectorChannel.status)
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

                bus.listenStream(BrokerConnectorChannel.status)
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

                bus.listenStream(BrokerConnectorChannel.status)
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

    describe('[Public channel] Subscribing, messaging and un-subscribing', () => {

        it('We should be able to subscribe to a broker destination',
            (done) => {

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
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

                let mId: string = GeneralUtil.genUUIDShort();
                let headers: any = { id: mId, subscription: subId };

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
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

                                bus.sendResponseMessage(BrokerConnectorChannel.messages, message);
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(BrokerConnectorChannel.messages)
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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                sessId = command.session;
                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
                                );

                                break;

                            case StompClient.STOMP_SUBSCRIBED:

                                expect(command.destination).toEqual(topicA);
                                BrokerConnector.fireUnSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
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

    describe('[Private channel] Subscribing, messaging and un-subscribing', () => {

        it('We should be able to subscribe to a broker destination',
            (done) => {

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    BrokerConnector.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
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

                let mId: string = GeneralUtil.genUUIDShort();
                let headers: any = { id: mId, subscription: subId };

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    BrokerConnector.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
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

                                    bus.sendResponseMessage(BrokerConnectorChannel.messages, message);
                                    break;

                                default:
                                    break;
                            }
                        });

                bus.listenStream(BrokerConnectorChannel.messages)
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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    sessId = command.session;
                                    BrokerConnector.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
                                    );

                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    expect(command.destination).toEqual(topicA);
                                    BrokerConnector.fireUnSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
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

                spyOn(bc, 'connectClient')
                    .and
                    .callThrough();

                // create a bad command message
                const badCommand = StompParser.generateStompBusCommand('CARROT', '', '', config);
                bus.sendRequestMessage(BrokerConnectorChannel.connection, badCommand);

                expect(bc.connectClient).not.toHaveBeenCalled();

                bus.sendRequestMessage(BrokerConnectorChannel.connection, 'CAMELOT');

                expect(bc.connectClient).not.toHaveBeenCalled();

                // wrong command message
                let wrongCommand =
                    StompParser.generateStompBusCommand(StompClient.STOMP_CONNECTED, '', '', config);

                bus.sendRequestMessage(BrokerConnectorChannel.connection, wrongCommand);

                expect(bc.connectClient).not.toHaveBeenCalled();

                done();
            }
        );

        it('We should only respond to valid disconnection messages sent on the bus',
            (done) => {

                spyOn(bc, 'disconnectClient')
                    .and
                    .callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                // create a bad command message
                                let badCommand = StompParser.generateStompBusCommand('DISCOMMAND', '', '', config);
                                bus.sendRequestMessage(BrokerConnectorChannel.connection, badCommand);

                                expect(bc.disconnectClient).not.toHaveBeenCalled();

                                // create a bad bus message
                                bus.sendRequestMessage(BrokerConnectorChannel.connection, 'DISCONACRT');

                                expect(bc.disconnectClient).not.toHaveBeenCalled();

                                // wrong command message
                                let wrongCommand =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_DISCONNECTING,
                                        '',
                                        '',
                                        config
                                    );

                                bus.sendRequestMessage(BrokerConnectorChannel.connection, wrongCommand);

                                expect(bc.disconnectClient).not.toHaveBeenCalled();
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

                spyOn(bc, 'subscribeToDestination')
                    .and
                    .callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
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
                                            '123', null, null,
                                            false, '/topic'
                                        )
                                    );

                                // public channel
                                bus.sendRequestMessage(BrokerConnectorChannel.subscription, missingProperties);

                                expect(bc.subscribeToDestination).not.toHaveBeenCalled();

                                // private channel
                                missingProperties.payload = StompParser.generateStompBrokerSubscriptionRequest(
                                    '123', null, null,
                                    true, '/queue'
                                );

                                expect(bc.subscribeToDestination).not.toHaveBeenCalled();

                                // create a bad bus message
                                bus.sendRequestMessage(BrokerConnectorChannel.connection, StompClient.STOMP_SUBSCRIBE);

                                expect(bc.subscribeToDestination).not.toHaveBeenCalled();

                                let wrongCommand =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_SUBSCRIBED,
                                        '123',
                                        '234',
                                        StompParser.generateStompBrokerSubscriptionRequest(
                                            '123', 'abc', '456',
                                            false, '/topic'
                                        )
                                    );

                                // send wrong command (public channel)
                                bus.sendRequestMessage(BrokerConnectorChannel.subscription, wrongCommand);

                                expect(bc.subscribeToDestination).not.toHaveBeenCalled();

                                // send wrong command (private channel)
                                wrongCommand.payload = StompParser.generateStompBrokerSubscriptionRequest(
                                    '123', 'abc', '456',
                                    true, '/queue'
                                );
                                bus.sendRequestMessage(BrokerConnectorChannel.subscription, wrongCommand);

                                expect(bc.subscribeToDestination).not.toHaveBeenCalled();

                                done();
                                break;

                            default:
                                break;
                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('[Public channel] We should only respond to valid unsubscription messages sent on the bus',
            (done) => {

                spyOn(bc, 'unsubscribeFromDestination')
                    .and
                    .callThrough();

                let sessId: string;

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                sessId = command.session;
                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
                                );

                                break;

                            case StompClient.STOMP_SUBSCRIBED:

                                expect(command.destination).toEqual(topicA);

                                // create a bad bus message
                                bus.sendRequestMessage(BrokerConnectorChannel.connection, StompClient.STOMP_UNSUBSCRIBE);

                                expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                let wrongCommand =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_UNSUBSCRIBED,
                                        '123',
                                        '234',
                                        StompParser.generateStompBrokerSubscriptionRequest(
                                            '123', 'abc', '456',
                                            false, '/topic'
                                        )
                                    );


                                // send wrong command
                                bus.sendRequestMessage(BrokerConnectorChannel.subscription, wrongCommand);

                                expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                let missingPayload =
                                    StompParser.generateStompBusCommand(
                                        StompClient.STOMP_UNSUBSCRIBE,
                                        null,
                                        null,
                                        null
                                    );

                                // send missing payload and distribution
                                bus.sendRequestMessage(BrokerConnectorChannel.subscription, missingPayload);

                                expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                done();
                                break;

                            default:
                                break;

                        }
                    });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('[Private channel] We should only respond to valid unsubscription messages sent on the bus',
            (done) => {

                spyOn(bc, 'unsubscribeFromDestination')
                    .and
                    .callThrough();

                let sessId: string;

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    sessId = command.session;
                                    BrokerConnector.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
                                    );

                                    break;

                                case StompClient.STOMP_SUBSCRIBED:

                                    expect(command.destination).toEqual(topicA);

                                    // create a bad bus message
                                    bus.sendRequestMessage(BrokerConnectorChannel.connection, StompClient.STOMP_UNSUBSCRIBE);

                                    expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    let wrongCommand =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_UNSUBSCRIBED,
                                            '123',
                                            '234',
                                            StompParser.generateStompBrokerSubscriptionRequest(
                                                '123', 'abc', '456',
                                                true, '/queue'
                                            )
                                        );


                                    // send wrong command
                                    bus.sendRequestMessage(BrokerConnectorChannel.subscription, wrongCommand);

                                    expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    let missingPayload =
                                        StompParser.generateStompBusCommand(
                                            StompClient.STOMP_UNSUBSCRIBE,
                                            null,
                                            null,
                                            null
                                        );

                                    // send missing payload and distribution
                                    bus.sendRequestMessage(BrokerConnectorChannel.subscription, missingPayload);

                                    expect(bc.unsubscribeFromDestination).not.toHaveBeenCalled();

                                    done();
                                    break;

                                default:
                                    break;

                            }
                        });
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('[Public channel] We should only respond to valid outbound messages sent on the bus',
            (done) => {

                let outboundMessage = 'anyone fancy a pint?';

                let mId: string = GeneralUtil.genUUIDShort();
                let headers: Object = { id: mId, subscription: subId };

                spyOn(bc, 'sendPacket')
                    .and
                    .callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    command.session,
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
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
                                    BrokerConnectorChannel.messages,
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
                                    BrokerConnectorChannel.messages,
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
                                    BrokerConnectorChannel.messages,
                                    message
                                );
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    () => {
                        expect(bc.sendPacket).not.toHaveBeenCalled();
                        done();
                    }
                    );
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );

        it('[Private channel] We should only respond to valid outbound messages sent on the bus',
            (done) => {

                let outboundMessage = 'anyone fancy a pint?';

                let mId: string = GeneralUtil.genUUIDShort();
                let headers: Object = { id: mId, subscription: subId };

                spyOn(bc, 'sendPacket')
                    .and
                    .callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    BrokerConnector.fireSubscribeCommand(
                                        bus,
                                        command.session,
                                        topicA,
                                        subId,
                                        true,
                                        '/queue'
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
                                        BrokerConnectorChannel.messages,
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
                                        BrokerConnectorChannel.messages,
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
                                        BrokerConnectorChannel.messages,
                                        message
                                    );
                                    break;

                                default:
                                    break;
                            }
                        });

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        () => {
                            expect(bc.sendPacket).not.toHaveBeenCalled();
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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                let session = bc.getSession(command.session);
                                setTimeout(
                                    () => session.client.clientSocket.triggerEvent('error', ['unknown'])
                                );
                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(BrokerConnectorChannel.error)
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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                BrokerConnector.fireSubscribeCommand(
                                    bus,
                                    'bee-doh-bee-doh-bee-doh',
                                    topicA,
                                    subId,
                                    false,
                                    '/topic'
                                );

                                break;

                            default:
                                break;
                        }
                    });

                bus.listenStream(BrokerConnectorChannel.error)
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
        it('We should be able to ensure that the stomp service is online on the monitor channel',

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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                // trigger some expected traffic on the monitor channel
                                bus.api.getGalacticChannel('fancycats', null, getName());
                                break;

                            case StompClient.STOMP_SUBSCRIBED:
                                expect(bc.galacticChannels.size).toEqual(1);
                                expect(bc.privateChannels.size).toEqual(1);

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

                bus.listenStream(BrokerConnectorChannel.status)
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

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_SUBSCRIBED:
                                expect(bc.galacticChannels.size).toEqual(2);
                                expect(bc.privateChannels.size).toEqual(2);

                                // trigger an unsubscription via channel close
                                bus.closeGalacticChannel('happy-puppers', getName(),
                                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false});
                                break;

                            case StompClient.STOMP_UNSUBSCRIBED:
                                bc.sessions.forEach(
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

                bus.api.getGalacticChannel(
                    'happy-puppers',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false},
                    getName(),
                    false);
                bus.api.getGalacticChannel(
                    'naughty-kitties',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false},
                    getName(),
                    false);

                BrokerConnector.fireConnectCommand(bus, config);

            }
        );

        it('check galactic channels can operate against low level messages',

            (done) => {
                let count = 0;
                /*

                This tests that galactic channels operate over low level API's

                 */

                const chan = bus.api.getGalacticChannel(
                    'bouncy-pups',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false},
                    getName(),
                    false);
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('puppy1');
                        count++;
                        if (count === 3) {
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

                spyOn(bc, 'sendPacket').and.callThrough();

                /**
                 * Will check that sendPacket is fired when valid connection sessions exist.
                 */

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.sendGalacticMessage('sometopic', 'hello!');

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(bc.sendPacket).toHaveBeenCalled();
                                        done();
                                    }
                                );
                                break;

                            default:
                                break;
                        }
                    });
                bus.api.getGalacticChannel(
                    'sometopic',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false},
                    getName(),
                    false);
                BrokerConnector.fireConnectCommand(bus, config);
            }
        );


        it('[Public channel] check galactic messages are sent with or without application prefix ',

            (done) => {

                spyOn(log, 'debug').and.callThrough();

                /**
                 * Will check that application prefix is applied if part of config
                 */

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    bus.sendGalacticMessage('sometopic', 'hello!');
                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(log.debug).toHaveBeenCalledWith(
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

                bus.api.getGalacticChannel(
                    'sometopic',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: false},
                    getName(),
                    false);
                BrokerConnector.fireConnectCommand(bus, configApplicationPrefix);
            }
        );

        it('[Private channel] check galactic messages are sent with or without application prefix ',

            (done) => {

                const debugLogMessages: string[] = [];
                spyOn(log, 'debug').and.callFake((msg: string) => {
                    debugLogMessages.push(msg);
                });

                /**
                 * Will check that application prefix is applied if part of config
                 */

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:
                                    bc.privateChannels.set('sometopic', {'somehost:12345somewhere': true});
                                    bus.sendGalacticMessage('sometopic', 'hello!');
                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(log.debug).toHaveBeenCalledTimes(7);
                                            expect(debugLogMessages.indexOf('Sending Galactic Message for session ' +
                                                'anything to destination /dogs/queue/sometopic')).toBeGreaterThan(-1);
                                            done();
                                        }
                                    );
                                    break;

                                default:
                                    break;
                            }
                        });

                bus.api.getGalacticChannel(
                    'sometopic',
                    {brokerIdentity: 'somehost:12345somewhere', isPrivate: true},
                    getName(),
                    false);
                BrokerConnector.fireConnectCommand(bus, configApplicationPrefix);
            }
        );

        it('check galactic channels are not closed if there are no sessions active.',

            (done) => {
                spyOn(log, 'warn').and.callThrough();
                spyOn(log, 'info').and.callThrough();

                /**
                 * Check that galactic channels cannot be closed if topics are no configured
                 */
                const brokerIdentity: ChannelBrokerMapping = {brokerIdentity: 'somehost:12345somewhere', isPrivate: false};
                bus.listenGalacticStream('pop', null, brokerIdentity);
                bus.closeGalacticChannel('pop', null, brokerIdentity);

                bus.api.tickEventLoop(
                    () => {

                        //Added galactic channel to broker subscription requests:
                        expect(log.warn)
                            .toHaveBeenCalledWith(
                            'unable to close galactic channel, no open sessions.', bc.getName());
                        done();
                    }
                );
            }
        );

        it('check that incoming stomp subscriptions are not processed if they are invalid commands',

            (done) => {

                spyOn(log, 'warn').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.listenGalacticStream('pop', null, {brokerIdentity: 'somehost:12345somewhere', isPrivate: false});

                                BrokerConnector.fireSubscriptionCommand(bus,
                                    '123',
                                    'somewhere',
                                    '123456',
                                    StompClient.STOMP_ABORT,
                                    false,
                                    '/topic');


                                bus.api.tickEventLoop(
                                    () => {
                                        expect(log.warn)
                                            .toHaveBeenCalledWith(
                                            'unable to validate inbound subscription message, invalid', bc.getName());
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

                spyOn(log, 'info').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
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
                        expect(log.info).toHaveBeenCalledWith('Connection message 1 of 2 received', bc.getName());

                        // fire second connection from relay.
                        configMultiBroker.connectionSubjectRef.next(true);
                    }, 90
                );
            }
        );

        it('try disconnecting a client when there is no session.',

            () => {

                spyOn(log, 'warn').and.callThrough();
                bc.disconnectClient('ember-pup');
                expect(log.warn)
                    .toHaveBeenCalledWith('unable to disconnect client, ' +
                        'no active session with id: ember-pup', bc.getName());

            }
        );

        it('sendPacket() works with and without the correct headers and session properties.',

            (done) => {

                spyOn(log, 'warn').and.callThrough();
                spyOn(log, 'debug').and.callThrough();
                bc.sendPacket(
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
                expect(log.warn)
                    .toHaveBeenCalledWith('unable to send packet, session is empty', bc.getName());

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:



                                bc.sendPacket(
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
                                expect(log.debug)
                                    .toHaveBeenCalledWith('sendPacket(): adding local broker session ' +
                                    'ID to message: puppy-love', bc.getName());

                                bc.sendPacket(
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
                                expect(log.debug)
                                    .toHaveBeenCalledWith('sendPacket(): message headers already ' +
                                        'contain sessionId', bc.getName());
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

        it('subscribeToDestination() forwards any message sent on galactic channel',

            (done) => {

                spyOn(bc, 'sendPacket').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                bus.listenGalacticStream('space-dogs', null, {brokerIdentity: 'somehost:12345somewhere', isPrivate: false});

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(bc.sendPacket).toHaveBeenCalled();
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

        it('[Public channel] unsubscribeFromDestination() behaves correctly if incorrect session state exists.',

            (done) => {

                spyOn(log, 'warn').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                bc.unsubscribeFromDestination({
                                    session: 'none',
                                    destination: 'none',
                                    id: 'none',
                                    isQueue: false,
                                    brokerPrefix: '/topic'
                                });

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(log.warn)
                                            .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                            'no session found for id: none', bc.getName());
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

        it('[Private channel] unsubscribeFromDestination() behaves correctly if incorrect session state exists.',

            (done) => {

                spyOn(log, 'warn').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    bc.unsubscribeFromDestination({
                                        session: 'none',
                                        destination: 'none',
                                        id: 'none',
                                        isQueue: true,
                                        brokerPrefix: '/queue'
                                    });

                                    bus.api.tickEventLoop(
                                        () => {
                                            bus.sendRequestMessage('space-dogs', 'astro-pups');

                                        }, 10
                                    );

                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(log.warn)
                                                .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                                    'no session found for id: none', bc.getName());
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

        it('[Public channel] unsubscribeFromDestination() behaves correctly if no galactic subscriptions can be found.',

            (done) => {

                spyOn(log, 'warn').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                    (command: StompBusCommand) => {

                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:

                                bc.unsubscribeFromDestination(
                                    {
                                        session: 'puppy-love',
                                        destination: 'none',
                                        id: 'none',
                                        isQueue: false,
                                        brokerPrefix: '/topic'
                                    }
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        bus.sendRequestMessage('space-dogs', 'astro-pups');

                                    }, 10
                                );

                                bus.api.tickEventLoop(
                                    () => {
                                        expect(log.warn)
                                            .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                            'no galactic subscription found for id: puppy-love', bc.getName());
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

        it('[Private channel] unsubscribeFromDestination() behaves correctly if no galactic subscriptions can be found.',

            (done) => {

                spyOn(log, 'warn').and.callThrough();

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    bc.unsubscribeFromDestination(
                                        {
                                            session: 'puppy-love',
                                            destination: 'none',
                                            id: 'none',
                                            isQueue: true,
                                            brokerPrefix: '/queue'
                                        }
                                    );

                                    bus.api.tickEventLoop(
                                        () => {
                                            bus.sendRequestMessage('space-dogs', 'astro-pups');

                                        }, 10
                                    );

                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(log.warn)
                                                .toHaveBeenCalledWith('unable to unsubscribe, ' +
                                                    'no galactic subscription found for id: puppy-love', bc.getName());
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

        it('Make sure the reconnect timer triggers when socket is closed.',

            (done) => {
                bc.reconnectDelay = 50;
                bc.connectDelay = 30;

                spyOn(log, 'warn').and.callThrough();
                spyOn(log, 'info').and.callThrough();

                const fireClose  = () => {
                    bc.sessions.forEach(
                        (session: StompSession) => {
                            const socket = session.client.clientSocket as MockSocket;
                            socket.triggerEvent('close');
                        }
                    );
                };

                bus.listenStream(BrokerConnectorChannel.status)
                    .handle(
                        (command: StompBusCommand) => {

                            switch (command.command) {
                                case StompClient.STOMP_CONNECTED:

                                    fireClose();

                                    bus.api.tickEventLoop(
                                        () => {
                                            fireClose();
                                        }, 10
                                    );

                                    bus.api.tickEventLoop(
                                        () => {
                                            expect(log.warn)
                                                .toHaveBeenCalledWith(
                                                    'WebSocket to broker closed!', bc.getName());

                                            expect(log.info)
                                                .toHaveBeenCalledWith(
                                                    'Starting re-connection timer', bc.getName());

                                            expect(log.warn)
                                                .toHaveBeenCalledWith(
                                                    'Trying to reconnect to broker....', bc.getName());

                                            done();


                                        }, 80
                                    );
                                    break;

                                default:
                                    break;
                            }
                        });
                BrokerConnector.fireConnectCommand(bus, config);

            }
        );

    });

    describe('Multi-broker handling', () => {
        it('We should see an error to specify target broker while opening a galactic channel if more than one broker is found', (done) => {
            const config2 = createStandardConfig(true, false, null, null, 'anotherhost');
            spyOn(bus.logger, 'error').and.callThrough();
            let counter = 0;
            bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.markChannelAsGalactic('chan');
                                counter++;
                                if (counter === 2) {
                                    bus.api.tickEventLoop(() => {
                                        expect(bus.logger.error).toHaveBeenCalledWith('More than one STOMP session was detected ' +
                                            'when trying to open galactic channel \'chan\'. You need to explicitly specify the target ' +
                                            'fabric broker in the second argument to bus.markChannelAsGalactic()');
                                        done();
                                    }, 10);
                                }

                                break;
                        }
                    });

            BrokerConnector.fireConnectCommand(bus, config);
            BrokerConnector.fireConnectCommand(bus, config2);
        });

        it('We should see an error to specify target broker while closing a galactic channel if more than one broker is found', (done) => {
            const config2 = createStandardConfig(true, false, null, null, 'anotherhost');
            spyOn(bus.logger, 'error').and.callThrough();
            let counter = 0;
            bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                counter++;
                                if (counter === 2) {
                                    bc.galacticChannels.set('chan', {connectedBrokers: 2});
                                    bus.markChannelAsLocal('chan');
                                    bus.api.tickEventLoop(() => {
                                        expect(bus.logger.error).toHaveBeenCalledWith('More than one STOMP session was detected ' +
                                            'when trying to close galactic channel \'chan\'. You need to explicitly specify the target ' +
                                            'fabric broker in the second argument to bus.markChannelAsLocal()');
                                        done();
                                    }, 10);
                                }

                                break;
                        }
                    });

            BrokerConnector.fireConnectCommand(bus, config);
            BrokerConnector.fireConnectCommand(bus, config2);
        });

        it('Galactic channel \'chan\' should be closed and destroyed if there is no broker connected', (done) => {
            spyOn(bus.logger, 'error').and.callThrough();
            bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.markChannelAsGalactic('chan');
                                bus.markChannelAsLocal('chan');
                                bus.api.tickEventLoop(() => {
                                    expect(bc.galacticChannels.get('chan')).toBeUndefined();
                                    done();
                                }, 10);

                                break;
                        }
                    });

            BrokerConnector.fireConnectCommand(bus, config);
        });

        it('Should throw a warning when attempting to close galactic channel where no broker session is found', (done) => {
            const config2 = createStandardConfig(true, false, null, null, 'anotherhost');
            spyOn(bus.logger, 'warn').and.callThrough();
            let counter = 0;
            bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                counter++;
                                if (counter === 2) {
                                    for (let s of bc.sessions.values()) {
                                        bc.disconnectClient(s.id);
                                    }

                                    bc.galacticChannels.set('chan', {connectedBrokers: 0});
                                    bus.markChannelAsLocal('chan');
                                    bus.api.tickEventLoop(() => {
                                        expect(bus.logger.warn).toHaveBeenCalledWith('No session registered');
                                        bc.galacticChannels.delete('chan');
                                        done();
                                    }, 10);
                                }
                                break;
                        }
                    });

            BrokerConnector.fireConnectCommand(bus, config);
            BrokerConnector.fireConnectCommand(bus, config2);
        });
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
    applicationPrefix?: string,
    host: string = 'somehost',
    port: number = 12345,
    endpoint: string = 'somewhere'): StompConfig {
    let configuration = new StompConfig(
        endpoint,
        host,
        port,
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
    configuration.queueLocation = '/queue';
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


