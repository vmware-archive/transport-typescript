/*
 * Copyright 2019-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { EventBus, ORG_ID, ORGS } from '../bus.api';
import { Logger, LogLevel } from '../log';
import { BusTestUtil } from '../util/test.util';
import { FabricConnectionState } from '../fabric.api';
import { FabricApiImpl } from './fabric';
import { BusStore, Message } from '../bus';
import { GeneralUtil } from '../util/util';
import { FabricConnectionStoreKey, Stores } from './fabric.model';
import { Subscription } from 'rxjs';

/**
 * Copyright(c) VMware Inc. 2019
 */

describe('Fabric Essentials [fabric/fabric.spec]', () => {

    let bus: EventBus;
    let log: Logger;
    let bcSub: Subscription;

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

    it('Check calling any Fabric method while not connected would print out a warning', () => {
        spyOn(bus.logger, 'error').and.callThrough();
        bus.fabric.isConnected();
        expect(bus.logger.error).toHaveBeenCalledWith('Could not determine the default connection string. No active broker connection detected.', 'FabricApi');
    });

    it('Check default connected state is false',
        () => {
            expect(bus.fabric.isConnected('testhost:12345/fabric')).toBeFalsy();
        }
    );

    it('Check connect works',
        (done) => {
            bus.fabric.connect(
                (sessionId: string) => {
                    expect(sessionId).not.toBeNull();
                    spyOn(bus.logger, 'error').and.callThrough();
                    bus.fabric.isConnected();
                    expect(bus.logger.error).not.toHaveBeenCalled();
                    done();
                },
                () => {
                }
            );

        }
    );

    it('Check connect works with different values',
        (done) => {
            bus.fabric.connect(
                (sessionId: string) => {
                    expect(sessionId).not.toBeNull();
                    done();
                },
                () => {
                },
                'somehost',
                8080,
                '/somewhere',
                '/jabber',
                '/blabber',
                1,
                true
            );

        }
    );

    it('Check disconnect works',
        (done) => {
            bus.fabric.connect(
                () => {
                    bus.fabric.disconnect('testhost:12345/fabric');
                },
                () => {
                    done();
                },
                'testhost',
                12345,
                '/fabric'
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

            bus.fabric.whenConnectionStateChanges('testhost:12345/fabric')
                .subscribe(
                    (state: FabricConnectionState) => {
                        if (state === FabricConnectionState.Disconnected) {
                            const onlineEvent = new Event('online');
                            window.dispatchEvent(onlineEvent);

                        }
                        if (state === FabricConnectionState.Connected) {
                            if (connectCount <= 1) {
                                bus.fabric.disconnect('testhost:12345/fabric');
                            }
                        }
                    }
                );

            bus.fabric.connect(
                () => {
                    connectCount++;
                    if (connectCount >= 2) {
                        done();
                    }
                },
                () => {
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

    it('Check a valid fabric response object can be generated',
        () => {

            const fabricResponse = bus.fabric.generateFabricResponse('123', 'hello');
            expect(fabricResponse.payload).toBe('hello');
            expect(fabricResponse.id).toBe('123');

        }
    );

    it('Check for connection state change to connected',
        (done) => {
            bus.fabric.whenConnectionStateChanges('testhost:12345/fabric')
                .subscribe(
                    (state: FabricConnectionState) => {
                        expect(state).toEqual(FabricConnectionState.Connected);
                        done();
                    }
                );
            bus.fabric.connect(() => {
            }, () => {
            }, 'testhost', 12345, '/fabric');
        }
    );

    it('Check fabric version API works.',
        (done) => {

            bus.api.getRequestChannel(FabricApiImpl.versionChannel)
                .subscribe(
                    (msg: Message) => {
                        expect(msg.payload).not.toBeNull();
                        msg.payload.payload = '1.2.3'; // set payload of response, to be 1.2.3
                                                       // , assign response to payload of message.
                        bus.sendResponseMessageWithId(FabricApiImpl.versionChannel, msg.payload, msg.payload.id);
                    }
                );

            bus.fabric.connect(
                () => {
                    bus.fabric.getFabricVersion('testhost:12345/fabric').subscribe(
                        (id: string) => {
                            expect(id).toEqual('1.2.3');
                            done();
                        }
                    );
                },
                () => {
                },
                'testhost',
                12345,
                '/fabric'
            );

        }
    );

    it('Check we can switch to fabric REST service.',
        () => {
            spyOn(bus.logger, 'info').and.callThrough();
            bus.fabric.useFabricRestService();
            expect(bus.logger.info)
                .toHaveBeenCalledWith('Switching to Fabric based RestService, all REST calls will be routed via fabric', 'FabricApi');
        }
    );

    it('Check we can switch to local REST service.',
        () => {
            spyOn(bus.logger, 'info').and.callThrough();
            bus.fabric.useLocalRestService();
            expect(bus.logger.info)
                .toHaveBeenCalledWith('Switching local RestService, all REST calls will be routed via browser', 'FabricApi');
        }
    );

    it('Check we can switch to fabric REST service.',
        () => {
            spyOn(bus.logger, 'info').and.callThrough();
            bus.fabric.useFabricRestService();
            expect(bus.logger.info)
                .toHaveBeenCalledWith('Switching to Fabric based RestService, all REST calls will be routed via fabric', 'FabricApi');
        }
    );

    it('Check we can set the session token key',
        () => {
            spyOn(bus.logger, 'debug').and.callThrough();
            bus.fabric.setAccessTokenSessionStorageKey('123');
            expect(bus.logger.debug)
                .toHaveBeenCalledWith('Setting access token session storage key to: 123', 'FabricApi');
        }
    );

    it('Check we cannot get a version from the fabric, if we are not connected',
        (done) => {
            bus.fabric.getFabricVersion('testhost:12345/fabric').subscribe(
                (value: string) => {
                    expect(value).toEqual('Version unavailable, not connected to fabric');
                    done();
                }
            );
        }
    );

    it('Check we can get/set the XSRF token store key',
        () => {
            spyOn(bus.logger, 'debug').and.callThrough();
            bus.fabric.setXsrfTokenStoreKey('123');
            expect(bus.logger.debug)
                .toHaveBeenCalledWith('Setting XSRF token store key to: 123', 'FabricApi');
        }
    );

    it('Check if XSRF token handling can be toggled',
        () => {
            bus.fabric.setXsrfTokenEnabled(true);
            expect(bus.fabric.isXsrfTokenEnabled()).toBeTruthy();

            bus.fabric.setXsrfTokenEnabled(false);
            expect(bus.fabric.isXsrfTokenEnabled()).toBeFalsy();
        }
    );

    it('Check if XSRF token can be read from cookie',
        () => {
            const id: string = GeneralUtil.genUUID();
            bus.stores.getStore(Stores.XsrfToken);

            // fetch the token from cookie
            spyOnProperty(document, 'cookie').and.returnValue(`XSRF-TOKEN=${id}`);
            expect(bus.fabric.getXsrfToken()).toBe(id);
        }
    );

    it('Check if XSRF token can be read from store',
        (done) => {
            const id: string = GeneralUtil.genUUID();
            const store: BusStore<string> = bus.stores.createStore(Stores.XsrfToken);

            // fetch the token from store
            store.whenReady(() => {
                expect(bus.fabric.getXsrfToken()).toBe(id);
                done();
            });

            store.populate(new Map<string, string>([[bus.fabric.getXsrfTokenStoreKey(), id]]));
        }
    );

    it('Check if XSRF token can be set',
        () => {
            const id: string = GeneralUtil.genUUID();
            spyOnProperty(document, 'cookie').and.returnValue(`XSRF-TOKEN=${id}`);

            // expect bus.stores.getStore not to have been called because a cookie containing the token is found
            spyOn(bus.stores, 'getStore').and.callThrough();
            bus.fabric.setXsrfTokenEnabled(true);
            bus.fabric.setXsrfToken(id);
            expect(bus.stores.getStore).toHaveBeenCalled();
        }
    );

    it('Check that when XSRF token is null, an empty value is returned from getXsrfToken()',
        (done) => {
            const store: BusStore<string> = bus.stores.createStore(Stores.XsrfToken);
            store.whenReady(() => {
                expect(bus.fabric.getXsrfToken()).toBe('');
                done();
            });

            store.reset();
            store.initialize();
        }
    );

    it('Check getConnectionStateStore creates a new FabricConnectionState store if it does not exist', () => {
        let store = bus.fabric.getConnectionStateStore('new');
        expect(store).not.toBeFalsy();

        // set a state
        store.put(FabricConnectionStoreKey.State, FabricConnectionState.Connected, FabricConnectionState.Connected);

        // assert the value to be FabricConnectionState.Connected
        expect(store.get(FabricConnectionStoreKey.State)).toBe(FabricConnectionState.Connected);

        // get the handle again
        store = bus.fabric.getConnectionStateStore('new');

        // assert the value to be FabricConnectionState.Connected
        expect(store.get(FabricConnectionStoreKey.State)).toBe(FabricConnectionState.Connected);
    });
});
