/**
 * Copyright(c) VMware Inc. 2016-2018
 */

import { EventBus, MessageType } from '../bus.api';
import { Logger, LogLevel } from '../log';
import { BusTestUtil } from '../util/test.util';
import { BusProxyMessage, IFrameProxyControl, ProxyControlPayload, ProxyType } from './message.proxy';

describe('Proxy Controls [proxy/proxy.control.ts]', () => {

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
            parentOrigin: 'http://localhost',
            acceptedOrigins: ['http://somewhere.out.there'],
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
        expect(log.error).toHaveBeenCalledWith('Message Proxy cannot start. No configuration has been set.', 'ProxyControl');

    });

    it('Check config works with and without targeted frames.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            parentOrigin: null,
            proxyType: null,
            acceptedOrigins: null,
            targetAllFrames: false,
            targetSpecificFrames: ['frame1', 'frame2']
        });

        expect(control.getTargetedFrames().length).toEqual(2);

    });

    it('Check config works with and without protected channels.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: ['chan1', 'chan2'],
            proxyType: null,
            parentOrigin: null,
            acceptedOrigins: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getAuthorizedChannels().length).toEqual(2);

    });

    it('Check configurations can be changed dynamically via the controller.', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: ['auth-chan1'],
            proxyType: ProxyType.Parent,
            parentOrigin: 'http://melody.baby',
            acceptedOrigins: ['http://space.dogs'],
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.getParentOrigin()).toEqual('http://melody.baby');
        control.setParentOrigin('http://puppy.time');

        expect(control.getParentOrigin()).toEqual('http://puppy.time');

        // check online
        control.stopListening();
        expect(control.isListening()).toBeFalsy();

        // re-check online
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
            parentOrigin: null,
            proxyType: null,
            acceptedOrigins: null,
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
            parentOrigin: null,
            acceptedOrigins: null,
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

    it('Check configuration online type (parent)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Parent,
            acceptedOrigins: null,
            parentOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Parent);

    });


    it('Check configuration online type (child)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Child,
            acceptedOrigins: null,
            parentOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Child);

    });

    it('Check configuration online type (hybrid)', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: ProxyType.Hybrid,
            acceptedOrigins: null,
            parentOrigin: null,
            targetAllFrames: false,
            targetSpecificFrames: null
        });

        expect(control.listeningAs()).toEqual(ProxyType.Hybrid);

    });

    it('Check dynamic configuration edge cases: targeted frames', () => {
        const control: IFrameProxyControl = bus.enableMessageProxy({
            protectedChannels: null,
            proxyType: null,
            acceptedOrigins: null,
            parentOrigin: null,
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
                acceptedOrigins: ['http://something.else'], // not what will come through
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('hello melody!', '*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.warn)
                        .toHaveBeenCalledWith('Message refused, origin not registered: http://localhost:9876'
                            , 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy ignores messages not intended for the bus (regular string)', (done) => {
            spyOn(log, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('hello melody!', '*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.debug)
                        .toHaveBeenCalledWith('Message Ignored, not intended for the bus.', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy ignores messages not intended for the bus (object).', (done) => {
            spyOn(log, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage({data: 'hi fox!'}, '*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(log.debug)
                        .toHaveBeenCalledWith('Message Ignored, not intended for the bus.', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy ignores messages with no payload.', (done) => {
            spyOn(bus.logger, 'debug').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    window.postMessage('', '*'); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.debug)
                        .toHaveBeenCalledWith('Message Ignored, it contains no payload', 'ProxyControl');
                    done();
                }, 5
            );
        });


        it('Proxy accepts a valid message, but drops without a channel defined.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('time for a walk, pups', '', MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage, '*',); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. No channel supplied', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy accepts a valid message, but drops without a type defined.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('who wants a treat?', 'somechan', null);
                    window.postMessage(invalidProxyMessage, '*',); // send message, origin is local karma
                },
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. No message type supplied', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy accepts a valid message, but drops with an empty payload.', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('', 'somechan', MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage, '*',); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. Payload is empty', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy accepts a valid message, but drops without a payload defined', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage(null, 'somechan', MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage, '*',); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message invalid - ignored. Payload is empty', 'ProxyControl');
                    done();
                }, 5
            );
        });

        it('Proxy accepts a valid message, but drops if the channel is not authorized', (done) => {
            spyOn(bus.logger, 'warn').and.callThrough();

            bus.enableMessageProxy({
                protectedChannels: ['auth-chan1'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const invalidProxyMessage =
                        new BusProxyMessage('mr. hacker', 'somechan', MessageType.MessageTypeRequest);
                    window.postMessage(invalidProxyMessage, '*',); // send message, origin is local karma
                }
            );

            bus.api.tickEventLoop(
                () => {
                    expect(bus.logger.warn)
                        .toHaveBeenCalledWith('Proxy Message valid, but channel is not authorized: [somechan]', 'ProxyControl');
                    done();
                }, 5
            );
        });
    });

    describe('Parent Proxying Behaviors', () => {

        let frame1: any, frame2: any, frame3: any;

        beforeEach(
            () => {
                bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
                bus.api.logger().silent(true);
                log = bus.api.logger();
            }
        );

        afterEach(
            () => {
                if (frame1) {
                    frame1.remove();
                }
                if (frame2) {
                    frame2.remove();
                }
                if (frame3) {
                    frame3.remove();
                }
            }
        );

        it('If a valid request message is received for an authorized channel, it is proxied.', (done) => {

            bus.listenRequestStream('ember-radio')
                .handle(
                    (payload: string) => {
                        expect(payload).toEqual('is it dinner time?');
                        done();
                    }
                );

            bus.enableMessageProxy({
                protectedChannels: ['ember-radio'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const validProxyMessage =
                        new BusProxyMessage('is it dinner time?', 'ember-radio', MessageType.MessageTypeRequest);
                    window.postMessage(validProxyMessage, '*'); // send message, origin is local karma
                }
            );

        });

        it('If a valid response message is received for an authorized channel, it is proxied.', (done) => {

            bus.listenStream('melody-radio')
                .handle(
                    (payload: string) => {
                        expect(payload).toEqual('can I get some more milk?');
                        done();
                    }
                );

            bus.enableMessageProxy({
                protectedChannels: ['melody-radio'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const validProxyMessage =
                        new BusProxyMessage('can I get some more milk?', 'melody-radio', MessageType.MessageTypeResponse);
                    window.postMessage(validProxyMessage, '*'); // send message, origin is local karma
                }
            );
        });

        it('If a valid error message is received for an authorized channel, it is proxied.', (done) => {
            bus.listenStream('melody-cry')
                .handle(
                    () => {
                        // if we end up in here, something's gone wrong.
                        expect(false).toBeTruthy();
                    },
                    (payload: string) => {
                        expect(payload).toEqual('I need to be changed');
                        done();
                    }
                );

            bus.enableMessageProxy({
                protectedChannels: ['melody-cry'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: null,
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    const validProxyMessage =
                        new BusProxyMessage('I need to be changed', 'melody-cry', MessageType.MessageTypeError);
                    window.postMessage(validProxyMessage, '*'); // send message, origin is local karma
                }
            );
        });

        it('If operating in parent mode and all frames are targeted, proxy should proxy.', (done) => {

            // inject a frame into to the dom.
            frame1 = document.createElement('iframe');
            frame2 = document.createElement('iframe');
            document.body.appendChild(frame1);
            document.body.appendChild(frame2);
            const frames: any = window.frames;

            expect(frames.length).toEqual(2);

            let completeCount = 0;
            const frameHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;
                const message: string = proxyMessage.payload;
                expect(message).toEqual('milk-time');
                completeCount++;
            }

            // check the frame got the
            frames[0].addEventListener('message', frameHandler, {capture: true});
            frames[1].addEventListener('message', frameHandler, {capture: true});

            bus.listenRequestStream('melody-happy')
                .handle(
                    (payload: string) => {
                        expect(payload).toEqual('milk-time');
                    },
                );

            bus.enableMessageProxy({
                protectedChannels: ['melody-happy'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: null
            });

            bus.sendRequestMessage('melody-happy', 'milk-time');

            bus.api.tickEventLoop(
                () => {
                    expect(completeCount).toEqual(2);
                    // frame1.remove();
                    // frame2.remove();
                    done();
                }, 10
            );
        });

        it('If operating in parent mode and there are select iframes in the dom, proxy should proxy.', (done) => {

            // inject a frame into to the dom.
            frame1 = document.createElement('iframe');
            frame1.id = 'frame-1';
            frame2 = document.createElement('iframe');
            frame2.id = 'frame-2';
            frame3 = document.createElement('iframe');
            frame3.id = 'frame-3';

            document.body.appendChild(frame1);
            document.body.appendChild(frame2);
            document.body.appendChild(frame3);
            const frames: any = window.frames;

            expect(frames.length).toEqual(3);

            let completeCount = 0;
            const frameHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;
                const message: string = proxyMessage.payload;
                expect(proxyMessage.channel).toEqual('melody-sleepy');
                expect(proxyMessage.type).toEqual(MessageType.MessageTypeRequest);
                expect(message).toEqual('will we sleep?');
                completeCount++;
            }

            // check the frame got the
            frames[0].addEventListener('message', frameHandler, {capture: true});
            frames[1].addEventListener('message', frameHandler, {capture: true});

            bus.listenRequestStream('melody-sleepy')
                .handle(
                    (payload: string) => {
                        expect(payload).toEqual('will we sleep?');
                    },
                );

            bus.enableMessageProxy({
                protectedChannels: ['melody-sleepy'],
                proxyType: ProxyType.Parent,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: false,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: ['frame-1', 'frame-2']
            });

            bus.sendRequestMessage('melody-sleepy', 'will we sleep?');

            bus.api.tickEventLoop(
                () => {
                    expect(completeCount).toEqual(2); // three frames, two events.
                    done();
                }, 20
            )

        });

        it('If operating in child mode, check messages are proxied up correctly.', (done) => {

            let complete: boolean = false;
            const msgHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;
                const message: string = proxyMessage.payload;
                expect(message).toEqual('giggles');
                complete = true;
            }

            // karma runs in an iframe. so we have to hook into our parent frame.
            window.parent.addEventListener('message', msgHandler, {capture: true});

            bus.listenRequestStream('melody-tickles')
                .handle(
                    (payload: string) => {
                        expect(payload).toEqual('giggles');
                    },
                );

            bus.enableMessageProxy({
                protectedChannels: ['melody-tickles'],
                proxyType: ProxyType.Child,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: null
            });

            bus.sendRequestMessage('melody-tickles', 'giggles');

            bus.api.tickEventLoop(
                () => {
                    expect(complete).toBeTruthy();
                    window.parent.removeEventListener('message', msgHandler);
                    done();
                }, 1000
            )

        });

    });

    fdescribe('Proxy Control Behaviors', () => {

        beforeEach(
            () => {
                bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
                bus.api.logger().silent(true);
                log = bus.api.logger();
            }
        );

        it('Check child bus registration is captured and handled by parent', (done) => {

            let complete: boolean = false;
            const msgHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;
                window.postMessage(proxyMessage, '*');

            }

            // karma runs in an iframe. so we have to hook into our parent frame.
            window.parent.addEventListener('message', msgHandler, {capture: true});


            const control = bus.enableMessageProxy({
                protectedChannels: ['melody-tickles'],
                proxyType: ProxyType.Child,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {
                    expect(control.getKnownBusInstances().size).toEqual(1);
                    expect(control.getKnownBusInstances().get(EventBus.id).active).toBeTruthy();
                    expect(control.getKnownBusInstances().get(EventBus.id).type).toEqual(ProxyType.Child);

                    window.parent.removeEventListener('message', msgHandler);
                    control.stopListening();

                    done();
                }, 10
            )

        });

        it('Check child bus can chose to enable its state with parent', (done) => {

            let complete: boolean = false;
            const msgHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;

                // post a message to the window, because of Karma's iframe set up we need to manually perform this
                window.postMessage(proxyMessage, '*');
            };

            // karma runs in an iframe. so we have to hook into our parent frame.
            window.parent.addEventListener('message', msgHandler, {capture: true});

            const control = bus.enableMessageProxy({
                protectedChannels: ['melody-tickles'],
                proxyType: ProxyType.Child,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                    expect(control.getKnownBusInstances().size).toEqual(1);
                    expect(control.getKnownBusInstances().get(EventBus.id).active).toBeTruthy();
                    expect(control.getKnownBusInstances().get(EventBus.id).type).toEqual(ProxyType.Child);

                    window.parent.removeEventListener('message', msgHandler);
                    control.stopListening();
                    done();

                },10
            );

        });

        it('Check child bus can chose to disable its state with parent', (done) => {

            let complete: boolean = false;
            const msgHandler = (evt: MessageEvent) => {
                const proxyMessage: BusProxyMessage = evt.data;

                // post a message to the window, because of Karma's iframe set up we need to manually perform this
                window.postMessage(proxyMessage, '*');
            };

            // karma runs in an iframe. so we have to hook into our parent frame.
            window.parent.addEventListener('message', msgHandler, {capture: true});

            const control = bus.enableMessageProxy({
                protectedChannels: ['melody-tickles'],
                proxyType: ProxyType.Child,
                acceptedOrigins: ['http://localhost:9876'], // local karma
                targetAllFrames: true,
                parentOrigin: 'http://localhost:9876',
                targetSpecificFrames: null
            });

            bus.api.tickEventLoop(
                () => {

                  control.stopListening();

                },10
            );

            bus.api.tickEventLoop(
                () => {

                    expect(control.getKnownBusInstances().size).toEqual(1);
                    expect(control.getKnownBusInstances().get(EventBus.id).active).toBeFalsy();
                    expect(control.getKnownBusInstances().get(EventBus.id).type).toEqual(ProxyType.Child);

                    window.parent.removeEventListener('message', msgHandler);
                    control.stopListening();
                    done();

                },15
            );

        });

    });
});