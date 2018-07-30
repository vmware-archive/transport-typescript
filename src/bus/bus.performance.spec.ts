import { LogLevel } from '../log/logger.model';
import { EventBus, Message, MessageArgs } from '../index';
import { BusTestUtil } from '../util/test.util';
import { GeneralUtil } from '../util/util';
import { Observable } from 'rxjs';
import { GalacticRequest } from './model/request.model';

let bus: EventBus;
let printTimeLogs: boolean = true;

/**
 * All testing is designed to pass a low powered, headless browser, running inside a container.
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

xdescribe('Bifröst Performance Testing [bus/bus.performance.spec.ts]', () => {

    let timeBefore: number;
    let timeAfter: number;

    it('Test bus initial boot / creation time less than 15ms', () => {

        // the bus takes around 10ms to boot.
        timeBefore = performance.now();
        bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
        bus.logger.setStylingVisble(false);
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(15);

    });

    it('Validate 500 channels can be created and destroyed in less than 200ms', () => {

        timeBefore = performance.now();
        for (let x = 0; x < 500; x++) {
            const channelName = GeneralUtil.genUUID();
            bus.api.getChannel(channelName);
            bus.api.close(channelName);
        }
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(200);

    });

    it('Validate that 5,000 channels can be created and destroyed in less than 1500ms', () => {

        timeBefore = performance.now();
        for (let x = 0; x < 5000; x++) {
            const channelName = GeneralUtil.genUUID();
            bus.api.getChannel(channelName);
            bus.api.close(channelName);
        }
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(1500);

    });

    it('Validate 10,000 channels can be created and destroyed in less than 1500ms', () => {

        timeBefore = performance.now();
        for (let x = 0; x < 10000; x++) {
            const channelName = GeneralUtil.genUUID();
            bus.api.getChannel(channelName);
            bus.api.close(channelName);
        }
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(1500);

    });

    it('Validate 100 channels can be created, subscribed to, un-subscribed from and destroyed in less than 10ms', () => {

        timeBefore = performance.now();
        for (let x = 0; x < 100; x++) {
            const channelName = GeneralUtil.genUUID();
            const channel: Observable<Message> = bus.api.getChannel(channelName);
            const sub = channel.subscribe(
                () => {
                }
            );
            sub.unsubscribe();
            bus.api.close(channelName);
        }
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(100);

    });

    it('Validate 1000 channels can be created, subscribed to, un-subscribed from and destroyed in less than 200ms', () => {

        timeBefore = performance.now();
        for (let x = 0; x < 1000; x++) {
            const channelName = GeneralUtil.genUUID();
            const channel: Observable<Message> = bus.api.getChannel(channelName);
            const sub = channel.subscribe(
                () => {
                }
            );
            sub.unsubscribe();
            bus.api.close(channelName);
        }
        timeAfter = performance.now();
        printTotalTime(timeAfter - timeBefore);
        expect(timeAfter - timeBefore).toBeLessThan(200);

    });

    it('Create initial channel (allow accurate performance checking on subsequent event handling)', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);
        bus.sendRequestMessage(channelName, 'hello boot');
        const sub = channel.subscribe(
            () => {
                sub.unsubscribe();
                bus.api.close(channelName);
                done();
            }
        );
        bus.sendRequestMessage(channelName, 'hello boot');
    });

    it('Validate sending and handling 1 message in less than 20ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);
        const sub = channel.subscribe(
            () => {

                timeAfter = performance.now();
                //printTimeAfter(timeAfter);
                printTotalTime(timeAfter - timeBefore);
                expect(timeAfter - timeBefore).toBeLessThan(20);
                sub.unsubscribe();
                bus.api.close(channelName);
                done();
            }
        );
        timeBefore = performance.now();
        bus.sendRequestMessage(channelName, 'hello ember');

    });

    it('Validate 1000 messages being sent and handled in less than 100ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);
        let count = 0;
        const sub = channel.subscribe(
            () => {

                if (count >= 999) {
                    //printTimeAfter(performance.now());
                    timeAfter = performance.now();
                    printTotalTime(timeAfter - timeBefore);
                    expect(timeAfter - timeBefore).toBeLessThan(100);
                    sub.unsubscribe();
                    bus.api.close(channelName);

                    done();
                }
                count++;
            }
        );
        timeBefore = performance.now();
        //printTimeBefore(timeBefore);
        for (let x = 0; x < 1000; x++) {
            bus.sendRequestMessage(channelName, 'hello fox');
        }
    });


    it('Validate 10,000 messages being sent and handled in less than 700ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);
        let count = 0;
        const sub = channel.subscribe(
            () => {

                if (count >= 9999) {
                    //printTimeAfter(performance.now());
                    timeAfter = performance.now();
                    printTotalTime(timeAfter - timeBefore);
                    expect(timeAfter - timeBefore).toBeLessThan(700);
                    sub.unsubscribe();
                    bus.api.close(channelName);
                    done();
                }
                count++;
            }
        );
        timeBefore = performance.now();
        //printTimeBefore(timeBefore);
        for (let x = 0; x < 10000; x++) {
            bus.sendRequestMessage(channelName, 'hello cotton');
        }
    });

    it('Validate 1 channel with 100 subscribers can handle all requests within 10ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);

        let subscriberEventCount = 0;

        let subArray = [];
        for (let x = 0; x < 100; x++) {
            subArray.push(channel.subscribe(
                () => {
                    subscriberEventCount++;
                    if (subscriberEventCount >= 100) {
                        timeAfter = performance.now();
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(10);
                        done();
                    }
                }
            ));
        }
        timeBefore = performance.now();
        //printTimeBefore(timeBefore);
        bus.sendRequestMessage(channelName, 'hello maggie');
    });

    it('Validate 1 channel with 5,000 subscribers can handle all requests within 10ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);

        let subscriberEventCount = 0;

        let subArray = [];
        for (let x = 0; x < 5000; x++) {
            subArray.push(channel.subscribe(
                () => {
                    subscriberEventCount++;
                    if (subscriberEventCount >= 5000) {
                        timeAfter = performance.now();
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(10);
                        done();
                    }
                }
            ));
        }
        timeBefore = performance.now();
        //printTimeBefore(timeBefore);
        bus.sendRequestMessage(channelName, 'hello maggie');
    });

    it('Validate 1 channel with 10,000 subscribers can handle all requests within 15ms', (done) => {

        const channelName = GeneralUtil.genUUID();
        const channel: Observable<Message> = bus.api.getChannel(channelName);

        let subscriberEventCount = 0;

        let subArray = [];
        for (let x = 0; x < 10000; x++) {
            subArray.push(channel.subscribe(
                () => {
                    subscriberEventCount++;
                    if (subscriberEventCount >= 10000) {
                        timeAfter = performance.now();
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(15);
                        done();
                    }
                }
            ));
        }
        timeBefore = performance.now();
        //printTimeBefore(timeBefore);
        bus.sendRequestMessage(channelName, 'hello maggie');
    });

    it('Validate 100 channels with 100 subscribers each can handle all requests within 60ms', (done) => {

        let chanArray = [];
        for (let x = 0; x < 100; x++) {
            chanArray.push(bus.api.getChannel('chan-' + x));
        }

        let subscriberEventCount = 0;
        let subArray = [];
        let counter = 0;

        timeBefore = performance.now();
        for(let channel of chanArray) {
            for (let x = 0; x < 100; x++) {
                subArray.push(channel.subscribe(
                    () => {
                        subscriberEventCount++;
                        if (subscriberEventCount >= 10000) {
                            timeAfter = performance.now();
                            printTotalTime(timeAfter - timeBefore);
                            expect(timeAfter - timeBefore).toBeLessThan(60);
                            done();
                        }
                    }
                ));
            }
            bus.sendRequestMessage('chan-' + counter, 'hello pups');
            counter++;
        }
    });

    // this test generates 100k events over 100 channels, each with a thousand subscribers
    it('Validate 100 channels with 1000 subscribers each can handle all requests within 500ms', (done) => {

        let chanArray = [];
        for (let x = 0; x < 100; x++) {
            chanArray.push(bus.api.getChannel('chan-big-' + x));
        }

        let subscriberEventCount = 0;
        let subArray = [];
        let counter = 0;

        timeBefore = performance.now();
        for(let channel of chanArray) {
            for (let x = 0; x < 1000; x++) {
                subArray.push(channel.subscribe(
                    () => {
                        subscriberEventCount++;
                        if (subscriberEventCount >= 100000) {
                            timeAfter = performance.now();
                            printTotalTime(timeAfter - timeBefore);
                            expect(timeAfter - timeBefore).toBeLessThan(5000);
                            done();
                        }
                    }
                ));
            }
            bus.sendRequestMessage('chan-big-' + counter, 'hello lots of pups');
            counter++;
        }
    });

    // this test generates 100k events over 1000 channels each with 100 subscribers
    it('Validate 1000 channels with 100 subscribers each can handle all requests within 400ms', (done) => {

        let chanArray = [];
        for (let x = 0; x < 1000; x++) {
            chanArray.push(bus.api.getChannel('chan-biggest-' + x));
        }

        let subscriberEventCount = 0;
        let subArray = [];
        let counter = 0;

        timeBefore = performance.now();
        for(let channel of chanArray) {
            for (let x = 0; x < 100; x++) {
                subArray.push(channel.subscribe(
                    () => {
                        subscriberEventCount++;
                        if (subscriberEventCount >= 100000) {
                            timeAfter = performance.now();
                            printTotalTime(timeAfter - timeBefore);
                            expect(timeAfter - timeBefore).toBeLessThan(4000);
                            done();
                        }
                    }
                ));
            }
            bus.sendRequestMessage('chan-biggest-' + counter, 'hello to all of the pups');
            counter++;
        }
    });

    describe('Bifröst Local Network Performance Validation Testing', () => {

        it('Round-trip XHR call via bus enabled service should take less than 50ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 1, done, 50, 'seed');
        });

        it('Round-trip Socket call via bus enabled service should take less than 20ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 1, done, 20, 'GetSeeds');
        });

        it('Handle 6 API requests via XHR in under 50ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 6, done, 50, 'seed');
        });

        it('Handle 6 API requests via socket in under 40ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 6, done, 40, 'GetSeeds');
        });

        it('Handle 50 API requests via XHR in under 120ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 50, done, 120, 'seed');
        });

        it('Handle 50 API requests via socket in under 60ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 50, done, 60, 'GetSeeds');
        });

        it('Handle 100 API requests via XHR in under 220ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 100, done, 220, 'seed');
        });

        it('Handle 100 API requests via socket in under 120ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 100, done, 120, 'GetSeeds');
        });

        it('Handle 200 API requests via XHR in under 400ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 200, done, 400, 'seed');
        });

        it('Handle 200 API requests via socket in under 220ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 200, done, 220, 'GetSeeds');
        });

        it('Handle 300 API requests via XHR in under 800ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 300, done, 800, 'seed');
        });

        it('Handle 300 API requests via socket in under 420ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 300, done, 420, 'GetSeeds');
        });

        it('Handle 400 API requests via XHR in under 1200ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 400, done, 1200, 'seed');
        });

        it('Handle 400 API requests via socket in under 620ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 400, done, 620, 'GetSeeds');
        });

        it('Handle 500 API requests via XHR in under 1300ms', (done) => {
            runApiPerformanceTestOverXHR('localhost', 500, done, 1300, 'seed');
        });

        it('Handle 500 API requests via socket in under 720ms', (done) => {
            runApiPerformanceTestOverSocket('localhost', 500, done, 720, 'GetSeeds');
        });

        it('Handle 1 Custom Logic request via socket in under 10ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 1, done, 10);
        });

        it('Handle 1 Custom Logic request via XHR in under 50ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 1, done, 50);
        });


        it('Handle 6 Custom Logic requests via socket in under 50ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 50, done, 50);
        });

        it('Handle 6 Custom Logic requests via XHR in under 100ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 6, done, 100);
        });

        it('Handle 50 Custom Logic requests via XHR in under 120ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 50, done, 120);
        });

        it('Handle 50 Custom Logic requests via socket in under 80ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 50, done, 80);
        });

        it('Handle 100 Custom Logic requests via XHR in under 200ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 100, done, 200);
        });

        it('Handle 100 Custom Logic requests via socket in under 120ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 100, done, 120);
        });

        it('Handle 200 Custom Logic requests via XHR in under 400ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 200, done, 400);
        });

        it('Handle 200 Custom Logic requests via socket in under 250ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 200, done, 250);
        });

        it('Handle 300 Custom Logic requests via XHR in under 700ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 300, done, 700);
        });

        it('Handle 300 Custom Logic requests via socket in under 350ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 300, done, 350);
        });

        it('Handle 400 Custom Logic requests via XHR in under 900ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 400, done, 900);
        });

        it('Handle 300 Custom Logic requests via socket in under 450ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 400, done, 450);
        });

        it('Handle 500 Custom Logic requests via XHR in under 900ms', (done) => {
            runCustomApiPerformanceTestOverXHR('localhost', 500, done, 900);
        });

        it('Handle 500 Custom Logic requests via socket in under 550ms', (done) => {
            runCustomApiPerformanceTestOverSocket('localhost', 500, done, 550);
        });
    });

    describe('Bifröst Remote Network Performance Validation Testing', () => {

        it('(Remote) Round-trip XHR call via bus enabled service should take less than 90ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 1, done, 90, 'seed');
        });

        it('(Remote) Round-trip Socket call via bus enabled service should take less than 40ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 1, done, 40, 'GetSeeds');
        });
        
        it('(Remote) Handle 6 API requests via XHR in under 100ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 6, done, 100, 'seed');
        });

        it('(Remote) Handle 6 API requests via socket in under 50ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 6, done, 50, 'GetSeeds');
        });

        it('(Remote) Handle 50 API requests via XHR in under 300ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 50, done, 300, 'seed');
        });

        it('(Remote) Handle 50 API requests via socket in under 100ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 50, done, 100, 'GetSeeds');
        });

        it('(Remote) Handle 100 API requests via XHR in under 700ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 100, done, 700, 'seed');
        });

        it('(Remote) Handle 100 API requests via socket in under 150ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 100, done, 150, 'GetSeeds');
        });

        it('(Remote) Handle 200 API requests via XHR in under 1100ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 200, done, 1100, 'seed');
        });

        it('(Remote) Handle 200 API requests via socket in under 250ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 200, done, 250, 'GetSeeds');
        });

        it('(Remote) Handle 300 API requests via XHR in under 1700ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 300, done, 1700, 'seed');
        });

        it('(Remote) Handle 300 API requests via socket in under 520ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 300, done, 520, 'GetSeeds');
        });

        it('(Remote) Handle 400 API requests via XHR in under 2200ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 400, done, 2200, 'seed');
        });

        it('(Remote) Handle 400 API requests via socket in under 620ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 400, done, 620, 'GetSeeds');
        });

        it('(Remote) Handle 500 API requests via XHR in under 2800ms', (done) => {
            runApiPerformanceTestOverXHR('quobix.com', 500, done, 2800, 'seed');
        });

        it('(Remote) Handle 500 API requests via socket in under 900ms', (done) => {
            runApiPerformanceTestOverSocket('quobix.com', 500, done, 900, 'GetSeeds');
        });

        it('(Remote) Handle 1 Custom Logic request via XHR in under 50ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 1, done, 50);
        });

        it('(Remote) Handle 1 Custom Logic request via socket in under 30ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 1, done, 30);
        });

        it('(Remote) Handle 6 Custom Logic requests via XHR in under 150ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 6, done, 150);
        });

        it('(Remote) Handle 6 Custom Logic requests via socket in under 40ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 6, done, 40);
        });

        it('(Remote) Handle 50 Custom Logic requests via XHR in under 350ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 50, done, 350);
        });

        it('(Remote) Handle 50 Custom Logic requests via socket in under 90ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 50, done, 90);
        });

        it('(Remote) Handle 100 Custom Logic requests via XHR in under 600ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 100, done, 600);
        });

        it('(Remote) Handle 100 Custom Logic requests via socket in under 120ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 100, done, 120);
        });

        it('(Remote) Handle 200 Custom Logic requests via XHR in under 1200ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 200, done, 1200);
        });

        it('(Remote) Handle 200 Custom Logic requests via socket in under 250ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 200, done, 250);
        });

        it('(Remote) Handle 300 Custom Logic requests via XHR in under 1400ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 300, done, 1400);
        });

        it('(Remote) Handle 300 Custom Logic requests via socket in under 400ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 300, done, 400);
        });

        it('(Remote) Handle 400 Custom Logic requests via XHR in under 2100ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 400, done, 2100);
        });

        it('(Remote) Handle 400 Custom Logic requests via socket in under 600ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 400, done, 600);
        });

        it('(Remote) Handle 500 Custom Logic requests via XHR in under 2500ms', (done) => {
            runCustomApiPerformanceTestOverXHR('quobix.com', 500, done, 2500);
        });

        it('(Remote) Handle 500 Custom Logic requests via socket in under 800ms', (done) => {
            runCustomApiPerformanceTestOverSocket('quobix.com', 500, done, 800);
        });

    });

});

function printTimeBefore(time: number) {
    if (printTimeLogs) {
        bus.logger.info("time before: " + time);
    }
}

function printTimeStep(step: string, time: number) {
    if (printTimeLogs) {
        bus.logger.info("time " + step + ": " + time);
    }
}

function printTimeAfter(time: number) {
    if (printTimeLogs) {
        bus.logger.info("time after: " + time);
    }
}

function printTotalTime(time: number) {
    if (printTimeLogs) {
        bus.logger.info("execution time total ms: " + time);
    }
}


function runApiPerformanceTestOverSocket(host: string, loops: number, done: Function, expectedRunTime: number, command: string) {

    bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
    bus.logger.setStylingVisble(false);

    const chan = 'service-seed'; // must match service channel.
    let responseCount = 0;
    let timeBefore: number, timeAfter: number;

    const theBridgeIsReady = () => {

        timeBefore = performance.now();
        bus.listenGalacticStream(chan)
            .handle(
                () => {
                    responseCount++;
                    timeAfter = performance.now();
                    if(responseCount >= loops) {

                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(expectedRunTime);
                        bus.closeGalacticChannel('service-seed');
                        done();
                    }
                }
            );

        for(let x = 0; x < loops; x++) {
            const request = new GalacticRequest(command, null, GeneralUtil.genUUID(), 1);
            bus.sendGalacticMessage(chan, request);

        }
    }

    // we have to connect to the broker.
    bus.connectBridge(
        () => {
            theBridgeIsReady();
        },
        '/bifrost',
        '/topic',
        '/queue',
        1,
        host,
        8080,
        '/pub'
    );
}

function runCustomApiPerformanceTestOverSocket(host: string, loops: number, done: Function, expectedRunTime: number) {
    runApiPerformanceTestOverSocket(host, loops, done, expectedRunTime, 'CustomLogic');
}

function runApiPerformanceTestOverXHR(host: string, loops: number, done: Function, expectedRunTime: number, command: string) {
    bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
    bus.logger.setStylingVisble(false);

    const chan = GeneralUtil.genUUID();
    let responseCount = 0;
    let timeBefore: number, timeAfter: number;

    bus.listenRequestStream(chan).handle(
        (request: boolean, args: MessageArgs) => {
            const req = new XMLHttpRequest();

            req.onload = () => {
                bus.sendResponseMessageWithId(chan, JSON.parse(req.responseText), args.uuid);

            };
            req.open("GET", `http://${host}:8080/${command}?val=` + performance.now());
            req.send();

        }
    );

    bus.listenStream(chan).handle(
        () => {
            responseCount++;
            if(responseCount >= loops) {
                timeAfter = performance.now();

                printTotalTime(timeAfter - timeBefore);
                expect(timeAfter - timeBefore).toBeLessThan(expectedRunTime);
                done();

            }
        }
    );

    for(let x = 0; x < loops; x++) {
        bus.sendRequestMessageWithId(chan, true, GeneralUtil.genUUIDShort());
    }
    timeBefore = performance.now();
}

function runCustomApiPerformanceTestOverXHR(host: string, loops: number, done: Function, expectedRunTime: number) {
    runApiPerformanceTestOverXHR(host, loops, done, expectedRunTime, 'seed/custom');
}
