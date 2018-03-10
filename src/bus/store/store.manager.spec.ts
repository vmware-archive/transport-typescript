/**
 * Copyright(c) VMware Inc. 2017
 */
import { BifrostEventBus } from '../bus';
import { EventBus } from '../../bus.api';
import { LogLevel } from '../../log';
import { BusStore } from '../../store.api';

describe('Store Manager [store/store.manager]', () => {

    it('Check readyJoin works', (done) => {

        const bus: EventBus = new BifrostEventBus(LogLevel.Off, true);
        bus.stores.readyJoin(['ember', 'fox']).whenReady(
            () => {
                done();
            }
        );

        bus.stores.createStore('ember').initialize();
        bus.stores.createStore('fox').initialize();

    });

    it('Check readyJoin works and values come through', (done) => {

        const bus: EventBus = new BifrostEventBus(LogLevel.Off, true);
        bus.stores.readyJoin(['ember', 'fox']).whenReady(
            (stores: Array<BusStore<any>>) => {
                expect(stores.length).toEqual(2);
                expect(stores[0].get('fox')).toEqual('honk');
                done();
            }
        );

        const store1 = bus.stores.createStore('ember');
        const store2 = bus.stores.createStore('fox');

        store1.put('fox', 'honk', null);
        store1.initialize();
        store2.initialize();

    });

});