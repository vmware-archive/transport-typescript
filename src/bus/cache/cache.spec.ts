/**
 * Copyright(c) VMware Inc. 2017
 */

import { inject, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MessagebusService } from './index';
import { UUID } from './cache';

enum State {
    Created,
    Updated,
    Deleted
}

fdescribe('BusCache [cache]', () => {
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

    it('Check cache has been set up correctly', () => {
        expect(bus.cache).not.toBeNull();
        expect(bus.cache.populateCache(new Map<UUID, string>())).toBeTruthy();
    });

    it('check encache() and retrive() work correctly', () => {
        bus.cache.encache('123', 'chickie & fox', State.Created);
        expect(bus.cache.retrieve('123')).toEqual('chickie & fox');
        expect(bus.cache.retrieve('456')).toBeUndefined();
    });

    it('check remove() works correctly', () => {
        bus.cache.encache('123', 'chickie & fox', State.Created);
        expect(bus.cache.retrieve('123')).toEqual('chickie & fox');
        expect(bus.cache.remove('123')).toBeTruthy();
        expect(bus.cache.remove('789')).toBeFalsy();
        expect(bus.cache.retrieve('123')).toBeUndefined();
    });

    it('check populateCache() works correctly', () => {

        const data: Map<UUID, string> = new Map<UUID, string>();
        data.set('123', 'miss you so much maggie pop');
        data.set('456', 'you were the best boy');

        expect(bus.cache.populateCache(data)).toBeTruthy();
        expect(bus.cache.retrieve('123')).toEqual('miss you so much maggie pop');
        expect(bus.cache.retrieve('456')).toEqual('you were the best boyp');
        expect(bus.cache.populateCache(data)).toBeFalsy();

    });

});