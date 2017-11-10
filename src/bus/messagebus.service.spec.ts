/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { EventBus, MessagebusService } from '../';

import { Syslog } from '../log/syslog';
import { LogLevel } from '../log/logger.model';
import { Message, MessageHandler, MessageResponder, MessageType } from './model/message.model';
import { Channel } from './model/channel.model';
import { Observable } from 'rxjs/Observable';
import { LoggerService } from '../log/logger.service';

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

describe('MessagebusService [messagebus.service]', () => {
    const testChannel = '#local-channel';
    const testData = {
        name: 'test-name'
    };

    const testMessage = 'Test String';
    const tag = '[' + getName() + ']: ';
    const response = tag + testMessage;

    let bus: EventBus;

    beforeEach(() => {
        bus = new MessagebusService();
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
        bus.api.enableMonitorDump(false);
    });
    it('Should check logging', () => {
        bus.api.messageLog(testMessage, getName());
        expect(bus.api.logger()
            .last())
            .toBe(response);

        bus.api.setLogLevel(LogLevel.Off);
        expect(bus.api.logger().logLevel).toBe(LogLevel.Off);

        bus.api.enableMonitorDump(true);
        expect(bus.api.isLoggingEnabled()).toBeTruthy();

        bus.api.enableMonitorDump(false);
        expect(bus.api.isLoggingEnabled()).toBeFalsy();
    });

    it('Should cause a new Channel to be instantiated', () => {
        let channel = bus.api.getChannel(testChannel);
        expect(channel)
            .not
            .toBeUndefined();
        expect(bus.api.refCount(testChannel)).toBe(1);
        expect(bus.api.getMonitor())
            .not
            .toBeUndefined();

        bus.api.send(testChannel, new Message().request('*data*'));
        bus.api.getChannel(testChannel);
        expect(bus.api.refCount(testChannel)).toBe(2);

        bus.closeChannel(testChannel);

        expect(bus.api.refCount(testChannel)).toBe(1);

        bus.closeChannel(testChannel);
        expect(bus.api.refCount(testChannel)).toBe(-1);
    });

    it('Should fail to communicate with a closed channel', () => {
        bus.api.getChannel(testChannel);
        bus.api.increment(testChannel);
        bus.closeChannel(testChannel);

        expect(bus.closeChannel(testChannel))
            .toBeTruthy();
        expect(bus.api.send(testChannel, new Message().request(testData)))
            .toBeFalsy();
        expect(bus.api.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.closeChannel(testChannel))
            .toBeFalsy();
    });

    it('Should fail to communicate with a completed channel', () => {
        bus.api.getChannel(testChannel);
        expect(bus.api.complete(testChannel))
            .toBeTruthy();
        expect(bus.api.send(testChannel, new Message().request(testData)))
            .toBeFalsy();
        expect(bus.api.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.api.complete(testChannel))
            .toBeFalsy();
    });

    it('Should return same Channel for a new subscriber', () => {
        const channel: Channel = bus.api.getChannelObject(testChannel);
        const channel2: Channel = bus.api.getChannelObject(testChannel);

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
        const channel: Observable<Message> = bus.api.getRequestChannel(testChannel);
        channel.subscribe(
            (message: Message) => {

                expect(message.payload).toBe(testData);

                bus.api.close(testChannel);

                expect(bus.api.close(testChannel)).toBeFalsy();
                done();
            }
        );

        bus.api.send(testChannel, new Message().request(testData));
    });

    it('Should send and receive error over the message bus', (done) => {
        const channel: Observable<Message> = bus.api.getErrorChannel(testChannel);
        channel.subscribe(
            (message: Message) => {
                expect(message.isError()).toBeTruthy();
                expect(message.payload).toBe(testData);
                done();
            }
        );

        bus.api.send(testChannel, new Message().error(testData));
    });

    it('Should fail to send data over the message bus (negative test)', () => {
        expect(bus.api.send('nonexistent', new Message().request(testData))).toBeFalsy();
    });

    it('Should send and receive an error over the message bus', (done) => {
        const channel: Observable<Message> = bus.api.getChannel(testChannel);
        channel.subscribe(
            null,
            (error: any) => {
                expect(error).toBe(testData);
                done();
            }
        );

        expect(bus.api.error(testChannel, testData)).toBeTruthy();
    });

    it('Should fail to send error over the message bus (negative test)', () => {
        expect(bus.api.error('nonexistent', testData)).toBeFalsy();
    });

    it('Should send data over the message bus to 2 subscribers (one-to-many)', (done) => {
        const doneCaller = makeCallCountCaller(done, 2);

        const channel: Observable<Message> = bus.api.getResponseChannel(testChannel);
        channel.subscribe(
            (message: Message) => {
                expect(message.payload).toBe(testData);
                doneCaller();
            }
        );

        const channel2: Observable<Message> = bus.api.getChannel(testChannel);
        channel2.subscribe(
            (message: Message) => {
                expect(message.payload).toBe(testData);
                doneCaller();
            }
        );

        expect(bus.api.send(testChannel, new Message().response(testData))).toBeTruthy();
    });

    it('Should send an error over the message bus to 2 subscribers (one-to-many)', (done) => {
        const doneCaller = makeCallCountCaller(done, 2);

        const channel: Observable<Message> = bus.api.getChannel(testChannel);
        channel.subscribe(
            null,
            (error: any) => {
                expect(error).toBe(testData);
                doneCaller();
            }
        );

        const channel2: Observable<Message> = bus.api.getChannel(testChannel);
        channel2.subscribe(
            null,
            (error: any) => {
                expect(error).toBe(testData);
                doneCaller();
            }
        );

        expect(bus.api.error(testChannel, testData)).toBeTruthy();
    });

    it('Should send a completion over the message bus to 2 subscribers (one-to-many)', (done) => {
        const doneCaller = makeCallCountCaller(done, 2);

        let channel: Observable<Message> = bus.api.getChannel(testChannel);
        channel.subscribe(
            null,
            null,
            () => {
                Syslog.debug('Channel1: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        const channel2: Observable<Message> = bus.api.getChannel(testChannel);
        channel2.subscribe(
            null,
            null,
            () => {
                Syslog.debug('Channel2: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        expect(bus.api.complete(testChannel)).toBeTruthy();
    });

    it('Should fail to send completion over the message bus (negative test)', () => {
        expect(bus.api.complete('nonexistent')).toBeFalsy();
    });

    it('Check countListeners() is accurate against high level API (single response)', (done) => {

        /* the default number of channels open is 4, these are core and low-level channels
           used by the bus and broker connector.
            #messagebus-monitor
            #stomp-connection
            #stomp-subscription
            #stomp-messages
        */

        expect(bus.api.countListeners()).toEqual(4);

        const handlerOnce: MessageHandler = bus.listenOnce('puppers');

        expect(bus.api.countListeners()).toEqual(5);

        handlerOnce.handle(
            (msg: string) => {

                // there should now be five listeners!
                // the handler listens for a single event.
                expect(bus.api.countListeners()).toEqual(5);
                expect(msg).toEqual('chicken');
            }
        );

        bus.sendResponseMessage('puppers', 'chicken');

        bus.api.tickEventLoop(
            () => {

                // handlerOnce should have closed the channel
                // so we should be at 4 listeners again!
                expect(bus.api.countListeners()).toEqual(4);
                done();
            }
            , 10);
    });

    it('Check countListeners() is accurate against high level API (stream response)', (done) => {

        /* the default number of channels open is 4, these are core and low-level channels
           used by the bus and broker connector.
            #messagebus-monitor
            #stomp-connection
            #stomp-subscription
            #stomp-messages
        */

        expect(bus.api.countListeners()).toEqual(4);

        const handler: MessageHandler = bus.listenStream('puppers');

        expect(bus.api.countListeners()).toEqual(5);

        let count = 0;

        handler.handle(
            (msg: string) => {

                // there should now be five listeners!
                // the handler listens for a single event.
                expect(bus.api.countListeners()).toEqual(5);
                expect(msg).toEqual('chicken');
                count++;
            }
        );

        bus.sendResponseMessage('puppers', 'chicken');
        bus.sendResponseMessage('puppers', 'chicken');
        bus.sendResponseMessage('puppers', 'chicken');
        bus.sendResponseMessage('puppers', 'chicken');


        bus.api.tickEventLoop(
            () => bus.closeChannel('puppers')
            , 5);

        // should have settled 
        bus.api.tickEventLoop(
            () => {

                expect(bus.api.countListeners()).toEqual(4);
                expect(count).toEqual(4);
                done();
            }
            , 15);
    });

    it('Check createResponder() handles errors with error handler', (done) => {

        expect(bus.api.countListeners()).toEqual(4);
        const responder: MessageResponder<string> = bus.respondOnce('puppers');
        responder.generate(
            null,
            (msg: string) => {
                expect(msg).toEqual('why are my shoes ruined?');
                return 'little baby ember did it';
            }
        );

        bus.sendErrorMessage('puppers', 'why are my shoes ruined?');

        // should have settled 
        bus.api.tickEventLoop(
            () => {
                expect(bus.api.countListeners()).toEqual(4);
                done();
            }
            , 1);
    });

    it('Check createResponder() handles errors with no error handler (negative testing)', (done) => {

        expect(bus.api.countListeners()).toEqual(4);
        const responder: MessageResponder<string> = bus.respondOnce('puppers');
        responder.generate(
            (msg: string) => {
                expect(msg).toEqual('why are my shoes ruined?');
                return 'little baby ember did it';
            }
        );

        bus.sendErrorMessage('puppers', 'why are my shoes ruined?');

        // should have settled 
        bus.api.tickEventLoop(
            () => {
                expect(bus.api.countListeners()).toEqual(4);
                done();
            }
            , 1);
    });

    it('Check createResponder() handles tick() corectly', (done) => {
        let count: number = 0;

        const responder: MessageResponder<string> = bus.respondStream('puppers');
        responder.generate(
            (msg: string) => {
                expect(msg).toEqual('how many bones has fox hidden?');
                return ++count;
            }
        );

        const handler: MessageHandler<number> = bus.listenStream('puppers');
        handler.handle(
            (resp: number) => {
                if (count === 3) {
                    done();
                }
            }
        );

        bus.sendRequestMessage('puppers', 'how many bones has fox hidden?');
        responder.tick(++count);
        responder.tick(++count);

    });

    it('Check createResponder() does not tick() on a closed stream', (done) => {
        let count: number = 0;

        const responder: MessageResponder<string> = bus.respondOnce('puppers');
        responder.generate(
            (msg: string) => {
                expect(msg).toEqual('how many bones has fox hidden?');
                return ++count;
            }
        );

        bus.sendRequestMessage('puppers', 'how many bones has fox hidden?');

        // should have settled 
        bus.api.tickEventLoop(
            () => {
                responder.tick('ignore me');
                responder.tick('mr cellophane');
                responder.tick('do I even exist?');
                responder.tick('why is there no answer?');
                responder.tick('surely someone is there?');
            }
            , 10);


        // should have settled 
        bus.api.tickEventLoop(
            () => {
                expect(count).toEqual(1); // only a single event should have made it through
                done();
            }
            , 20);
    });

    it('Check createMessageHandler() can handle observable errors', (done) => {

        const handler: MessageHandler<number> = bus.listenStream('puppers');
        handler.handle(
            null,
            (error: string) => {
                expect(error).toEqual('whoopsie, someone had an accident on my $2k rug.');
                done();
            }
        );

        const chan: Channel = bus.api.getChannelObject('puppers');
        chan.error('whoopsie, someone had an accident on my $2k rug.');

    });

    it('Check createMessageHandler() does not tick() on a closed stream', (done) => {
        let count: number = 0;

        const responder: MessageResponder<string> = bus.respondOnce('puppers');
        responder.generate(
            (msg: string) => {
                expect(msg).toEqual('how many bones has fox hidden?');
                return ++count;
            }
        );

        const handler: MessageHandler<number> = bus.listenOnce('puppers');
        handler.handle(
            (msg: number) => {
                expect(msg).toEqual(count);
            }
        );

        bus.sendRequestMessage('puppers', 'how many bones has fox hidden?');

        // should have settled 
        bus.api.tickEventLoop(
            () => {
                handler.tick('ignore me');
                handler.tick('mr cellophane');
                handler.tick('do I even exist?');
                handler.tick('why is there no answer?');
                handler.tick('surely someone is there?');
            }
            , 10);


        // should have settled 
        bus.api.tickEventLoop(
            () => {
                expect(count).toEqual(1); // only a single event should have made it through
                done();
            }
            , 20);
    });

    it('Check createMessageHandler() observable handles default (empty) message type', (done) => {

        const handler: MessageHandler<string> = bus.listenOnce('puppers');
        handler.getObservable().subscribe(
            (val: string) => {
                expect(val).toEqual('bathtime ember!');
                done();
            }
        );

        bus.sendResponseMessage('puppers', 'bathtime ember!');

    });

    it('Check monitor dumping is working correctly', (done) => {

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: LoggerService = bus.api.logger();

        bus.sendResponseMessage('puppers', 'response test');

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[MessagebusService]: "response test"');
                bus.sendRequestMessage('puppers', 'request test');

            }
            , 5);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[MessagebusService]: "request test"');
                bus.sendErrorMessage('puppers', 'error test');

            }
            , 10);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[MessagebusService]: "error test"');
                done();
            }
            , 15);
    });

    fit('Check monitor dump is working correctly.', (done) => {

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: LoggerService = bus.api.logger();
        log.setStylingVisble(false);

        bus.api.suppressLog(false);
        const chanData = bus.api.getChannel('ember-the-puppy', 'baby-pup');
        const chanClose = bus.api.getChannel('chicken-licken', 'mags');
        const chan = bus.api.getChannel('maggie-pop', 'mags');
        const chan2 = bus.api.getChannel('maggie-pop', 'mags');

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[mags]: (*)-> maggie-pop');
                bus.closeChannel('maggie-pop', 'mags');
            }
            , 10);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[mags]: (-)-> maggie-pop');
                bus.closeChannel('maggie-pop', 'mags');
                
            }
            , 20);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toEqual('[mags]: (xXx)-> maggie-pop');
                bus.api.complete('chicken-licken', 'chickie');
                
            }
            , 30);

        bus.api.tickEventLoop(
            () => {
                // complete calls destroy immediately,
                expect(log.last()).toEqual('[chickie]: (xXx)-> chicken-licken');
                bus.sendRequestMessage('ember-the-puppy', 'chomp chomp', 'baby-pup');
                
            }
            , 40);

        bus.api.tickEventLoop(
            () => {
                // complete calls destroy immediately,
                expect(log.last()).toEqual('[baby-pup]: (d)-> chomp chomp');
                done();
            }
            , 50);




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
                        bus.api.sendResponse(channel2, 'margarita');
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
                        bus.api.sendResponse(channel2, 'margarita');
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

                let chan = bus.api.getResponseChannel(testChannel, 'listenOnce()');
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

                let chan = bus.api.getRequestChannel(testChannel, 'listenRequestOnce()');
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
                bus.api.sendRequest(testChannel, 'Cotton');
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
                bus.api.sendResponse(testChannel, 'Fox');
            }
        );

        it('sendRequestMessage() [ lower level wrapper for sending request messages ]',
            (done) => {

                let _chan = bus.api.getRequestChannel(testChannel, 'sendRequestMessage()');
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

                let _chan = bus.api.getResponseChannel(testChannel, 'sendResponseMessage()');
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

                let _chan = bus.api.getChannel(testChannel, 'sendErrorMessage()');
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


                let chan = bus.api.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('tea');
                        done();
                    }
                );

                bus.api.sendRequest(testChannel, 'tea');

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
                bus.api.send(testChannel, new Message().request('Chickie'), 'mixOldAndNew');

            }
        );

        it('Should be able to mix old and new APIs together [requestOnce(), subscribe(), sendResponse()]',
            (done) => {

                let chan = bus.api.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toEqual('bikes');
                        bus.api.sendResponse(testChannel, 'cars');
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

                let chan = bus.api.getRequestChannel(testChannel, 'mixOldAndNew');
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.payload).toBeGreaterThan(0);
                        expect(msg.payload).toBeLessThan(10);
                        let val = msg.payload;

                        // increment by one and fire back a response.
                        bus.api.sendResponse(testChannel, ++val);
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

                let chan = bus.api.getResponseChannel(testChannel, 'mixOldAndNew');
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

                bus.api.send(testChannel, new Message().request('kitty'), 'mixOldAndNew');

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

                let chan = bus.api.getResponseChannel(testChannel, 'mixOldAndNew');
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

                const handler: MessageHandler<string> = bus.listenOnce(testChannel);
                const obs = handler.getObservable(MessageType.MessageTypeResponse);

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

                const handler: MessageHandler<string> = bus.listenOnce(testChannel);
                const obs = handler.getObservable(MessageType.MessageTypeRequest);

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

                const handler: MessageHandler<string> = bus.listenOnce(testChannel);
                const obs = handler.getObservable(MessageType.MessageTypeError);

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

                const handler: MessageHandler<string> = bus.listenOnce(testChannel);
                const obs = handler.getObservable();
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

        it('Should be able to listen to multiple streams',
            (done) => {

                let val = 0;
                const handler1 = bus.listenStream(testChannel);
                const handler2 = bus.listenStream(testChannel);
                const handler3 = bus.listenStream(testChannel);

                // create a handler so the subscription is opened up and we can tick the stream.
                handler1.handle(
                    () => {
                        val++;
                    }
                );

                handler2.handle(
                    () => {
                        val++;
                    }
                );

                handler3.handle(
                    () => {
                        val++;
                        if (val === 9) {
                            done();
                        }
                    }
                );

                bus.sendResponseMessage(testChannel, val);
                bus.sendResponseMessage(testChannel, val);
                bus.sendResponseMessage(testChannel, val);
            }
        );

        it('Should be able to get observable from message responder for requests',
            (done) => {
                const responder: MessageResponder<string> = bus.respondOnce(testChannel);
                const obs = responder.getObservable();

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

                const responder: MessageResponder<string> = bus.respondOnce(testChannel);
                const obs = responder.getObservable();

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