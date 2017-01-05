/**
 * Copyright(c) VMware Inc., 2016
 */
import {inject, TestBed} from '@angular/core/testing';
import {Injector} from '@angular/core';

import {Syslog} from '../log/syslog';
import {LogUtil} from '../log/util';
import {LogLevel} from '../log/logger.model';
import {Message} from './message.model';
import {MessagebusService} from './index';

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
    const testChannel = 'test-channel';
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

    it('Should check messageLog', () => {
        bus.messageLog(testMessage, getName());
        expect(bus.logger()
            .last())
            .toBe(response);
        bus.setLogLevel(LogLevel.Off);
        expect(bus.logger().logLevel)
            .toBe(LogLevel.Off);
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
        let channel = bus.getChannel(testChannel, getName());
        let channel2 = bus.getChannel(testChannel, getName());

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
        let channel = bus.getResponseChannel(testChannel, getName());
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
});

