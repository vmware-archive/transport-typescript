import { EventBus, ORG_ID, ORGS } from '../bus.api';
import { Logger, LogLevel } from '../log';
import { BusTestUtil } from '../util/test.util';
import { BrokerConnector } from '../bridge';

/**
 * Copyright(c) VMware Inc. 2019
 */

describe('Fabric Essentials [fabric/fabric.spec]', () => {

    let bus: EventBus;
    let log: Logger;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);
            bus.enableDevMode();
            log = bus.api.logger();
        }
    );

    it('Check default connected state is false',
        () => {
            expect(bus.fabric.isConnected()).toBeFalsy();
        }
    );

    it('Check connect works',
        (done) => {
            bus.fabric.connect(
                (sessionId: string) => {
                    expect(sessionId).not.toBeNull();
                    done();
                },
                () => {
                }
            );

        }
    );

    it('Check disconnect works',
        (done) => {
            bus.fabric.connect(
                () => {
                    bus.fabric.disconnect();
                },
                () => {
                    done();
                }
            );
        }
    );

    it('Check connect works when called twice',
        (done) => {

            let counter = 0;
            bus.fabric.connect(
                () => {
                    counter++;
                    if (counter > 1) {
                        done();
                    } else {
                        bus.fabric.connect(null, null);
                    }
                },
                () => {
                }
            );

        }
    );

    it('Check org ID can be set.',
        () => {
            bus.fabric.setFabricCurrentOrgId('123-abc');
            expect(bus.stores.getStore(ORGS).get(ORG_ID)).toEqual('123-abc');
        }
    );

    it('Check offline event listeners work',
        (done) => {
            let connectCount = 0;
            bus.fabric.connect(
                () => {
                    connectCount++;
                    const offlineEvent = new Event('offline');
                    bus.api.tickEventLoop(
                        () => {
                            window.dispatchEvent(offlineEvent);
                        }, 20
                    );
                },
                () => {
                    done();
                }
            );
        }
    );

    // throwing strange jasmine error, disabled for now.
   xit('Check online event listeners work',
        (done) => {

            let connectCount = 0;

            bus.fabric.connect(
                () => {
                    connectCount++;
                    if (connectCount > 1) {
                        done();
                    } else {
                        bus.fabric.disconnect();
                    }
                },
                () => {
                    const onlineEvent = new Event('online');
                    window.dispatchEvent(onlineEvent);
                }
            );
        }
    );

    it('Check a valid fabric request object can be generated',
        () => {

            const fabricRequest = bus.fabric.generateFabricRequest('testCommand', 'hello');
            expect(fabricRequest.payload).toBe('hello');
            expect(fabricRequest.request).toBe('testCommand');

        }
    );

});