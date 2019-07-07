/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { EventBus, BifrostEventBus, BrokerConnectorChannel, MessageArgs } from '../';
import { LogLevel } from '../log/logger.model';
import { Message } from './model/message.model';
import { Channel } from './model/channel.model';
import { Observable } from 'rxjs';
import { Logger } from '../log/logger.service';
import { StompParser } from '../bridge/stomp.parser';
import { StompClient } from '../bridge/stomp.client';
import { MonitorObject, MonitorType } from './model/monitor.model';
import { APIRequest } from '../core/model/request.model';
import { UUID } from './store/store.model';
import { APIResponse } from '../core/model/response.model';
import { GeneralUtil } from '../util/util';
import { MessageHandler, MessageResponder, MessageType } from '../bus.api';
import { BridgeConnectionAdvancedConfig, StompConfig } from "../bridge";
import { StompBusCommand } from "../bridge/stomp.model";

function makeCallCountCaller(done: any, targetCount: number): any {
    let count = 0;
    return () => {
        count += 1;
        if (count === targetCount) {
            done();
        }
    };
}

describe('BifrostEventBus [bus/bus.ts]', () => {
    const testChannel = '#local-channel';
    const testData = {
        name: 'test-name'
    };


    let bus: EventBus;
    let log: Logger;

    beforeEach(() => {
        bus = BifrostEventBus.rebootWithOptions(LogLevel.Error, true);
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
        bus.api.enableMonitorDump(false);
        log = bus.api.logger();
    });
    it('Check logging settings', () => {
        bus = BifrostEventBus.rebootWithOptions(LogLevel.Info, true);
        bus.api.silenceLog(false);
        bus.api.suppressLog(true);
        bus.api.enableMonitorDump(false);

        bus.api.messageLog('testy-test', 'me');
        expect(bus.api.logger()
            .last())
            .toBe('[me]: testy-test');

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

    it('Check boot message is fired', () => {

        bus = BifrostEventBus.bootWithOptions(LogLevel.Off, false);
        expect(bus.api.logger().stylingVisble).toBeTruthy();

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
                bus.api.logger().debug('Channel1: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        const channel2: Observable<Message> = bus.api.getChannel(testChannel);
        channel2.subscribe(
            null,
            null,
            () => {
                bus.api.logger().debug('Channel2: Completion received correctly.', 'messagebus.service');
                doneCaller();
            }
        );

        expect(bus.api.complete(testChannel)).toBeTruthy();
    });

    it('Should fail to send completion over the message bus (negative test)', () => {
        expect(bus.api.complete('nonexistent')).toBeFalsy();
    });

    it('Check countListeners() is accurate against high level API (single response)', (done) => {

        /* the default number of channels open is 3, these are core and low-level channels
           used by the bus and broker connector.
            #messagebus-monitor
            #stomp-connection
            #stomp-subscription
        */

        expect(bus.api.countListeners()).toEqual(3);

        const handlerOnce: MessageHandler = bus.listenOnce('puppers');

        expect(bus.api.countListeners()).toEqual(4);

        handlerOnce.handle(
            (msg: string) => {

                // there should now be five listeners!
                // the handler listens for a single event.
                expect(bus.api.countListeners()).toEqual(4);
                expect(msg).toEqual('chicken');
            }
        );

        bus.sendResponseMessage('puppers', 'chicken');

        bus.api.tickEventLoop(
            () => {

                // handlerOnce should have closed the channel
                // so we should be at 4 listeners again!
                expect(bus.api.countListeners()).toEqual(3);
                done();
            }
            , 50);
    });

    it('Check countListeners() is accurate against high level API (stream response)', (done) => {

        /* the default number of channels open is 3, these are core and low-level channels
           used by the bus and broker connector.
            #messagebus-monitor
            #stomp-connection
            #stomp-subscription
        */

        expect(bus.api.countListeners()).toEqual(3);

        const handler: MessageHandler = bus.listenStream('puppers');

        expect(bus.api.countListeners()).toEqual(4);

        let count = 0;

        handler.handle(
            (msg: string) => {

                // there should now be four listeners!
                // the handler listens for a single event.
                expect(bus.api.countListeners()).toEqual(4);
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

                expect(bus.api.countListeners()).toEqual(3);
                expect(count).toEqual(4);
                done();
            }
            , 15);
    });

    it('Check createResponder() handles errors with error handler', (done) => {

        expect(bus.api.countListeners()).toEqual(3);
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
                expect(bus.api.countListeners()).toEqual(3);
                done();
            }
            , 1);
    });

    it('Check createResponder() handles errors with no error handler (negative testing)', (done) => {

        expect(bus.api.countListeners()).toEqual(3);
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
                expect(bus.api.countListeners()).toEqual(3);
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

    it('Check monitor dump is working correctly (low level API).', (done) => {

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);

        bus.api.suppressLog(true);
        const chanData = bus.api.getChannel('ember-the-puppy', 'baby-pup');
        const chanClose = bus.api.getChannel('chicken-licken', 'mags');
        const chanClose3 = bus.api.getChannel('chicken-licken', 'mags');
        const chan = bus.api.getChannel('maggie-pop', 'mags');
        const chan2 = bus.api.getChannel('maggie-pop', 'mags');

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toContain('maggie-pop');
                bus.closeChannel('maggie-pop', 'mags');
            }
            , 10);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toContain('maggie-pop');
                bus.closeChannel('maggie-pop', 'mags');
            }
            , 60);

        bus.api.tickEventLoop(
            () => {
                expect(log.last()).toContain('maggie-pop');
                bus.api.complete('chicken-licken', 'chickie');
            }
            , 90);

        bus.api.tickEventLoop(
            () => {
                // complete calls destroy immediately,
                expect(log.last()).toMatch(/\[chickie\]: 💣 \(channel destroyed\)-> chicken-licken/);
                bus.sendRequestMessage('ember-the-puppy', 'chomp chomp', 'baby-pup');
            }
            , 120);

        bus.api.tickEventLoop(
            () => {

                expect(log.last()).toEqual('"chomp chomp"');
                done();
            }
            , 150);

    });

    it('Check monitor dump is working correctly (simple API).', (done) => {

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);
        bus.api.suppressLog(true);

        spyOn(bus.api.loggerInstance, 'info').and.callThrough();

        bus.respondOnce('puppy-time')
            .generate(
                (req: string) => 'get the ball!'
            );
        bus.requestOnce('puppy-time', 'command')
            .handle(
                (resp: string) => {
                    expect(resp).toBe('get the ball!');
                }
            );

        bus.api.tickEventLoop(
            () => {
                expect(bus.api.loggerInstance.info).toHaveBeenCalledWith('"get the ball!"', null);
                done();
            }
            , 50);

    });

    it('Check monitor dump error handling is working correctly (simple API).', (done) => {

        spyOn(bus.api.loggerInstance, 'info').and.callThrough();

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);
        bus.api.suppressLog(true);

        bus.listenOnce('naughty-dogs').handle(null);

        bus.sendErrorMessage('naughty-dogs', 'who chewed my shoes?');

        bus.api.tickEventLoop(
            () => {
                expect(bus.api.loggerInstance.info).toHaveBeenCalledWith('⁉️ ERROR!', null);
                expect(bus.api.loggerInstance.info).toHaveBeenCalledWith('📤 Channel: naughty-dogs', null);
                done();
            }
            , 100);
    });

    it('Check monitor dump dropped payload handling is working correctly (simple API).', (done) => {

        spyOn(bus.api.loggerInstance, 'warn').and.callThrough();

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);

        bus.api.suppressLog(true);

        bus.sendRequestMessage('naughty-dogs', 'who chewed my shoes?');

        bus.api.tickEventLoop(
            () => {
                expect(bus.api.loggerInstance.warn)
                    .toHaveBeenCalledWith('💩 Message Was Dropped!', null);
                done();
            }
            , 10);
    });

    it('Check monitor dump ignores easter egg.', (done) => {

        spyOn(bus.api.loggerInstance, 'warn').and.callThrough();

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);
        bus.api.suppressLog(true);

        bus.sendRequestMessage('__maglingtonpuddles__', 'hi maggie!');

        bus.api.tickEventLoop(
            () => {
                expect(bus.api.loggerInstance.warn).not
                    .toHaveBeenCalledWith('💩 Message Was Dropped!', null);
                done();
            }
            , 10);
    });

    it('Check monitor dump recognises new galactic channel mappings.', (done) => {

        spyOn(bus.api.loggerInstance, 'info').and.callThrough();

        bus.api.enableMonitorDump(true);
        bus.api.silenceLog(false);
        bus.api.setLogLevel(LogLevel.Debug);
        const log: Logger = bus.api.logger();
        log.setStylingVisble(false);
        bus.api.suppressLog(true);

        bus.listenGalacticStream('space-car');

        bus.api.tickEventLoop(
            () => {
                expect(bus.api.loggerInstance.info)
                    .toHaveBeenCalledWith('🌌 (galactic channel mapped)-> space-car', 'EventBus');
                done();
            }
            , 10);
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

        it('respondOnce() and requestOnce() on differing command/response channels.',
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

        it('command once with a different return channel',
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

        it('command stream with a different return channel',
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

        it('listenRequestOnce() [listen to a single command]',
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

        it('listenRequestStream() [ listen for multiple command messages on a channel ]',
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

        it('sendRequest() [ simple API wrapper for sending command messages (wraps MessageHandlerConfig) ]',
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

        it('sendRequestMessage() [ lower level wrapper for sending command messages ]',
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

        it('sendRequestMessageWithId() [ test we can send a command with an ID and pick it up] ',
            (done) => {
                const id = GeneralUtil.genUUIDShort();

                const chan = bus.api.getChannel(testChannel);
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.id).toEqual(id);
                        done();
                    }
                );

                bus.sendRequestMessageWithId(testChannel, 'Ember', id);
            }
        );

        it('sendRequestMessageWithIdAndVersion() [ test we can send a command with an' +
            ' ID + version and pick it up] ',
            (done) => {
                const id = GeneralUtil.genUUIDShort();

                const chan = bus.api.getChannel(testChannel);
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.id).toEqual(id);
                        expect(msg.version).toEqual(999);
                        done();
                    }
                );

                bus.sendRequestMessageWithIdAndVersion(testChannel, 'Ember', id, 999);
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

        it('sendRequestMessageWithId() [ test we can send a command with and ID and pick it up] ',
            (done) => {
                const id = GeneralUtil.genUUIDShort();

                const chan = bus.api.getChannel(testChannel);
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.id).toEqual(id);
                        done();
                    }
                );

                bus.sendResponseMessageWithId(testChannel, 'Ember', id);
            }
        );

        it('sendRequestMessageWithIdAndVersion() [ test we can send a command with and' +
            ' ID + version and pick it up] ',
            (done) => {
                const id = GeneralUtil.genUUIDShort();

                const chan = bus.api.getChannel(testChannel);
                chan.subscribe(
                    (msg: Message) => {
                        expect(msg.id).toEqual(id);
                        expect(msg.version).toEqual(999);
                        done();
                    }
                );

                bus.sendResponseMessageWithIdAndVersion(testChannel, 'Ember', id, 999);
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
                            // send the value right back down the stream again as another command.
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

        it('Say hi to magnum <3',
            (done) => {
                // enable the easter egg and test it.
                const castBus = bus as BifrostEventBus;
                castBus.easterEgg();
                bus.requestOnce('__maglingtonpuddles__', 'hi maggie!')
                    .handle(
                        (msg: string) => {
                            expect(msg).toEqual('Maggie wags his little nubby tail at you, as ' +
                                'he sits under his little yellow boat on the beach');
                            done();
                        });

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

        it('Responder streams should not be able to respond after closing the stream',
            (done) => {

                const responder: MessageResponder<string> = bus.respondStream('puppy-talk');
                const handler: MessageHandler<string> = bus.listenStream('puppy-talk');
                let counter = 0;

                responder.generate(
                    (req: string) => {
                        expect(req).toEqual('where is my dinner?');
                        counter++;
                        if (counter === 3) {
                            responder.close(); // stop responding, but keep handling. 
                        }
                        return 'coming soon, calm down pup!';
                    }
                );

                handler.handle(
                    (resp: string) => {
                        expect(resp).toBe('coming soon, calm down pup!');
                        bus.sendRequestMessage('puppy-talk', 'where is my dinner?');
                    }
                );

                bus.sendRequestMessage('puppy-talk', 'where is my dinner?');

                bus.api.tickEventLoop(
                    () => {
                        expect(counter).toEqual(3);
                        bus.sendRequestMessage('puppy-talk', 'where is my dinner?');

                    },
                    200
                );

                bus.api.tickEventLoop(
                    () => {
                        expect(counter).toEqual(3);
                        done();
                    },
                    250
                );

            }
        );

        it('Nothing should happen when trying to close a single responder.',
            (done) => {

                const responder: MessageResponder<string> = bus.respondOnce('puppy-talk');
                const handler: MessageHandler<string> = bus.listenStream('puppy-talk');
                let counter = 0;

                responder.generate(
                    (req: string) => {
                        expect(req).toEqual('can I go outside?');
                        counter++;
                        return 'no! you just went out.';
                    }
                );

                handler.handle(
                    (resp: string) => {
                        expect(resp).toBe('no! you just went out.');
                        responder.close();
                        bus.sendRequestMessage('puppy-talk', 'can I go outside?');
                    }
                );

                bus.sendRequestMessage('puppy-talk', 'can I go outside?');

                bus.api.tickEventLoop(
                    () => {
                        expect(counter).toEqual(1);
                        done();
                    },
                    200
                );
            }
        );

        it('Responder should do nothing if there is an error thrown.',
            (done) => {
                spyOn(bus.api.loggerInstance, 'error').and.callThrough();
                bus.api.enableMonitorDump(true);
                bus.api.silenceLog(false);
                bus.api.setLogLevel(LogLevel.Error);
                bus.api.suppressLog(true);
                bus.api.logger().setStylingVisble(false);

                bus.respondOnce('puppy-dinner-talk')
                    .generate(
                        () => 'tonights dinner is steak'
                    );

                bus.api.error('puppy-dinner-talk', 'oh no! the steak is all gone!');
                bus.api.tickEventLoop(
                    () => {
                        expect(bus.api.loggerInstance.error)
                            .toHaveBeenCalledWith('responder caught error, discarding.',
                                'EventBus');
                        done();
                    },
                    10
                );
            }
        );
        it('createMessageHandler() should log error if valid message comes in without success handler defined',
            (done) => {
                spyOn(bus.api.loggerInstance, 'error').and.callThrough();
                bus.api.enableMonitorDump(true);
                bus.api.silenceLog(false);
                bus.api.setLogLevel(LogLevel.Error);
                bus.api.suppressLog(true);
                bus.api.logger().setStylingVisble(false);

                bus.listenOnce('puppy-play-talk').handle(null);

                bus.sendResponseMessage('puppy-play-talk', 'where is the ball?');
                bus.api.tickEventLoop(
                    () => {
                        expect(bus.api.loggerInstance.error)
                            .toHaveBeenCalledWith('unable to handle response, no handler function supplied',
                                'EventBus');
                        done();
                    },
                    50
                );
            }
        );

        it('createMessageHandler() should log error if an error comes in without error  handler defined',
            (done) => {
                spyOn(bus.api.loggerInstance, 'error').and.callThrough();
                bus.api.enableMonitorDump(true);
                bus.api.silenceLog(false);
                bus.api.setLogLevel(LogLevel.Error);
                bus.api.suppressLog(true);
                bus.api.logger().setStylingVisble(false);

                bus.listenOnce('puppy-play-talk').handle(null);

                bus.api.error('puppy-play-talk', 'the ball is gone!');
                bus.api.tickEventLoop(
                    () => {
                        expect(bus.api.loggerInstance.error)
                            .toHaveBeenCalledWith('unable to handle error, no error handler function supplied',
                                'EventBus');
                        done();
                    },
                    50
                );
            }
        );

        /* Simple API's with ID's and Versions */

        it('requestOnceWithId() should work as expected.',
            (done) => {
                let idCount = 0;
                let allCount = 0;
                bus.respondStream('foxy-pop')
                    .generate(() => 'bark');

                const id: UUID = GeneralUtil.genUUIDShort();

                bus.listenStream('foxy-pop')
                    .handle(
                        () => allCount++
                    );

                bus.sendRequestMessage('foxy-pop', true);

                bus.requestOnceWithId(id, 'foxy-pop', true)
                    .handle(
                        () => idCount++
                    );

                bus.sendRequestMessage('foxy-pop', true);
                bus.sendRequestMessageWithId('foxy-pop', true, id);

                bus.api.tickEventLoop(
                    () => {
                        expect(allCount).toEqual(4);
                        expect(idCount).toEqual(1);
                        done();
                    },
                    50
                );
            });

        it('requestStreamWithId() should work as expected.',
            (done) => {
                let idCount = 0;
                let allCount = 0;
                bus.respondStream('ember-puppy')
                    .generate(() => 'woof');

                const id: UUID = GeneralUtil.genUUIDShort();

                bus.listenStream('ember-puppy')
                    .handle(
                        () => allCount++
                    );

                bus.sendRequestMessageWithId('ember-puppy', 1, '1234');

                bus.requestStreamWithId(id, 'ember-puppy', 2)
                    .handle(
                        () => {
                            idCount++
                        }
                    );

                bus.sendRequestMessageWithId('ember-puppy', 3, '5678');
                bus.sendRequestMessageWithId('ember-puppy', 4, id);

                bus.api.tickEventLoop(
                    () => {
                        expect(allCount).toEqual(4);
                        expect(idCount).toEqual(2);
                        done();
                    },
                    50
                );
            });

        it('check ID and sender is correctly passed through with handler via MessageArgs.',
            (done) => {

                const chan = 'pup-talk';
                bus.respondStream(chan, chan, 'ember')
                    .generate(
                        (payload: string, args: MessageArgs) => {
                            expect(args.from).toEqual('cotton');
                            expect(payload).toEqual('whats the chat?');
                            return 'bark'
                        });


                bus.listenStream(chan).handle(
                    (response: string, args: MessageArgs) => {
                        expect(args.from).toEqual('ember');
                        expect(args.uuid).toEqual('1234');
                        done();
                    }
                );

                bus.sendRequestMessageWithId('pup-talk', 'whats the chat?', '1234', 'cotton');
            });

        it('check ID, version and sender is correctly passed through with handler via MessageArgs.',
            (done) => {

                const chan = 'pup-talk';
                bus.respondStream(chan, chan, 'ember')
                    .generate(
                        (payload: string, args: MessageArgs) => {
                            expect(args.from).toEqual('cotton');
                            expect(payload).toEqual('whats the chat?');
                            expect(args.version).toEqual(99);
                            return 'bark'
                        });


                bus.listenStream(chan).handle(
                    (response: string, args: MessageArgs) => {
                        expect(args.from).toEqual('ember');
                        expect(args.uuid).toEqual('1234');
                        expect(args.version).toEqual(99);

                        done();
                    }
                );

                bus.sendRequestMessageWithIdAndVersion('pup-talk', 'whats the chat?',
                    '1234', 99, 'cotton');

            });

    });

    /**
     * Broker Connector Method Tests.
     */
    describe('Broker Connector & Galactic Tests', () => {

        it('connectBroker() reacts correctly to connected messages',
            (done) => {

                const readyHandler = (sessionId: string) => {
                    expect(sessionId).toEqual('squeaky-chew');
                    done();
                };

                bus.connectBridge(
                    readyHandler,
                    '/somewhere',
                    '/topic',
                    '/queue',
                    0
                );

                // fake the broker sending back a valid connection and session.
                bus.sendResponseMessage(
                    BrokerConnectorChannel.connection,
                    StompParser.generateStompBusCommand(
                        StompClient.STOMP_CONNECTED,
                        'squeaky-chew'
                    )
                );
            }
        );

        it('connectBroker() logs unexpected stomp command',
            (done) => {

                const readyHandler = () => {
                    done();
                };

                spyOn(bus.api.loggerInstance, 'info').and.callThrough();
                bus.api.enableMonitorDump(true);
                bus.api.silenceLog(false);
                bus.api.setLogLevel(LogLevel.Error);
                bus.api.suppressLog(true);
                bus.api.logger().setStylingVisble(false);

                bus.connectBridge(
                    (readyHandler),
                    '/somewhere',
                    '/topic',
                    '/queue',
                    0
                );

                // fake the broker sending back an in correct/unexpected command
                bus.sendResponseMessage(
                    BrokerConnectorChannel.connection,
                    StompParser.generateStompBusCommand(
                        StompClient.STOMP_ABORT,
                        'squeaky-chew'
                    )
                );

                bus.api.tickEventLoop(
                    () => {
                        expect(bus.api.loggerInstance.info)
                            .toHaveBeenCalledWith('connection handler received command message: ABORT',
                                'EventBus');
                        readyHandler();
                    },
                    50
                );
            }
        );

       describe('when calling connectBridge() with advancedConfig param', () => {

          it('populates the correct stompConfig parameters',
                () => {

                   const requestStreamSpy = spyOn(bus, "requestStream").and.returnValue({
                      handle: () => {}
                   });

                   let advancedConfig: BridgeConnectionAdvancedConfig = {
                      heartbeatOutgoingInterval: 10,
                      heartbeatIncomingInterval: 20,
                      startIntervalFunction:  (handler: any, timeout?: any, ...args: any[]) => { return 67; }
                   };

                   bus.connectBridge(
                         () => {},
                         '/somewhere',
                         '/topic',
                         '/queue',
                         0,
                         undefined,
                         undefined,
                         undefined,
                         undefined,
                         undefined,
                         undefined,
                         undefined,
                         advancedConfig
                   );

                   expect(bus.requestStream).toHaveBeenCalled();
                   let stompCmd: StompBusCommand = requestStreamSpy.calls.mostRecent().args[1];
                   const stompConfig: StompConfig = stompCmd.payload;
                   expect(stompConfig.heartbeatIn).toBe(advancedConfig.heartbeatIncomingInterval);
                   expect(stompConfig.heartbeatOut).toBe(advancedConfig.heartbeatOutgoingInterval);
                   expect(stompConfig.startIntervalFunction).toBe(advancedConfig.startIntervalFunction);
                }
          );
       });

        it('listenGalacticStream() works correctly.',
            (done) => {

                const monitor = bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorNewGalacticChannel:
                                    expect(mo.channel).toEqual('space-dogs');
                                    done();
                                    break;

                                default:
                                    break;
                            }
                        }
                    );

                bus.listenGalacticStream('space-dogs');
            });

        it('listenGalacticStream() works correctly with multiple subscribers.',
            (done) => {

                let chanCreateCount = 0;
                let handler1FireCount = 0;
                let handler2FireCount = 0;

                bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorNewGalacticChannel:
                                    expect(mo.channel).toEqual('space-dogs');
                                    chanCreateCount++;
                                    expect(chanCreateCount).toEqual(1); // should only be 1!
                                    break;

                                default:
                                    break;
                            }
                        }
                    );

                const handler1 = bus.listenGalacticStream('space-dogs');
                const handler2 = bus.listenGalacticStream('space-dogs');

                handler1.handle(
                    () => {
                        handler1FireCount++;
                    }
                );
                handler2.handle(
                    () => {
                        handler2FireCount++;
                    }
                );

                bus.api.tickEventLoop(
                    () => {
                       bus.sendResponseMessage('space-dogs', 'woof!');
                    },
                    20
                );

                bus.api.tickEventLoop(
                    () => {
                        expect(handler1FireCount).toEqual(1);
                        expect(handler1FireCount).toEqual(1);
                        done();
                    },
                    50
                )

            });


        it('isGalacticChannel() works correctly.',
            () => {
                bus.listenGalacticStream('space-dogs');
                bus.listenStream('earth-dogs');
                expect(bus.isGalacticChannel('space-dogs')).toBeTruthy();
                expect(bus.isGalacticChannel('earth-dogs')).toBeFalsy();
                expect(bus.isGalacticChannel('ghost-dogs')).toBeFalsy(); // does not exist at all!
            });

        it('sendGalacticMessage() works correctly.',
            (done) => {

                const monitor = bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorGalacticData:
                                    expect(mo.channel).toEqual('space-dogs');
                                    expect(mo.data).toEqual('off to the moon goes fox!');
                                    done();
                                    break;

                                default:
                                    break;
                            }
                        }
                    );

                bus.listenGalacticStream('space-dogs');
                bus.sendGalacticMessage('space-dogs', 'off to the moon goes fox!');
            });
        
        describe('markChannelAsGalactic()', () => {
            const channelName = 'space-cats';

            beforeEach(() => {                
                bus.markChannelAsGalactic(channelName);
            });

            it('sets the channel to be galactic', () => {
                const channel: Channel = bus.api.getChannelObject(channelName);

                expect(channel.galactic).toEqual(true);    
            });

            it('sends MonitorNewGalacticChannel message', (done) => {
                bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorNewGalacticChannel:
                                    expect(mo.channel).toEqual(channelName);
                                    done();
                                    break;

                                default:
                                    break;
                            }
                        }
                    );
            });    
        });

        it('markChannelsAsGalactic triggers markChannelAsGalactic for each channel names', () => {
            spyOn(bus, 'markChannelAsGalactic').and.callThrough();
            bus.markChannelsAsGalactic(['channel1', 'channel2']);

            expect(bus.markChannelAsGalactic).toHaveBeenCalledWith('channel1');
            expect(bus.markChannelAsGalactic).toHaveBeenCalledWith('channel2');
        });

        it('markChannelsAsLocal triggers markChannelAsLocal for each channel names', () => {
            spyOn(bus, 'markChannelAsLocal').and.callThrough();
            bus.markChannelsAsLocal(['channel1', 'channel2']);

            expect(bus.markChannelAsLocal).toHaveBeenCalledWith('channel1');
            expect(bus.markChannelAsLocal).toHaveBeenCalledWith('channel2');
        });

        describe('markChannelAsLocal()', () => {
            const channelName = 'space-cats';

            beforeEach(() => {                
                bus.markChannelAsLocal(channelName);
            });

            it('sets the channel to be private', () => {
                bus.markChannelAsLocal(channelName);
                const channel: Channel = bus.api.getChannelObject(channelName);
    
                expect(channel.galactic).toEqual(false);
            });

            it('sends MonitorGalacticUnsubscribe message', (done) => {
                bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorGalacticUnsubscribe:
                                    expect(mo.channel).toEqual(channelName);
                                    done();
                                    break;

                                default:
                                    break;
                            }
                        }
                    );
    
                bus.markChannelAsLocal(channelName);
            });
        });

        it('galacticRequest() works correctly.',
            (done) => {
                const id: UUID = GeneralUtil.genUUIDShort();
                const req: APIRequest<string> = APIRequest.build('testAPI', 'ember loves to play?', id);
                bus.requestGalactic('ember-station', req,
                    (resp: APIResponse<string>) => {
                        expect(resp.id).toEqual(id);
                        expect(resp.payload).toEqual('scooty butt chase jump');
                        done();
                    });
                bus.api.getMonitor()
                    .subscribe(
                        (message: Message) => {
                            const mo = message.payload as MonitorObject;
                            switch (mo.type) {
                                case MonitorType.MonitorGalacticData:
                                    expect(mo.channel).toEqual('ember-station');

                                    const data: APIRequest<string> = mo.data as APIRequest<string>;
                                    expect(data.id).toEqual(id);

                                    const resp: APIResponse<string> =
                                        APIResponse.build('scooty butt chase jump', id);
                                    bus.sendResponseMessage('ember-station', resp);
                                    break;

                                default:
                                    break;
                            }
                        }
                    );
            });

        it('galacticRequest() works correctly without a channel or payload.',
            () => {

                spyOn(log, 'error').and.callThrough();
                bus.requestGalactic(null, null, null);
                expect(log.error).toHaveBeenCalledWith('Cannot send Galactic APIRequest, ' +
                    'payload or channel is empty.', 'EventBus');

            });
    });


    /**
     * BusStore tests
     */
    describe('BusStore Tests', () => {

        it('check createStore() and getStore() works correctly.',
            () => {

                // new store
                let store = bus.stores.createStore('pupStore');
                store.put('chicken', 'cotton', 'created');
                expect(bus.stores.getStore('pupStore')).not.toBeNull();
                expect(store.get('chicken')).toEqual('cotton');

                const map = new Map<string, string>();
                map.set('maggie', 'magnum');

                // check populating
                const storePop = bus.stores.createStore('pupStorePopulated', map);
                expect(bus.stores.getStore('pupStorePopulated')).not.toBeNull();
                expect(bus.stores.getStore('pupStorePopulated').allValues().length).toEqual(1);
                expect(storePop.get('maggie')).toEqual('magnum');

                // create with existing store
                store = bus.stores.createStore('pupStore');
                expect(bus.stores.getStore('pupStore')).not.toBeNull();
                expect(store.get('chicken')).toEqual('cotton');

            }
        );

        it('check destroyStore() works correctly.',
            () => {

                // new store
                let store = bus.stores.createStore('pupStore');
                expect(bus.stores.getStore('pupStore')).not.toBeNull();
                expect(bus.stores.destroyStore('pupStore')).toBeTruthy();
                expect(bus.stores.destroyStore('pupStore')).toBeFalsy();
                expect(bus.stores.destroyStore('noSuchStore')).toBeFalsy();

            }
        );
    });
});
