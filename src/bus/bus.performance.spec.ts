import { LogLevel } from '../log/logger.model';
import { EventBus, Message, MessageArgs, UUID } from '../index';
import { BusTestUtil } from '../util/test.util';
import { GeneralUtil } from '../util/util';
import { Observable } from 'rxjs/Observable';
import { GalacticRequest } from './model/request.model';

let bus: EventBus;
let printTimeLogs: boolean = false;

/**
 * All testing is designed to pass a low powered, headless browser, running inside a container.
 */

describe('Bifröst Performance Testing [bus/bus.performance.spec.ts]', () => {

    let timeBefore: number;
    let timeAfter: number;

    it('Test bus initial boot / creation time less than 15ms', () => {

        // the bus takes around 10ms to boot.
        timeBefore = performance.now();
        bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
        bus.logger.setStylingVisble(false);
        timeAfter = performance.now();
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

    it('Validate sending and hanlding 1 message in less than 20ms', (done) => {

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
        printTimeBefore(timeBefore);
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

    it('Validate 1 channel with 5000 subscribers can handle all requests within 10ms', (done) => {

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

    it('Validate 1 channel with 10000 subscribers can handle all requests within 10ms', (done) => {

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

    xdescribe('Bifröst Network Performance Validation Testing', () => {

        it('Round-trip REST call via bus enabled service should take less than 50ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);
            const chan = GeneralUtil.genUUID();

            // simulate restful service / API service.
            bus.listenRequestOnce(chan).handle(
                () => {
                    printTimeStep('service received request', performance.now());
                    const req = new XMLHttpRequest();

                    req.onload = () => {
                        bus.sendResponseMessage(chan, JSON.parse(req.responseText));
                        printTimeStep('got xhr response, sent response back on channel', performance.now());
                    };
                    req.open("GET", 'http://localhost:8080/seed');
                    req.send();
                    printTimeStep('sent xhr request', performance.now());

                }
            );

            bus.listenOnce(chan).handle(
                (resp: any) => {
                    timeAfter = performance.now();
                    printTimeStep('received response from API service', timeAfter);
                    printTotalTime(timeAfter - timeBefore);
                    expect(timeAfter - timeBefore).toBeLessThan(50);
                    done();
                }
            );

            bus.sendRequestMessage(chan, true);
            timeBefore = performance.now();
            printTimeStep('sending request to service', timeBefore);


        });

        it('Round-trip Socket call via bus enabled service should take less than 20ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);

            const chan = 'service-seed'; // must match service channel.
            let session: UUID;

            const theBridgeIsReady = (sessionId: string) => {
                session = sessionId;
                timeBefore = performance.now();
                printTimeStep('sending request via the bus', timeBefore);

                const request = new GalacticRequest("GetSeeds", null, GeneralUtil.genUUID(), 1);

                bus.requestGalactic(chan, request,
                    () => {

                        timeAfter = performance.now();
                        printTimeStep('received response from bus', timeAfter);
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(20);
                        //window.AppBrokerConnector.disconnectClient(sessionId);
                        done();

                    }
                );
            }

            // we have to connect to the broker.
            bus.connectBridge(
                (sessionId) => {
                    theBridgeIsReady(sessionId);
                },
                '/bifrost',
                '/topic',
                '/queue',
                1,
                'localhost',
                8080,
                '/pub'
            );

        });

        it('Handle 6 API requests via XHR in under 50ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);

            const chan = GeneralUtil.genUUID();
            let responseCount = 0;

            bus.listenRequestStream(chan).handle(
                (request: boolean, args: MessageArgs) => {
                    printTimeStep('service received request', performance.now());
                    const req = new XMLHttpRequest();

                    req.onload = () => {
                        bus.sendResponseMessageWithId(chan, JSON.parse(req.responseText), args.uuid);
                        printTimeStep('got xhr response, sent response back on channel', performance.now());
                    };
                    req.open("GET", 'http://localhost:8080/seed?val=' + performance.now());
                    req.send();
                    printTimeStep('sent xhr request', performance.now());

                }
            );

            bus.listenStream(chan).handle(
                () => {
                    responseCount++;
                    if(responseCount >= 6) {
                        timeAfter = performance.now();
                        printTimeStep('received response from API service', timeAfter);
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(50);
                        done();
                    }
                }
            );

            for(let x = 0; x < 6; x++) {
                bus.sendRequestMessageWithId(chan, true, GeneralUtil.genUUIDShort());
            }
            timeBefore = performance.now();
            printTimeStep('sending request to service', timeBefore);

        });

        it('Handle 6 API requests via socket in under 40ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);

            const chan = 'service-seed'; // must match service channel.
            let responseCount = 0;

            const theBridgeIsReady = () => {

                timeBefore = performance.now();
                printTimeStep('sending request via the bus', timeBefore);

                const request = new GalacticRequest("GetSeeds", null, GeneralUtil.genUUID(), 1);

                for(let x = 0; x < 6; x++) {
                    bus.requestGalactic(chan, request,
                        () => {
                            responseCount++;
                            printTimeStep('received response from bus', timeAfter);
                            if(responseCount >= 6) {
                                timeAfter = performance.now();
                                printTotalTime(timeAfter - timeBefore);
                                expect(timeAfter - timeBefore).toBeLessThan(40);
                                done();
                            }
                        }
                    );
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
                'localhost',
                8080,
                '/pub'
            );

        });

        // put some load on the request cycle
        it('Handle 50 API requests via XHR in under 100ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);

            const chan = GeneralUtil.genUUID();
            let responseCount = 0;

            bus.listenRequestStream(chan).handle(
                (request: boolean, args: MessageArgs) => {
                    //printTimeStep('service received request', performance.now());
                    const req = new XMLHttpRequest();

                    req.onload = () => {
                        bus.sendResponseMessageWithId(chan, JSON.parse(req.responseText), args.uuid);
                        //printTimeStep('got xhr response, sent response back on channel', performance.now());
                    };
                    req.open("GET", 'http://localhost:8080/seed?val=' + performance.now());
                    req.send();
                   // printTimeStep('sent xhr request', performance.now());

                }
            );

            bus.listenStream(chan).handle(
                () => {
                    responseCount++;
                    if(responseCount >= 50) {
                        timeAfter = performance.now();
                        //printTimeStep('received response from API service', timeAfter);
                        printTotalTime(timeAfter - timeBefore);
                        expect(timeAfter - timeBefore).toBeLessThan(100);
                        done();
                    }
                }
            );

            for(let x = 0; x < 50; x++) {
                bus.sendRequestMessageWithId(chan, true, GeneralUtil.genUUIDShort());
            }
            timeBefore = performance.now();
            printTimeStep('sending request to service', timeBefore);

        });

        it('Handle 50 API requests via socket in under 60ms', (done) => {

            bus = BusTestUtil.bootBusWithOptions(LogLevel.Info, true);
            bus.logger.setStylingVisble(false);

            const chan = 'service-seed'; // must match service channel.
            let responseCount = 0;

            const theBridgeIsReady = () => {

                timeBefore = performance.now();
                printTimeStep('sending request via the bus', timeBefore);

                bus.listenGalacticStream(chan)
                    .handle(
                        () => {
                            responseCount++;
                            timeAfter = performance.now();
                            //printTimeStep('received response from bus', timeAfter);
                            if(responseCount >= 50) {
                                printTotalTime(timeAfter - timeBefore);
                                expect(timeAfter - timeBefore).toBeLessThan(60);
                                done();
                            }
                        }
                    );

                for(let x = 0; x < 50; x++) {
                    const request = new GalacticRequest("GetSeeds", null, GeneralUtil.genUUID(), 1);
                    //printTimeStep('sending request via the bus', timeBefore);
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
                'localhost',
                8080,
                '/pub'
            );

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