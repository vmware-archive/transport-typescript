/**
 * Copyright(c) VMware Inc., 2016,2017
 */
import {inject, TestBed} from '@angular/core/testing';
import {Injector} from '@angular/core';

import {Syslog} from '../log/syslog';
import {LogUtil} from '../log/util';
import {LogLevel} from '../log/logger.model';
import {Message, MessageResponder, MessageType} from './message.model';
import {MessagebusService} from './index';
import {Observable} from 'rxjs/Observable';

//import {BifrostModule} from '../bifrost.module';

/**
 * This is the unit test for the MessagebusService.
 */

// beforeEach(function () {
//     TestBed.configureTestingModule({
//         imports: [BifrostModule.forRoot()]
//     });
// });

function makeCallCountCaller(done: any, targetCount: number): any {
    let count = 0;
    return () => {
        count += 1;
        if (count === targetCount) {
            done();
        }
    };
}

function getName(): string {
    return 'messagebus.service.spec';
}


describe('Messagebus Service [messagebus.service]', () => {
    const testChannel = '#local-channel';
    const testData = {
        name: 'test-name'
    };

    const testMessage = 'Test String';
    const tag = '[' + getName() + ']: ';
    const response = tag + testMessage;

    let bus: MessagebusService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Map,
                MessagebusService,
            ]
        });
    });

    beforeEach(inject([Injector], (injector: Injector) => {
        bus = injector.get(MessagebusService);
        bus.silenceLog(true);
        bus.suppressLog(true);
    }));

    it('Should check messageLogging', () => {
        bus.messageLog(testMessage, getName());
        expect(bus.logger()
            .last())
            .toBe(response);
        bus.setLogLevel(LogLevel.Off);
        expect(bus.logger().logLevel)
            .toBe(LogLevel.Off);
        bus.enableMonitorDump(true);
        expect(bus.isLoggingEnabled)
            .toBeTruthy();
        bus.enableMonitorDump(false);
        expect(bus.isLoggingEnabled)
            .toBeFalsy();
    });

    it('Should cause a new Channel to be instantiated', () => {
        let channel = bus.getChannel(testChannel, getName());
        expect(channel)
            .not
            .toBeUndefined();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.getName())
            .toBe('MessagebusService');
        expect(bus.enableMonitorDump(true))
            .toBeTruthy();
        expect(bus.getMonitor())
            .not
            .toBeUndefined();

        bus.enableMonitorDump(false);
        expect(bus.send(testChannel, new Message().request('*data*'), getName()))
            .toBeTruthy();

        bus.getChannel(testChannel, getName());
        expect(bus.refCount(testChannel))
            .toBe(2);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.refCount(testChannel))
            .toBe(-1);
    });

    it('Should cause a new Request Channel to be instantiated', () => {
        let channel = bus.getRequestChannel(testChannel, getName());
        expect(channel)
            .not
            .toBeUndefined();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.getName())
            .toBe('MessagebusService');
        expect(bus.enableMonitorDump(true))
            .toBeTruthy();
        expect(bus.getMonitor())
            .not
            .toBeUndefined();

        bus.enableMonitorDump(false);
        expect(bus.send(testChannel, new Message().request('*data*'), getName()))
            .toBeTruthy();

        bus.getChannel(testChannel, getName());
        expect(bus.refCount(testChannel))
            .toBe(2);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.refCount(testChannel))
            .toBe(-1);
    });

    it('Should fail to communicate with a closed channel', () => {
        bus.getChannel(testChannel, getName());
        bus.increment(testChannel);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.send(testChannel, new Message().request(testData), getName()))
            .toBeFalsy();
        expect(bus.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
    });

    it('Should fail to communicate with a completed channel', () => {
        bus.getChannel(testChannel, getName());
        expect(bus.complete(testChannel, getName()))
            .toBeTruthy();
        expect(bus.send(testChannel, new Message().request(testData), getName()))
            .toBeFalsy();
        expect(bus.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.complete(testChannel, getName()))
            .toBeFalsy();
    });

    it('Should return same Channel for a new subscriber', () => {
        let channel = bus.getChannelObject(testChannel, getName());
        let channel2 = bus.getChannelObject(testChannel, getName());

        expect(channel)
            .not
            .toBeUndefined();

        expect(channel2)
            .not
            .toBeUndefined();

        expect(channel)
            .toBe(channel2);
    });

    it('Should send and receive data over the message bus', (done) => {
        let channel = bus.getRequestChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                expect(message.payload)
                    .toBe(testData);
                bus.close(testChannel, getName());
                expect(bus.close(testChannel, getName()))
                    .toBeFalsy();
                done();
            }
        );

        expect(bus.send(testChannel, new Message().request(testData), getName()))
            .toBeTruthy();
    });

    it('Should send and receive error over the message bus', (done) => {
        let channel = bus.getErrorChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                expect(message.isError())
                    .toBeTruthy();
                expect(message.payload)
                    .toBe(testData);
                done();
            }
        );

        expect(bus.send(testChannel, new Message().error(testData), getName()))
            .toBeTruthy();
    });

    it('Should fail to send data over the message bus (negative test)', () => {
        expect(bus.send('nonexistent-Channel', new Message().request(testData), getName()))
            .toBeFalsy();
    });

    it('Should send and receive an error over the message bus', (done) => {
        let channel = bus.getChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                Syslog.error('Unexpected data received: ' + LogUtil.pretty(message), getName());
            },

            (error: any) => {
                expect(error)
                    .toBe(testData);
                done();
            }
        );

        expect(bus.error(testChannel, testData))
            .toBeTruthy();
    });

    it('Should fail to send error over the message bus (negative test)', () => {
        expect(bus.error('nonexistent-Channel', testData))
            .toBeFalsy();
    });

    it('Should send data over the message bus to 2 subscribers (one-to-many)', (done) => {
        let doneCaller = makeCallCountCaller(done, 2);

        let channel = bus.getResponseChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                expect(message.payload)
                    .toBe(testData);
                doneCaller();
            }
        );

        let channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(
            (message: Message) => {
                expect(message.payload)
                    .toBe(testData);
                doneCaller();
            }
        );

        expect(bus.send(testChannel, new Message().response(testData), getName()))
            .toBeTruthy();
    });

    it('Should send an error over the message bus to 2 subscribers (one-to-many)', (done) => {
        let doneCaller = makeCallCountCaller(done, 2);

        let channel = bus.getChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                Syslog.error('Channel1: Unexpected data received: ' + LogUtil.pretty(message), getName());
            },

            (error: any) => {
                expect(error)
                    .toBe(testData);
                doneCaller();
            }
        );

        let channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(
            (message: Message) => {
                Syslog.error('Channel2: Unexpected data received: ' + LogUtil.pretty(message), getName());
            },

            (error: any) => {
                expect(error)
                    .toBe(testData);
                doneCaller();
            }
        );

        expect(bus.error(testChannel, testData))
            .toBeTruthy();
    });

    it('Should send a completion over the message bus to 2 subscribers (one-to-many)', (done) => {
        let doneCaller = makeCallCountCaller(done, 2);

        let channel = bus.getChannel(testChannel, getName());
        channel.subscribe(
            (message: Message) => {
                Syslog.error('Channel1: Unexpected data received: ' + LogUtil.pretty(message), getName());
            },

            (error: any) => {
                Syslog.error('Channel1: Unexpected error received: ' + LogUtil.pretty(error), getName());
            },

            () => {
                Syslog.debug('Channel1: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        let channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(
            (message: Message) => {
                Syslog.error('Channel2: Unexpected data received: ' + LogUtil.pretty(message), getName());
            },

            (error: any) => {
                Syslog.error('Channel2: Unexpected error received: ' + LogUtil.pretty(error), getName());
            },

            () => {
                Syslog.debug('Channel2: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        expect(bus.complete(testChannel, getName()))
            .toBeTruthy();
    });

    it('Should fail to send completion over the message bus (negative test)', () => {
        expect(bus.complete('nonexistent-Channel', getName()))
            .toBeFalsy();
    });

    /**
     * New Simple API Tests.
     */
    describe('Simple API Tests', () => {

        it('respondOnce() and requestOnce()',
            (done) => {

                bus.respondOnce(testChannel)
                    .generate(
                        (request: string) => {
                            expect(request).toEqual('strawbarita');
                            return 'margarita';
                        }
                    );

                bus.requestOnce(testChannel, 'strawbarita')
                    .handle(
                        (resp: string) => {
                            expect(resp).toEqual('margarita');
                            done();
                        }
                    );
            }
        );


        it('respondOnce() and requestOnce() on differing request/response channels.',
            (done) => {

                bus.respondOnce(testChannel, '#some-different-return')
                    .generate(
                        (request: string) => {
                            expect(request).toEqual('magnum');
                            return 'maggie';
                        }
                    );

                bus.requestOnce(testChannel, 'magnum', '#some-different-return')
                    .handle(
                        (resp: string) => {
                            expect(resp).toEqual('maggie');
                            done();
                        }
                    );
            }
        );

        it('request once with a different return channel',
            (done) => {

                const channel1 = '#test-channel1';
                const channel2 = '#test-channel2';

                bus.listenRequestOnce(channel1)
                    .handle(
                        (request: string) => {
                            expect(request).toEqual('strawbarita');
                            bus.sendResponse(channel2, 'margarita');
                        }
                    );

                bus.requestOnce(channel1, 'strawbarita', channel2)
                    .handle(
                        (resp: string) => {
                            expect(resp).toEqual('margarita');
                            done();
                        }
                    );
            }
        );

        it('request stream with a different return channel',
            (done) => {

                const channel1 = '#test-channel1';
                const channel2 = '#test-channel2';

                const handler1 = bus.listenRequestStream(channel1);
                const sub1 = handler1.handle(
                    (request: string) => {
                        expect(request).toEqual('strawbarita');
                        bus.sendResponse(channel2, 'margarita');
                        sub1.unsubscribe();
                    }
                );
                const handler2 = bus.requestStream(channel1, 'strawbarita', channel2);
                const sub2 = handler2.handle(
                    (resp: string) => {
                        expect(resp).toEqual('margarita');
                        sub2.unsubscribe();
                        done();
                    }
                );
            }
        );

        it('respondStream() and requestStream()',
            (done) => {

                let responder = bus.respondStream(testChannel);

                responder.generate(
                    (request: number) => {
                        return ++request;
                    }
                );

                let requester = bus.requestStream(testChannel, 1);

                requester.handle(
                    (resp: number) => {
                        if (resp < 10) {
                            // loop the response back through the channel
                            // so the responder can increment it.
                            requester.tick(resp);
                        } else {
                            expect(resp).toEqual(10);

                            requester.close();
                            responder.close();

                            // check if susbcriptions are closed.
                            expect(requester.isClosed()).toBeTruthy();
                            expect(responder.isClosed()).toBeTruthy();
                            done();
                        }
                    }
                );

            }
        );

        it('listenOnce() [ listen for a single response ]',
            (done) => {

                let c: number = 0;
                let h: number = 0;

                let sub = bus.listenOnce(testChannel)
                    .handle(
                        () => {
                            h++;
                        }
                    );

                let chan = bus.getResponseChannel(testChannel, 'listenOnce()');
                chan.subscribe(
                    () => {
                        c++;
                        if (c >= 10) {
                            expect(h).toEqual(1);
                            expect(sub.closed).toBeTruthy();
                            done();
                        }
                    }
                );

                bus.sendResponseMessage(testChannel, 'C');
                bus.sendResponseMessage(testChannel, 'A');
                bus.sendResponseMessage(testChannel, 'K');
                bus.sendResponseMessage(testChannel, 'E');
                bus.sendResponseMessage(testChannel, 'P');
                bus.sendResponseMessage(testChannel, 'A');
                bus.sendResponseMessage(testChannel, 'R');
                bus.sendResponseMessage(testChannel, 'T');
                bus.sendResponseMessage(testChannel, 'Y');
                bus.sendResponseMessage(testChannel, '!');
            }
        );

        it('listenStream() [ listen for multiple response messages on channel ]',
            (done) => {

                let h: number = 0;

                bus.listenStream(testChannel)
                    .handle(
                        () => {
                            h++;
                            if (h === 4) {
                                expect(true).toBeTruthy();
                                done();
                            }
                        }
                    );

                bus.sendResponseMessage(testChannel, 'B');
                bus.sendRequestMessage(testChannel, 'E');
                bus.sendRequestMessage(testChannel, 'R');
                bus.sendRequestMessage(testChannel, 'R');
                bus.sendRequestMessage(testChannel, 'Y');
                bus.sendRequestMessage(testChannel, 'M');
                bus.sendRequestMessage(testChannel, 'A');
                bus.sendRequestMessage(testChannel, 'D');
                bus.sendResponseMessage(testChannel, 'N');
                bus.sendResponseMessage(testChannel, 'E');
                bus.sendRequestMessage(testChannel, 'S');
                bus.sendRequestMessage(testChannel, 'S');
                bus.sendResponseMessage(testChannel, '!');
            }
        );

        it('listenRequestOnce() [listen to a single request]',
            (done) => {

                let c: number = 0;
                let h: number = 0;

                let sub = bus.listenRequestOnce(testChannel)
                    .handle(
                        () => {
                            h++;
                        }
                    );

                let chan = bus.getRequestChannel(testChannel, 'listenRequestOnce()');
                chan.subscribe(
                    () => {
                        c++;
                        if (c >= 5) {
                            expect(h).toEqual(1);
                            expect(sub.closed).toBeTruthy();
                            done();
                        }
                    }
                );

                bus.sendRequestMessage(testChannel, 'B');
                bus.sendRequestMessage(testChannel, 'U');
                bus.sendRequestMessage(testChannel, 'N');
                bus.sendRequestMessage(testChannel, 'N');
                bus.sendRequestMessage(testChannel, 'Y');
            }
        );

        it('listenRequestStream() [ listen for multiple request messages on a channel ]',
            (done) => {

                let h: number = 0;

                bus.listenRequestStream(testChannel)
                    .handle(
                        () => {
                            h++;
                            if (h === 4) {
                                expect(true).toBeTruthy();
                                done();
                            }
                        }
                    );

                bus.sendResponseMessage(testChannel, 'F');
                bus.sendResponseMessage(testChannel, 'R');
                bus.sendResponseMessage(testChannel, 'A');
                bus.sendResponseMessage(testChannel, 'G');
                bus.sendResponseMessage(testChannel, 'G');
                bus.sendRequestMessage(testChannel, 'L');
                bus.sendResponseMessage(testChannel, 'E');
                bus.sendRequestMessage(testChannel, 'R');
                bus.sendRequestMessage(testChannel, 'O');
                bus.sendRequestMessage(testChannel, 'C');
                bus.sendResponseMessage(testChannel, 'K');
            }
        );

        it('sendRequest() [ simple API wrapper for sending request messages (wraps MessageHandlerConfig) ]',
            (done) => {

                bus.listenRequestOnce(testChannel)
                    .handle(
                        (msg: string) => {
                            expect(msg).toEqual('Cotton');
                            done();
                        }
                    );
                bus.sendRequest(testChannel, 'Cotton');
            }
        );

        it('sendResponse() [ simple API wrapper for sending response messages (wraps MessageHandlerConfig) ]',
            (done) => {

                bus.listenOnce(testChannel)
                    .handle(
                        (msg: string) => {
                            expect(msg).toEqual('Fox');
                            done();
                        }
                    );
                bus.sendResponse(testChannel, 'Fox');
            }
        );

        it('sendRequestMessage() [ lower level wrapper for sending request messages ]',
            (done) => {

                let _chan = bus.getRequestChannel(testChannel, 'sendRequestMessage()');
                let p = _chan.subscribe(
                    (m: Message) => {
                        expect(m.payload).toEqual('Maggie');
                        p.unsubscribe();
                        done();
                    }
                );

                bus.sendRequestMessage(testChannel, 'Maggie');
            }
        );

        it('sendResponseMessage() [ lower level wrapper for sending response messages ]',
            (done) => {

                let _chan = bus.getResponseChannel(testChannel, 'sendResponseMessage()');
                let p = _chan.subscribe(
                    (m: Message) => {
                        expect(m.payload).toEqual('Chickie');
                        p.unsubscribe();
                        done();
                    }
                );

                bus.sendResponseMessage(testChannel, 'Chickie');
            }
        );

        it('sendErrorMessage() [ lower level wrapper for sending error messages ]',
            (done) => {

                let _chan = bus.getChannel(testChannel, 'sendErrorMessage()');
                let p = _chan.subscribe(
                    (m: Message) => {
                        expect(m.payload).toEqual('Puppy Error');
                        expect(m.isError()).toBeTruthy();
                        p.unsubscribe();
                        done();
                    }
                );

                bus.sendErrorMessage(testChannel, 'Puppy Error');
            }
        );

        it('Should be able to mix old and new APIs together [sendRequest() and subscribe()]',
            (done) => {


                let chan = bus.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('tea');
                        done();
                    }
                );

                bus.sendRequest(testChannel, 'tea');

            }
        );

        it('Should be able to mix old and new APIs together [send() and listenOnce()]',
            (done) => {


                // message should come through already unpacked.
                bus.listenRequestOnce(testChannel)
                    .handle(
                        (msg: string) => {
                            expect(msg).toEqual('Chickie');
                            done();
                        }
                    );

                // message is sent using traditional API.
                bus.send(testChannel, new Message().request('Chickie'), 'mixOldAndNew');

            }
        );

        it('Should be able to mix old and new APIs together [requestOnce(), subscribe(), sendResponse()]',
            (done) => {

                let chan = bus.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('bikes');
                        bus.sendResponse(testChannel, 'cars');
                    }
                );

                bus.requestOnce(testChannel, 'bikes')
                    .handle(
                        (msg: string) => {
                            expect(msg).toEqual('cars');
                            done();
                        }
                    );


            }
        );

        it('Should be able to mix old and new APIs together [requestStream(), subscribe(), sendResponse()]',
            (done) => {

                let chan = bus.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toBeGreaterThan(0);
                        expect(msg.payload).toBeLessThan(10);
                        let val = msg.payload;

                        // increment by one and fire back a response.
                        bus.sendResponse(testChannel, ++val);
                    }
                );

                let stream = bus.requestStream(testChannel, 1);
                stream.handle(
                    (val: number) => {
                        if (val <= 9) {
                            // send the value right back down the stream again as another request.
                            stream.tick(val);
                            return;
                        }
                        expect(val).toEqual(10);
                        stream.close();
                        done();
                    }
                );


            }
        );

        it('Should be able to mix old and new APIs together [respondOnce(), send(), subscribe()]',
            (done) => {

                let chan = bus.getResponseChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('echo kitty');
                        done();
                    }
                );

                bus.respondOnce(testChannel)
                    .generate(
                        (request: string) => {
                            return 'echo ' + request;
                        }
                    );

                bus.send(testChannel, new Message().request('kitty'), 'mixOldAndNew');

            }
        );

        it('Should be able to mix old and new APIs together [respondStream(), requestStream(), tick(), subscribe()]',
            (done) => {

                let tickCount = 0;

                let responder = bus.respondStream(testChannel);
                responder.generate(
                    (request: number) => {
                        return ++request;
                    }
                );

                let chan = bus.getResponseChannel(testChannel, 'mixOldAndNew');
                let sub = chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toBeGreaterThan(0);
                        tickCount++;
                    }
                );

                let requester = bus.requestStream(testChannel, 1);
                requester.handle(
                    (val: number) => {
                        if (val <= 9) {
                            requester.tick(val);
                            return;
                        }
                        expect(tickCount).toEqual(9);
                        requester.close();
                        responder.close();
                        sub.unsubscribe();
                        done();
                    }
                );
            }
        );

        it('Should be able to handle an Error [listenOnce(), sendErrorMessage()]',
            (done) => {

                bus.listenOnce(testChannel)
                    .handle(
                        () => {
                            expect(false).toBeTruthy();
                            done();

                        },
                        (request: string) => {
                            expect(request).toEqual('fire!');
                            done();
                        }
                    );

                bus.sendErrorMessage(testChannel, 'fire!');

            }
        );

        it('Should be able to get observable from message handler for responses',
            (done) => {
                bus.respondOnce(testChannel)
                    .generate(
                        (val: string) => {
                            expect(val).toEqual('chickie');
                            return 'maggie';
                        }
                    );

                const handler = bus.listenOnce(testChannel);
                const obs = handler.getObservable<string>(MessageType.MessageTypeResponse);

                obs.subscribe(
                    (val: string) => {
                        expect(val).toEqual('maggie');
                        done();
                    }
                );

                bus.sendRequestMessage(testChannel, 'chickie');

            }
        );

        it('Should be able to get observable from message handler for requests',
            (done) => {

                const handler = bus.listenOnce(testChannel);
                const obs = handler.getObservable<string>(MessageType.MessageTypeRequest);

                obs.subscribe(
                    (val: string) => {
                        expect(val).toEqual('fox');
                        done();
                    }
                );

                bus.sendRequestMessage(testChannel, 'fox');
            }
        );

        it('Should be able to get observable from message handler for errors',
            (done) => {

                const handler = bus.listenOnce(testChannel);
                const obs = handler.getObservable<string>(MessageType.MessageTypeError);

                obs.subscribe(
                    () => {
                        expect(true).toBeFalsy();
                        done();
                    },
                    (val: Error) => {
                        expect(val.message).toEqual('chickie & maggie');
                        done();
                    }
                );

                bus.sendErrorMessage(testChannel, 'chickie & maggie');
            }
        );
        it('Should be able to get observable from message handler for full channel',
            (done) => {

                const handler = bus.listenOnce(testChannel);
                const obs = handler.getObservable<string>();
                let count: number = 0;

                // create a handler so the subscription is opened up and we can tick the stream.
                handler.handle(null);

                obs.subscribe(
                    () => {
                        count++;
                    },
                    () => {
                        expect(count).toEqual(4);
                        done();
                    }
                );
                handler.tick('a');
                handler.tick('b');
                handler.tick('c');
                handler.tick('d');
                handler.error('e');
            }
        );

        it('Should be able to get observable from message responder for requests',
            (done) => {
                const responder: MessageResponder = bus.respondOnce(testChannel);
                const obs = responder.getObservable<string>();

                obs.subscribe(
                    (val: string) => {
                        expect(val).toEqual('fox');
                        done();
                    }
                );

                bus.sendRequestMessage(testChannel, 'fox');

            }
        );

        it('Should be able to get observable from message responder for errors',
            (done) => {

                const responder: MessageResponder = bus.respondOnce(testChannel);
                const obs = responder.getObservable<string>();

                obs.subscribe(
                    () => {
                        expect(true).toBeFalsy();
                        done();
                    },
                    (val: Error) => {
                        expect(val.message).toEqual('chickie & maggie');
                        done();
                    }
                );

                bus.sendErrorMessage(testChannel, 'chickie & maggie');
            }
        );
    });
});