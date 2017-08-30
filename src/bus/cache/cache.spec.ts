/**
 * Copyright(c) VMware Inc. 2017
 */

import { inject, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MessagebusService } from '../index';
import { UUID } from './cache.model';
import { BusCache, CacheStream, MutateStream } from './cache.api';
import { MessageFunction } from '../message.model';

enum State {
    Created = 'Created',
    Updated = 'Updated',
    Deleted = 'Deleted'
}

enum Mutate {
    Update = 'Update',
    AddStuff = 'AddStuff',
    RemoveStuff = 'RemoveStuff'
}

describe('BusCache [cache/cache]', () => {
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
        bus.createCache('string');
    }));


    afterEach(() => {
        bus.getCache('string').reset();
        bus.destroyAllChannels();
    });

    it('Check cache has been set up correctly', () => {
        expect(bus.getCache('string')).not.toBeNull();
        expect(bus.getCache('string').populate(new Map<UUID, string>())).toBeTruthy();
    });

    it('check encache() and retrive() work correctly', () => {
        bus.getCache('string').encache('123', 'chickie & fox', State.Created);
        expect(bus.getCache('string').retrieve('123')).toEqual('chickie & fox');
        expect(bus.getCache('string').retrieve('456')).toBeUndefined();
    });

    it('check remove() works correctly', (done) => {
        const cache: BusCache<string> = bus.getCache('string');

        cache.onChange<State.Deleted, string>('123', State.Deleted)
            .subscribe(
                (s: string) => {
                    expect(s).toEqual('chickie & fox');
                    expect(cache.retrieve('123')).toBeUndefined();
                    done();
                }
            );

        cache.encache('123', 'chickie & fox', State.Created);
        expect(cache.retrieve('123')).toEqual('chickie & fox');
        expect(cache.remove('789', State.Deleted)).toBeFalsy();
        expect(cache.remove('123', State.Deleted)).toBeTruthy();
    });

    it('check populate() works correctly', () => {
        const cache: BusCache<string> = bus.getCache('string');
        const data: Map<UUID, string> = new Map<UUID, string>();
        data.set('123', 'miss you so much maggie pop');
        data.set('456', 'you were the best boy');

        expect(cache.populate(data)).toBeTruthy();
        expect(cache.retrieve('123')).toEqual('miss you so much maggie pop');
        expect(cache.retrieve('456')).toEqual('you were the best boy');
        expect(cache.populate(data)).toBeFalsy();

    });

    it('check reset() works correctly', () => {
        const cache: BusCache<string> = bus.getCache('string');

        cache.encache('123', 'chickie & fox', State.Created);
        expect(cache.retrieve('123')).toEqual('chickie & fox');
        cache.encache('456', 'maggie pop', State.Created);
        expect(cache.retrieve('456')).toEqual('maggie pop');
        cache.reset();
        expect(cache.retrieve('123')).toBeUndefined();
        expect(cache.retrieve('456')).toBeUndefined();
    });

    it('check allValues() works correctly', () => {
        const cache: BusCache<string> = bus.getCache('string');

        cache.encache('123', 'pup pup pup', State.Created);
        cache.encache('456', 'pop pop pop', State.Created);
        cache.encache('789', 'woof woof bark', State.Created);

        expect(cache.allValues().length).toEqual(3);

        cache.reset();

        expect(cache.allValues().length).toEqual(0);
        expect(cache.retrieve('123')).toBeUndefined();
        expect(cache.retrieve('456')).toBeUndefined();
    });

    it('check allValuesAsMap() works correctly', () => {
        const cache: BusCache<string> = bus.getCache('string');

        cache.encache('123', 'tip top', State.Created);
        cache.encache('456', 'clip clop', State.Created);

        const map = cache.allValuesAsMap();

        expect(map.size).toEqual(2);
        expect(map.get('123')).toEqual('tip top');
        expect(map.get('456')).toEqual('clip clop');

        /* check notification does not alter cache */
        map.set('123', 'bacon!');

        expect(cache.allValuesAsMap().get('123')).not.toEqual('bacon!');
        expect(cache.allValuesAsMap().get('123')).toEqual('tip top');

    });

    it('check onChange() works correctly', (done) => {

        const cache: BusCache<string> = bus.createCache('Dog');

        let counter: number = 0;

        interface Dog {
            name: string;
            age: number;
            commonPhrase: string;
        }

        cache.onChange<State.Created, Dog>('magnum', State.Created)
            .subscribe(
                (d: Dog) => {
                    expect(d.name).toEqual('maggie');
                    expect(d.age).toEqual(12);
                    expect(d.commonPhrase).toEqual('get the kitty');
                    counter++;
                }
            );

        cache.onChange<State.Updated, Dog>('fox', State.Updated)
            .subscribe(
                (d: Dog) => {
                    expect(d.name).toEqual('foxy pop');
                    expect(d.age).toEqual(11);
                    expect(d.commonPhrase).toEqual('get out of the pantry');
                    counter++;
                }
            );

        cache.onChange<State.Deleted, Dog>('cotton', State.Deleted)
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

        cache.encache(
            'magnum',
            {name: 'maggie', age: 12, commonPhrase: 'get the kitty'},
            State.Created
        );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Updated
        );
        cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'where is the kitty'},
            State.Deleted
        );

    });

    it('check onAllChanges() works correctly', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let counter: number = 0;


        cache.onAllChanges<State.Created, Dog>(new Dog(), State.Created)
            .subscribe(
                (d: Dog) => {
                    counter++;
                }
            );

        cache.onAllChanges<State.Updated, Dog>(new Dog(), State.Updated)
            .subscribe(
                (d: Dog) => {
                    counter++;
                    if (counter === 5) {
                        done();
                    }
                }
            );

        cache.encache(
            'something-else',
            'not a dog!',
            State.Created
        );
        cache.encache(
            'magnum',
            {name: 'maggie', age: 12, commonPhrase: 'get the kitty'},
            State.Created
        );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Created
        );
        cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'where is the kitty'},
            State.Created
        );
        cache.encache(
            'something-else-again',
            'not a dog either!',
            State.Created
        );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get off the couch!'},
            State.Updated
        );
        cache.encache(
            'cotton',
            {name: 'chickie', age: 6, commonPhrase: 'want to go for a walk?'},
            State.Updated
        );

    });

    it('check onAllChanges() works correctly with multiple states', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let counter: number = 0;

        listen<State, Dog>(cache, State.Created, State.Updated)
            .subscribe(
                (dog: Dog) => {
                    counter++;
                    if (counter === 2) {
                        done();
                    }
                }
            );

        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Created
        );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get off the couch!'},
            State.Updated
        );

    });

    it('check onAllChanges() works correctly with all states', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let counter: number = 0;

        // handle edge case of wrapper functions passing down muli-args.
        listen<State, Dog>(cache)
            .subscribe(
                (dog: Dog) => {
                    counter++;
                    if (counter === 3) {
                        done();
                    }
                }
            );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get out of the pantry'},
            State.Created
        );
        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get off the couch!'},
            State.Updated
        );

        cache.encache(
            'fox',
            {name: 'foxy pop', age: 11, commonPhrase: 'get off the couch!'},
            State.Deleted
        );
    });

    it('check mutate() works with correct success handling', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.encache('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('foxy');
                expect(dog.dogPhrase).toEqual('eat it, not bury it');

                // some task was done and the mutation was a success. let the caller know.
                mutateStream.success('we mutated it!');
            }
        );

        cache.mutate(d, Mutate.Update,
            (e: string) => {
                expect(e).toEqual('we mutated it!');
                done();
            }
        );
    });


    it('check mutate() works with correct error handling', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.encache('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('foxy');
                expect(dog.dogPhrase).toEqual('eat it, not bury it');

                // something failed with the mutate, throw an error to the caller.
                mutateStream.error('something went wrong');
            }
        );

        cache.mutate(d, Mutate.Update, null,
            (e: string) => {
                expect(e).toEqual('something went wrong');
                done();
            }
        );
    });


    it('check mutate() and notifyOnMutation() works correctly', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let d: Dog = new Dog('maggie', 12, 'get the kitty');
        cache.encache('magnum', d, State.Created);

        cache.onMutationRequest<Dog, Mutate.Update>(new Dog(), Mutate.Update)
            .subscribe(
                (dog: Dog) => {
                    expect(dog.dogName).toEqual('maggie');
                    expect(dog.dogPhrase).toEqual('get the kitty');

                    // mutate!
                    dog.dogName = 'maggles';
                    dog.dogPhrase = 'where is your ball?';

                    cache.encache('magnum', d, State.Updated);
                }
            );

        cache.onChange<State.Updated, Dog>('magnum', State.Updated)
            .subscribe(
                (dog: Dog) => {
                    expect(dog.dogName).toEqual('maggles');
                    expect(dog.dogPhrase).toEqual('where is your ball?');
                    done();
                }
            );

        cache.mutate(d, Mutate.Update, null);

    });

    it('check mutatorErrorHandler works so mutator can send errors back to subscribers.', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        let d: Dog = new Dog('chicken', 6, 'go find the kitty');
        cache.encache('cotton', d, State.Created);

        const stream = cache.onMutationRequest<Dog, Mutate.Update>(new Dog(), Mutate.Update);

        stream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('chicken');
                expect(dog.dogPhrase).toEqual('go find the kitty');

                // we have an issue, time to an error;
                stream.error('unable to mutate! something went wrong!');
            }
        );
        const errorHandler: MessageFunction<string> = (v: string) => {
            expect(v).toEqual('unable to mutate! something went wrong!');
            done();
        };

        cache.mutate(d, Mutate.Update, null, errorHandler);

    });


    it('check whenReady() and initialize() work.', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        cache.whenReady(
            () => {
                expect(cache.allValues().length).toEqual(1);
                done();
            }
        );

        let d: Dog = new Dog('stinky', 12, 'where is your ball');
        cache.encache('magnum', d, State.Created);
        cache.initialize();

    });

    it('check whenReady() and populate() work.', (done) => {

        const cache: BusCache<Dog> = bus.createCache('Dog');

        cache.whenReady(
            () => {
                expect(cache.allValues().length).toEqual(3);
                expect(cache.retrieve<Dog>('cotton').dogPhrase).toEqual('go find the kitty');
                done();
            }
        );

        const vals: Map<UUID, Dog> = new Map();
        vals.set('magnum', new Dog('stinky', 12, 'where is your ball'));
        vals.set('cotton', new Dog('chickie', 6, 'go find the kitty'));
        vals.set('fox', new Dog('foxy', 11, 'stop that barking'));
        cache.populate(vals);

    });

});

class Dog {
    constructor(private name?: string,
                private age?: number,
                private commonPhrase?: string) {

    }

    get dogName() {
        return this.name;
    }

    get dogAge() {
        return this.age;
    }

    get dogPhrase() {
        return this.commonPhrase;
    }

    set dogName(name) {
        this.name = name;
    }

    set dogAge(age) {
        this.age = age;
    }

    set dogPhrase(phrase) {
        this.commonPhrase = phrase;
    }

}

function listen<T, B>(cache: BusCache<B>, ...things: T[]): CacheStream<B> {
    let arr = new Array<any>();
    arr.push(new Dog());
    arr = arr.concat(things);
    return cache.onAllChanges.apply(cache, arr);
}
