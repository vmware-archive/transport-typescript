import {StompClient} from './stomp.client';
import {Subject} from 'rxjs';
import {StompParser} from './stomp.parser';
import {Syslog} from '../log/syslog';
import {StompMessage, StompConfig} from './stomp.model';


describe('Stomp Client [stomp.client]', () => {


    let client: StompClient;
    let config: StompConfig;
    let connected: Subject<Boolean>;
    let subId: string;
    let testDestination: string = 'test';

    beforeEach(() => {
        config = new StompConfig(
            'spogglepop',
            'nowhere',
            12345,
            'user',
            'password',
            false,
            false
        );
        config.testMode = true;
        client = new StompClient();
        client.useMockSocket();
        subId = StompParser.genUUID();
        Syslog.silent(true);
    });


    describe('Given we can import the client', () => {

        it('We should be able to instantiate it',
            (done) => {
                expect(client).not.toBeNull();
                expect(client.socketConnectedObserver).not.toBeNull();
                expect(client.socketOpenObserver).toBeNull();
                expect(client.socketMessageObserver).toBeNull();
                expect(client.socketCloseObserver).toBeNull();
                expect(client.socketErrorObserver).toBeNull();
                expect(client.socketACKObserver).not.toBeNull();
                expect(client.socketSubscriptionObserver).not.toBeNull();
                done();
            }
        );

        it('We should be able to connect',
            (done) => {

                connected = client.connect(config);

                expect(connected).not.toBeNull();
                connected.subscribe(
                    () => {
                        expect(client.socketConnectedObserver).toBeDefined();
                        expect(client.socketOpenObserver).toBeDefined();
                        expect(client.socketCloseObserver).toBeDefined();
                        expect(client.socketMessageObserver).toBeDefined();
                        expect(client.socketErrorObserver).toBeDefined();
                        expect(client.socketACKObserver).toBeDefined();
                        done();
                    }
                );
            }
        );

        it('We should be able to disconnect',
            (done) => {
                let connection = client.connect(config);
                connection.subscribe(
                    () => {
                        // subscribe, but ignore the subject
                        client.subscribeToDestination(testDestination, subId);
                        client.disconnect();
                    },
                    () => expect(false).toBeTruthy(), // should never hit.
                    () => {
                        expect(false).toBeTruthy();
                        done();
                    }
                );
                client.socketCloseObserver
                    .subscribe(
                        () => {
                            expect(true).toBeTruthy();
                            done();
                        });
            }
        );

        it('We should not be able to send a message if the socket is in the wrong state',
            (done) => {
                let connStream = client.connect(config);
                connStream.subscribe(
                    () => {
                        client.subscribeToDestination(testDestination, subId)
                            .subscribe(
                                () => {
                                    expect(false).toBeTruthy();
                                    done();
                                },
                                () => {
                                    expect(true).toBeTruthy(); // should hit on error
                                    done();
                                }
                            );

                        client.clientSocket.socketState = WebSocket.CLOSED;
                        client.send(testDestination, {'subscription': subId}, '1234');
                    }
                );
            }
        );

        it('We should not be able to send messages if we are not connected',
            (done) => {
                expect(client.send(testDestination)).toBeFalsy();

                client.connect(config);
                expect(client.send(testDestination)).toBeTruthy();
                done();
            }
        );

        it('We should not be able to open more than a single socket per client',
            (done) => {
                let conn1 = client.connect(config);
                let conn2 = client.connect(config);
                let conn3 = client.connect(config);
                let conn4 = client.connect(config);
                expect(conn1 === conn2).toBeTruthy();
                expect(conn2 === conn3).toBeTruthy();
                expect(conn3 === conn4).toBeTruthy();

                conn1.subscribe(
                    () => {
                        conn1 = client.connect(config);
                        conn2 = client.connect(config);
                        conn3 = client.connect(config);
                        conn4 = client.connect(config);
                        expect(conn1 === conn2).toBeTruthy();
                        expect(conn2 === conn3).toBeTruthy();
                        expect(conn3 === conn4).toBeTruthy();
                        done();
                    }
                );
            }
        );
    });

    describe('Given we can connect we connect', () => {

        it('We should be able to receive connection events',
            (done) => {
                let connection = client.connect(config);
                connection.subscribe(
                    () => {
                        expect(true).toBeTruthy();
                        done();
                    }
                );
            }
        );

        it('We should be able to receive error events',
            (done) => {
                client.connect(config).subscribe();
                client.socketErrorObserver.subscribe(
                    () => {
                        expect(true).toBeTruthy();
                        done();
                    }
                );
                client.clientSocket.triggerEvent('error', [true]);
            }
        );
    });

    describe('Given we can connect we connect and receive events', () => {

        it('We should be able send array buffer as string',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe((msg: StompMessage) => {
                    expect(msg.body).toEqual('binary fun in the sun');
                    done();
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        client.send(testDestination, {subscription: subId},
                            StompParser.stringToArrayBuffer('binary fun in the sun'));
                    }
                );
            }
        );

        it('We should be able process an array buffer if triggered by the user',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe((msg: StompMessage) => {
                    expect(msg.body).toEqual('what a lovely buffer');
                    done();
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        let binMessage = StompParser.marshal(
                            StompClient.STOMP_MESSAGE, {subscription: subId},
                            StompParser.stringToArrayBuffer('what a lovely buffer'));

                        client.clientSocket.triggerEvent('message', [{data: binMessage}]);
                    }
                );
            }
        );

        it('We should be able process an array buffer if triggered by the socket',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe((msg: StompMessage) => {
                    expect(msg.body).toEqual('what a buffery text buffer');
                    done();
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {
                        let newMessage = {
                            command: StompClient.STOMP_MESSAGE,
                            headers: {subscription: subId},
                            body: 'what a buffery text buffer',
                        };

                        client.clientSocket.triggerEvent('message',
                            [
                                {
                                    data: StompParser.stringToArrayBuffer(
                                        StompParser.marshal(
                                            newMessage.command,
                                            newMessage.headers,
                                            newMessage.body
                                        ))
                                }
                            ]
                        );
                    }
                );
            }
        );

        it('We should be able to subscribe successfully',
            (done) => {
                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    (message: StompMessage) => {
                        expect(message.command).toEqual(StompClient.STOMP_SUBSCRIBE);
                        done();
                    }
                );
            }
        );

        it('We should be able to unsubscribe successfully',
            (done) => {

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId)
                        .subscribe(
                            () => {
                                expect(false).toBeTruthy();
                            },
                            () => {
                                expect(false).toBeTruthy();
                            },
                            () => {
                                expect(true).toBeTruthy();
                                done();
                            }
                        );
                });
                client.socketSubscriptionObserver.subscribe(
                    () => {
                        expect(true).toBeTruthy(); // should hit
                        client.unsubscribeFromDestination(subId);
                    }
                );
            }
        );

        it('We should be able to subscribe to a destination without an additional STOMP request',
            (done) => {

                client.connect(config).subscribe(() => {
                    spyOn(client.clientSocket, 'send').and.callThrough();
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        expect(client.clientSocket.send).toHaveBeenCalled();

                        client.subscribeToDestination(testDestination, subId);

                        expect(client.clientSocket.send.calls.count()).toEqual(1);

                        client.subscribeToDestination(testDestination, subId);
                        expect(client.clientSocket.send.calls.count()).toEqual(1);
                        done();
                    }
                );
            }
        );
    });

    describe('Given we subscribe/unsubscribe with success', () => {

        it('We should be able to send a transaction and get a receipt using a generated id',
            (done) => {

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        let headers = {receipt: 'abc123', 'subscription': subId};
                        let tx = client.beginTransaction('def456', headers);

                        if (tx.receiptObservable) {
                            tx.receiptObservable.subscribe(
                                (message: StompMessage) => {
                                    expect(message.headers['receipt-id']).toEqual('abc123');
                                    done();
                                }
                            );
                        }
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '1');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '2');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '3');
                        tx.commit();
                    }
                );
            }
        );

        it('We should be able to send a transaction and get a receipt using a random ID',
            (done) => {

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        let headers = {'subscription': subId};
                        let tx = client.beginTransaction('def456', headers);
                        let receiptId = tx.receiptId;
                        if (tx.receiptObservable) {
                            tx.receiptObservable.subscribe(
                                (message: StompMessage) => {
                                    expect(message.headers['receipt-id']).toEqual(receiptId);
                                    done();
                                }
                            );
                        }
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '1');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '2');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '3');
                        tx.commit();
                    }
                );
            }
        );

        it('We should be able to send a transaction and get a receipt and fire off an ACK',
            (done) => {

                config = new StompConfig(
                    'chibbleslip',
                    'nowhere',
                    12345,
                    'user',
                    'password',
                    false,
                    true
                );
                config.testMode = true;

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketACKObserver.subscribe(
                    (message: StompMessage) => {
                        expect(message.headers['id']).toEqual('jruw782');
                        done();
                    }
                );

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        let headers = {receipt: 'jruw782', 'subscription': subId};
                        let tx = client.beginTransaction('def456', headers);

                        if (tx.receiptObservable) {
                            tx.receiptObservable.subscribe(
                                (message: StompMessage) => {
                                    expect(message.headers['receipt-id']).toEqual('jruw782');
                                }
                            );
                        }
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '1');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '2');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '3');
                        tx.commit();
                    }
                );
            }
        );

        it('We should be able to cancel a transaction',
            (done) => {

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    () => {
                        let headers = {receipt: '88dgab', subscription: subId};
                        let tx = client.beginTransaction('bvvbsg8271', headers);

                        spyOn(client, 'abort').and.callThrough();

                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '5');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '6');
                        client.send(testDestination, {transaction: tx.id, subscription: subId}, '7');
                        tx.abort();

                        expect(client.abort).toHaveBeenCalled();
                        done();
                    }
                );
            }
        );
    });


    describe('Given we can commit and abort transactions', () => {

        it('We should be able to request and respond to ACK requests',
            (done) => {

                config = new StompConfig(
                    'slappochip',
                    'nowhere',
                    12345,
                    'user',
                    'password',
                    false,
                    true
                );
                config.testMode = true;

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketACKObserver.subscribe(
                    (message: StompMessage) => {
                        expect(message.headers['id']).toEqual('tangopuppy123');
                        done();
                    }
                );

                client.socketSubscriptionObserver.subscribe(
                    (message: StompMessage) => {
                        let newMessage = {
                            command: StompClient.STOMP_MESSAGE,
                            headers: {'message-id': 'tangopuppy123', subscription: subId},
                            body: 'can you ack it mate?',
                        };

                        client.clientSocket.triggerEvent('message',
                            [
                                {
                                    data: StompParser.marshal(
                                        newMessage.command,
                                        newMessage.headers,
                                        newMessage.body
                                    )
                                }
                            ]
                        );
                    }
                );
            }
        );

        it('We should be able to handle STOMP errors via an echo',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe(
                    () => expect(true).toBeFalsy(), // should not hit
                    (error: StompMessage) => {
                        expect(error.command === StompClient.STOMP_ERROR);
                        expect(error.body === 'computer said no.');
                        done();
                    }
                );

                client.socketSubscriptionObserver.subscribe(
                    () => {

                        let binMessage = StompParser.marshal(
                            StompClient.STOMP_ERROR, {'error-header': 'yellowduck123', subscription: subId},
                            StompParser.stringToArrayBuffer('computer said no.'));

                        client.clientSocket.send(binMessage);
                    }
                );
            }
        );

        it('We should be able to handle STOMP errors via a server event',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe(
                    () => expect(true).toBeFalsy(), // should not hit
                    (error: StompMessage) => {
                        expect(error.command === StompClient.STOMP_ERROR);
                        expect(error.body === 'computer said no.');
                        done();
                    }
                );

                client.socketSubscriptionObserver.subscribe(
                    () => {
                        let binMessage = StompParser.marshal(StompClient.STOMP_ERROR,
                            {'error-header': 'yellowduck123', subscription: subId},
                            StompParser.stringToArrayBuffer('computer said no.'));

                        client.clientSocket.triggerEvent('error', [{data: binMessage}]);
                    }
                );
            }
        );
    });

    describe('Given we are able to operate normally', () => {

        it('The client should be able to handle error conditions and out of sequence events',
            (done) => {

                client.connect(config).flatMap(() => {
                    return client.subscribeToDestination(testDestination, subId);
                }).subscribe();

                client.socketSubscriptionObserver.subscribe(
                    () => {
                        client.disconnect(); // disconnect without unsubscribe\
                    }
                );

                // send should fail, we closed the socket.
                client.socketCloseObserver
                    .subscribe(
                        () => {
                            expect(client.send(testDestination, {}, 'what a nice hat')).toBeFalsy();
                            done();
                        }
                    );
            }
        );

        it('We should be able to receive error events',
            (done) => {
                client.connect(config).subscribe();
                client.socketErrorObserver.subscribe(
                    () => {
                        expect(true).toBeTruthy();
                        done();
                    }
                );
                client.clientSocket.triggerEvent('error', [true]);
            }
        );

        it('The client send heartbeats if configured',
            (done) => {

                config = new StompConfig(
                    'slappochip',
                    'nowhere',
                    12345,
                    'user',
                    'password',
                    false,
                    true,
                    0,
                    150
                );

                config.testMode = true;

                spyOn(client, 'sendHeartbeat')
                    .and
                    .callThrough();

                client.connect(config).subscribe(() => {
                    client.subscribeToDestination(testDestination, subId);
                });

                client.socketSubscriptionObserver.subscribe(
                    (message: StompMessage) => {
                        expect(message.command).toEqual(StompClient.STOMP_SUBSCRIBE);
                    }
                );

                setTimeout(() => {

                    // should have fired three heartheats.
                    expect(client.sendHeartbeat).toHaveBeenCalledTimes(3);
                    done();

                }, 500);
            }
        );


    });
});

