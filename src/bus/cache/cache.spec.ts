/**
 * Copyright(c) VMware Inc. 2017
 */

import { inject, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MessagebusService } from '../index';
import { UUID } from './cache.model';

enum State {
    Created,
    Updated,
    Deleted
}

describe('BusCache [cache]', () => {
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


    afterEach(() => {
        bus.cache.resetCache();
        bus.destroyAllChannels();
    });

    it('Check cache has been set up correctly', () => {
        expect(bus.cache).not.toBeNull();
        expect(bus.cache.populateCache(new Map<UUID, string>())).toBeTruthy();
    });

    it('check encache() and retrive() work correctly', () => {
        bus.cache.encache('123', 'chickie & fox', State.Created);
        expect(bus.cache.retrieve('123')).toEqual('chickie & fox');
        expect(bus.cache.retrieve('456')).toBeUndefined();
    });

    it('check remove() works correctly', (done) => {

        bus.cache.notifyOnChange<State.Deleted, string>('123', State.Deleted)
            .subscribe(
                (s: string) => {
                    expect(s).toEqual('chickie & fox');
                    expect(bus.cache.retrieve('123')).toBeUndefined();
                    done();
                }
            );

        bus.cache.encache('123', 'chickie & fox', State.Created);
        expect(bus.cache.retrieve('123')).toEqual('chickie & fox');
        expect(bus.cache.remove('789', State.Deleted)).toBeFalsy();
        expect(bus.cache.remove('123', State.Deleted)).toBeTruthy();
    });

    it('check populateCache() works correctly', () => {

        const data: Map<UUID, string> = new Map<UUID, string>();
        data.set('123', 'miss you so much maggie pop');
        data.set('456', 'you were the best boy');

        expect(bus.cache.populateCache(data)).toBeTruthy();
        expect(bus.cache.retrieve('123')).toEqual('miss you so much maggie pop');
        expect(bus.cache.retrieve('456')).toEqual('you were the best boy');
        expect(bus.cache.populateCache(data)).toBeFalsy();

    });

    it('check resetCache() works correctly', () => {
        bus.cache.encache('123', 'chickie & fox', State.Created);
        expect(bus.cache.retrieve('123')).toEqual('chickie & fox');
        bus.cache.encache('456', 'maggie pop', State.Created);
        expect(bus.cache.retrieve('456')).toEqual('maggie pop');
        bus.cache.resetCache();
        expect(bus.cache.retrieve('123')).toBeUndefined();
        expect(bus.cache.retrieve('456')).toBeUndefined();
    });

    it('check notifyOnChange() works correctly', (done) => {

        let counter: number = 0;

        interface Dog {
            name: string;
            age: number;
            commonPhrase: string;
        }

        bus.cache.notifyOnChange<State.Created, Dog>('magnum', State.Created)
            .subscribe(
                (d: Dog) => {
                    expect(d.name).toEqual('maggie');
                    expect(d.age).toEqual(12);
                    expect(d.commonPhrase).toEqual('get the kitty');
                    counter++;
                }
            );

        bus.cache.notifyOnChange<State.Updated, Dog>('fox', State.Updated)
            .subscribe(
                (d: Dog) => {
                    expect(d.name).toEqual('foxy pop');
                    expect(d.age).toEqual(11);
                    expect(d.commonPhrase).toEqual('get out of the pantry');
                    counter++;
                }
            );

        bus.cache.notifyOnChange<State.Deleted, Dog>('cotton', State.Deleted)
            .subscribe(
                (d: Dog) => {
                    expect(d.name).toEqual('chickie');
                    expect(d.age).toEqual(6);
                    expect(d.commonPhrase).toEqual('where is the kitty');
                    counter++;
                    if (counter === 3) {
                        done();
                    }
                }
            );

        bus.cache.encache(
            'magnum',
            {name: 'maggie', age: 12, commonPhrase: 'get the kitty'},
            State.Created
        );
        bus.cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Updated
        );
        bus.cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'where is the kitty'},
            State.Deleted
        );

    });

    it('check notifyOnAllChanges() works correctly', (done) => {

        let counter: number = 0;

        class Dog {
            constructor(
                private name?: string,
                private age?: number,
                private commonPhrase?: string
            ) {

            }
        }

        bus.cache.notifyOnAllChanges<State.Created, Dog>(new Dog(), State.Created)
            .subscribe(
                (d: Dog) => {
                    counter++;
                }
            );

        bus.cache.notifyOnAllChanges<State.Updated, Dog>(new Dog(), State.Updated)
            .subscribe(
                (d: Dog) => {
                    counter++;
                    if (counter === 5) {
                        done();
                    }
                }
            );

        bus.cache.encache(
            'something-else',
            'not a dog!',
            State.Created
        );
        bus.cache.encache(
            'magnum',
            {name: 'maggie', age: 12, commonPhrase: 'get the kitty'},
            State.Created
        );
        bus.cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Created
        );
        bus.cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'where is the kitty'},
            State.Created
        );
        bus.cache.encache(
            'something-else-again',
            'not a dog either!',
            State.Created
        );
        bus.cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get off the couch!'},
            State.Updated
        );
        bus.cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'want to go for a walk?'},
            State.Updated
        );

    });
});