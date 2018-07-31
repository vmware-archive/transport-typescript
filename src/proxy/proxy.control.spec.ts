/**
 * Copyright(c) VMware Inc. 2016-2018
 */

import { EventBus, MessageType } from '../bus.api';
import { Logger, LogLevel } from '../log';
import { BusTestUtil } from '../util/test.util';
import { BusProxyMessage, IFrameProxyControl, ProxyType } from './message.proxy';

fdescribe('Proxy Controls [proxy/proxy.control.ts]', () => {

    let bus: EventBus;
    let log: Logger;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.loggerInstance.setStylingVisble(false);
            //bus.api.enableMonitorDump(true);
            bus.api.logger().silent(true);
            log = bus.api.logger();
        }
    );

    it('Basic start up works and property fetching accurate as expected.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: ['auth-chan1'],
            proxyType: ProxyType.Parent,
            targetOrigin: ['http://somewhere.out.there'],
            targetAllFrames: true,
            targetSpecificFrames: null
        });

        expect(control.isListening()).toBeTruthy();
        expect(control.getAllowedOrigins().length).toBe(1);
        expect(control.getAllowedOrigins()[0]).toEqual('http://somewhere.out.there');
        expect(control.getTargetedFrames().length).toEqual(0)
        expect(control.isTargetingAllFrames).toBeTruthy();

    });

    it('Check proxy can handle no config being supplied.', () => {
        spyOn(log, 'error').and.callThrough();
        bus.enableMessageProxy(null);
        expect(log.error).toHaveBeenCalledWith('Message Proxy cannot start. No configuration has been set.', 'MessageProxy');

    });

    it('Check config works with and without targeted frames.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: null,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: ['frame1', 'frame2']
        });

        expect(control.getTargetedFrames().length).toEqual(2);

    });

    it('Check config works with and without protected channels.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: ['chan1','chan2'],
            proxyType: null,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getAuthorizedChannels().length).toEqual(2);

    });

    it('Check configurations can be changed dynamically via the controller.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: ['auth-chan1'],
            proxyType: ProxyType.Parent,
            targetOrigin: ['http://space.dogs'],
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        // check listening
        control.stopListening();
        expect(control.isListening()).toBeFalsy();

        // check allowed origins
        control.addAllowedTargetOrigin('http://space.force');
        expect(control.getAllowedOrigins().length).toEqual(2);
        expect(control.getAllowedOrigins()[1]).toEqual('http://space.force');

        // remove origins
        control.removeAllowedTargetOrigin('http://space.force');
        expect(control.getAllowedOrigins().length).toEqual(1);
        expect(control.getAllowedOrigins()[0]).toEqual('http://space.dogs');

        expect(control.isTargetingAllFrames()).toBeFalsy();

        // add targeted frame
        control.addTargetedFrame('ember');
        expect(control.isTargetingAllFrames()).toBeFalsy();
        expect(control.getTargetedFrames().length).toEqual(1);
        expect(control.getTargetedFrames()[0]).toEqual('ember');

        // add another frame
        control.addTargetedFrame('cotton');
        expect(control.isTargetingAllFrames()).toBeFalsy();
        expect(control.getTargetedFrames().length).toEqual(2);
        expect(control.getTargetedFrames()[1]).toEqual('cotton');

        // remove frame
        control.removeTargetedFrame('ember');
        expect(control.isTargetingAllFrames()).toBeFalsy();
        expect(control.getTargetedFrames().length).toEqual(1);
        expect(control.getTargetedFrames()[0]).toEqual('cotton');

        // toggle all frames
        control.targetAllFrames(true);
        expect(control.isTargetingAllFrames()).toBeFalsy(); // because there are still targeted frames in play.

        // remove last frame
        control.removeTargetedFrame('cotton');
        expect(control.isTargetingAllFrames()).toBeFalsy();
        expect(control.getTargetedFrames().length).toEqual(0);

        // retry toggle.
        control.targetAllFrames(true);
        expect(control.isTargetingAllFrames()).toBeTruthy(); // targeted frames have been removed.

        // check channels
        expect(control.getAuthorizedChannels().length).toEqual(1);
        expect(control.getAuthorizedChannels()[0]).toEqual('auth-chan1');
        control.addAuthorizedChannel('new-chan');
        expect(control.getAuthorizedChannels().length).toEqual(2);
        expect(control.getAuthorizedChannels()[1]).toEqual('new-chan');

        // remove channel
        control.removeAuthorizedChannel('auth-chan1');
        expect(control.getAuthorizedChannels().length).toEqual(1);
        expect(control.getAuthorizedChannels()[0]).toEqual('new-chan');

    });

    it('Check dynamic configuration edge cases: allowed origins', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: null,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getAllowedOrigins().length).toEqual(1);
        expect(control.getAllowedOrigins()[0]).toEqual('*');

        control.removeAllowedTargetOrigin('non-existent');
        expect(control.getAllowedOrigins().length).toEqual(1);

        control.addAllowedTargetOrigin('*');
        expect(control.getAllowedOrigins().length).toEqual(1);

        control.removeAllowedTargetOrigin('*');
        expect(control.getAllowedOrigins().length).toEqual(0);

        control.removeAllowedTargetOrigin('*');
        expect(control.getAllowedOrigins().length).toEqual(0);

    });

    it('Check dynamic configuration edge cases: authorized channels', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: null,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getAuthorizedChannels().length).toEqual(0);

        control.removeAuthorizedChannel('non-existent');
        expect(control.getAuthorizedChannels().length).toEqual(0);

        control.addAuthorizedChannel('baby-melody');
        expect(control.getAuthorizedChannels().length).toEqual(1);

        // re-add
        control.addAuthorizedChannel('baby-melody');
        expect(control.getAuthorizedChannels().length).toEqual(1);

    });

    it('Check configuration listening type (parent)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Parent,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Parent);

    });


    it('Check configuration listening type (child)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Child,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Child);

    });

    it('Check configuration listening type (hybrid)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Hybrid,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Hybrid);

    });

    it('Check dynamic configuration edge cases: targeted frames', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: null,
            targetOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getTargetedFrames().length).toEqual(0);

        control.removeTargetedFrame('non-existent');
        expect(control.getTargetedFrames().length).toEqual(0);

        control.addTargetedFrame('baby-ember');
        expect(control.getTargetedFrames().length).toEqual(1);

        // re-add
        control.addTargetedFrame('baby-ember');
        expect(control.getTargetedFrames().length).toEqual(1);

    });

    describe('Validation & Rule Checking', () => {

        beforeEach(
            () => {
                bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
                bus.api.logger().silent(true);
                log = bus.api.logger();
            }
        );

        it('Proxy ignores messages with unregistered origin.', (done) => {
            spyOn(log, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://something.else'], // not what will come through
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('hello melody!','*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.warn)
                        .toHaveBeenCalledWith('Message refused, origin not registered: http://localhost:9876'
                            , 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy ignores messages not intended for the bus (regular string)', (done) => {
            spyOn(log, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('hello melody!','*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.debug)
                        .toHaveBeenCalledWith('Message Ignored, not intended for the bus.', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy ignores messages not intended for the bus (object).', (done) => {
            spyOn(log, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage({ data: 'hi fox!'},'*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.debug)
                        .toHaveBeenCalledWith('Message Ignored, not intended for the bus.', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy ignores messages with no payload.', (done) => {
            spyOn(bus.logger, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('','*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.debug)
                        .toHaveBeenCalledWith('Message Ignored, it contains no payload', 'MessageProxy');
                    done();
                },5
            );
        });


        it('Proxy accepts a valid message, but drops without a channel defined.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('time for a walk, pups', '', MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage,'*', ); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. No channel supplied', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy accepts a valid message, but drops without a type defined.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('who wants a treat?', 'somechan', null);
                    window.postMessage(invalidProxyMessage,'*', ); // send message, origin is local karma
                },
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. No message type supplied', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy accepts a valid message, but drops with an empty payload.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('', 'somechan',  MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage,'*', ); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. Payload is empty', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy accepts a valid message, but drops without a payload defined', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage(null, 'somechan',  MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage,'*', ); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. Payload is empty', 'MessageProxy');
                    done();
                },5
            );
        });

        it('Proxy accepts a valid message, but drops if the channel is not authorized', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                targetOrigin: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('mr. hacker', 'somechan',  MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage,'*', ); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message valid, but channel is not authorized: [somechan]', 'MessageProxy');
                    done();
                },5
            );
        });
    });
});