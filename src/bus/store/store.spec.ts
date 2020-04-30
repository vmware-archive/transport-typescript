/**
 * Copyright(c) VMware Inc. 2017
 */

import { StoreMessageArgs, UUID } from './store.model';
import { BusStore, StoreStream, MutateStream } from '../../store.api';
import { MessageFunction } from '../../bus.api';
import { EventBus } from '../../bus.api';
import { Logger } from '../../log';
import { BusTestUtil } from '../../util/test.util';
import { StoreImpl } from './store';

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

describe('BusStore [store/store.model]', () => {
    let bus: EventBus;
    let log: Logger;

    beforeEach(() => {
        bus = BusTestUtil.bootBus();
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
        bus.stores.createStore('string');
        log = bus.api.logger();
    });

    afterEach(() => {
        bus.stores.getStore('string').reset();
        bus.api.destroyAllChannels();
    });

    describe('Galactic stores', () => {
        it('openGalacticStore returns galactic store instance', () => {
            const galacticStore = bus.stores.openGalacticStore('galacticStore', 'connString');
            expect(galacticStore).not.toBeNull();
            expect(galacticStore.isGalacticStore).toBeTruthy();
            expect(bus.stores.getStore('galacticStore')).toBe(galacticStore);
        });

        it('when created request store content', (done) => {
            spyOn(bus, 'sendGalacticMessage').and.returnValue({});
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            expect(bus.sendGalacticMessage).toHaveBeenCalledWith('store-sync-channel', jasmine.objectContaining({
                request: 'openStore',
                payload: {
                    storeId: 'galacticStore'
                }
            }));

            galacticStore.whenReady( m => {
                expect(galacticStore.get('item1')).toBe('value1');
                done();
            });

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'storeContentResponse',
                storeId: 'galacticStore',
                items: {
                    'item1': 'value1'
                }
            });
        });

        it('closeStore() method triggers closeStore request', () => {
            spyOn(bus, 'sendGalacticMessage').and.returnValue({});
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            galacticStore.closeStore();

            expect(bus.sendGalacticMessage).toHaveBeenCalledWith('store-sync-channel', jasmine.objectContaining({
                request: 'closeStore',
                payload: {
                    storeId: 'galacticStore'
                }
            }));
        });

        it('reset() method retrieves the store content', () => {
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');
            spyOn(bus, 'sendGalacticMessage').and.returnValue({});
            galacticStore.reset();

            expect(bus.sendGalacticMessage).toHaveBeenCalledWith('store-sync-channel', jasmine.objectContaining({
                request: 'openStore',
                payload: {
                    storeId: 'galacticStore'
                }
            }));
        });

        it('put() method triggers updateStoreRequest', (done) => {
            spyOn(bus, 'sendGalacticMessage').and.returnValue({});
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'storeContentResponse',
                storeId: 'galacticStore',
                items: {
                    'item1': 'value1'
                },
                storeVersion: 1
            });

            galacticStore.whenReady( m => {
                galacticStore.put('item1', 'value2', 'update_item');
                expect(bus.sendGalacticMessage).toHaveBeenCalledWith('store-sync-channel', jasmine.objectContaining({
                    request: 'updateStore',
                    payload: {
                        storeId: 'galacticStore',
                        clientStoreVersion: 1,
                        itemId: 'item1',
                        newItemValue: 'value2'
                    }
                }));
                done();
            });
        });

        it('remove() method triggers updateStoreRequest', (done) => {
            spyOn(bus, 'sendGalacticMessage').and.returnValue({});
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'storeContentResponse',
                storeId: 'galacticStore',
                items: {
                    'item1': 'value1'
                },
                storeVersion: 1
            });

            galacticStore.whenReady( m => {
                galacticStore.remove('item1', 'remove_item');
                expect(bus.sendGalacticMessage).toHaveBeenCalledWith('store-sync-channel', jasmine.objectContaining({
                    request: 'updateStore',
                    payload: {
                        storeId: 'galacticStore',
                        clientStoreVersion: 1,
                        itemId: 'item1',
                        newItemValue: null
                    }
                }));
                done();
            });
        });

        it('galactic updates trigger store change handlers', (done) => {
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'storeContentResponse',
                storeId: 'galacticStore',
                items: {
                    'item1': 'value1'
                },
                storeVersion: 1
            });

            galacticStore.onAllChanges().subscribe( (item: string, args: StoreMessageArgs) => {
                expect(item).toBe('value2');
                expect(args.uuid).toBe('item1');
                expect(args.stateChangeType).toBe('galacticSyncUpdate');
                expect(galacticStore.get('item1')).toBe('value2');
                done();
            });

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'updateStoreResponse',
                storeId: 'galacticStore',
                itemId: 'item1',
                newItemValue:  'value2',
                storeVersion: 2
            });
        });

        it('galactic remove updates trigger store change handlers', (done) => {
            const galacticStore = new StoreImpl<string>(bus, 'galacticStore', 'store-sync-channel');

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'storeContentResponse',
                storeId: 'galacticStore',
                items: {
                    'item1': 'value1'
                },
                storeVersion: 1
            });

            galacticStore.onChange('item1').subscribe( (item: string, args: StoreMessageArgs) => {
                expect(item).toBe('value1');
                expect(args.uuid).toBe('item1');
                expect(args.stateChangeType).toBe('galacticSyncRemove');
                expect(galacticStore.get('item1')).toBeUndefined();
                done();
            });

            bus.sendResponseMessage('store-sync-channel', {
                responseType: 'updateStoreResponse',
                storeId: 'galacticStore',
                itemId: 'item1',
                newItemValue:  null,
                storeVersion: 2
            });
        });
    });

    it('Check cache has been set up correctly', () => {
        expect(bus.stores.getStore('string')).not.toBeNull();
        expect(bus.stores.getStore('string').isGalacticStore()).toBeFalsy();
        expect(bus.stores.getStore('string').populate(new Map<UUID, string>())).toBeTruthy();
    });

    it('check put() and retrive() work correctly', () => {
        bus.stores.getStore('string').put('123', 'chickie & fox', State.Created);
        expect(bus.stores.getStore('string').get('123')).toEqual('chickie & fox');
        expect(bus.stores.getStore('string').get('456')).toBeUndefined();
    });

    it('check remove() works correctly', (done) => {
        const cache: BusStore<string> = bus.stores.getStore('string');

        cache.onChange<State.Deleted>('123', State.Deleted)
            .subscribe(
                (s: string) => {
                    expect(s).toEqual('chickie & fox');
                    expect(cache.get('123')).toBeUndefined();
                    done();
                }
            );

        cache.put('123', 'chickie & fox', State.Created);
        expect(cache.get('123')).toEqual('chickie & fox');
        expect(cache.remove('789', State.Deleted)).toBeFalsy();
        expect(cache.remove('123', State.Deleted)).toBeTruthy();
    });

    it('check populate() works correctly', () => {
        const cache: BusStore<string> = bus.stores.getStore('string');
        const data: Map<UUID, string> = new Map<UUID, string>();
        data.set('123', 'miss you so much maggie pop');
        data.set('456', 'you were the best boy');

        expect(cache.populate(data)).toBeTruthy();
        expect(cache.get('123')).toEqual('miss you so much maggie pop');
        expect(cache.get('456')).toEqual('you were the best boy');
        expect(cache.populate(data)).toBeFalsy();

    });

    it('check reset() works correctly', () => {
        const cache: BusStore<string> = bus.stores.getStore('string');

        cache.put('123', 'chickie & fox', State.Created);
        expect(cache.get('123')).toEqual('chickie & fox');
        cache.put('456', 'maggie pop', State.Created);
        expect(cache.get('456')).toEqual('maggie pop');
        cache.reset();
        expect(cache.get('123')).toBeUndefined();
        expect(cache.get('456')).toBeUndefined();
    });

    it('check allValues() works correctly', () => {
        const cache: BusStore<string> = bus.stores.getStore('string');

        cache.put('123', 'pup pup pup', State.Created);
        cache.put('456', 'pop pop pop', State.Created);
        cache.put('789', 'woof woof bark', State.Created);

        expect(cache.allValues().length).toEqual(3);

        cache.reset();

        expect(cache.allValues().length).toEqual(0);
        expect(cache.get('123')).toBeUndefined();
        expect(cache.get('456')).toBeUndefined();
    });

    it('check allValuesAsMap() works correctly', () => {
        const cache: BusStore<string> = bus.stores.getStore('string');

        cache.put('123', 'tip top', State.Created);
        cache.put('456', 'clip clop', State.Created);

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

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let counter: number = 0;

        cache.onChange<State.Created>('magnum', State.Created)
            .subscribe(
                (d: Dog, args: StoreMessageArgs) => {
                    expect(d.dogName).toEqual('maggie');
                    expect(d.dogAge).toEqual(12);
                    expect(d.dogPhrase).toEqual('get the kitty');
                    expect(args.uuid).toBe('magnum');
                    expect(args.stateChangeType).toBe(State.Created);
                    counter++;
                }
            );

        cache.onChange<State.Updated>('fox', State.Updated)
            .subscribe(
                (d: Dog) => {
                    expect(d.dogName).toEqual('foxy pop');
                    expect(d.dogAge).toEqual(11);
                    expect(d.dogPhrase).toEqual('get out of the pantry');
                    counter++;
                }
            );

        cache.onChange<State.Deleted>('cotton', State.Deleted)
            .subscribe(
                (d: Dog) => {
                    expect(d.dogName).toEqual('chickie');
                    expect(d.dogAge).toEqual(6);
                    expect(d.dogPhrase).toEqual('where is the kitty');
                    counter++;
                    if (counter === 3) {
                        done();
                    }
                }
            );

        cache.put(
            'magnum',
            new Dog('maggie', 12, 'get the kitty'),
            State.Created
        );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get out of the pantry'),
            State.Updated
        );
        cache.put(
            'cotton',
            new Dog('chickie', 6, 'where is the kitty'),
            State.Deleted
        );

    });

    it('onChange() works with no success handler supplied', (done) => {
        spyOn(log, 'error').and.callThrough();

        const store: BusStore<string> = bus.stores.createStore('dog');
        store.onChange<State.Created>('magnum', State.Created)
            .subscribe(null);

        store.put('magnum', 'maggie', State.Created);

        bus.api.tickEventLoop(
            () => {
                expect(log.error)
                    .toHaveBeenCalledWith('unable to handle cache stream event, ' +
                        'no handler provided.', 'StoreStream');
                done();
            },
            20
        );
    });

    it('onChange() works with all types', (done) => {

        let count = 0;
        const store: BusStore<string> = bus.stores.createStore('dog');
        store.onChange<State.Created>('magnum')
            .subscribe(
                (val: string, args: StoreMessageArgs) => {
                    count++;
                    if (count === 1) {
                        expect(args.stateChangeType).toBe(State.Created);
                    } else if (count === 3) {
                        expect(args.stateChangeType).toBe('fart');
                        done();
                    }
                }
            );

        store.put('magnum', 'maggie', State.Created);
        store.put('magnum', 'maggie', State.Updated);
        store.put('magnum', 'maggie', 'fart');

    });

    it('onChange() works with unsubscriptions', (done) => {

        let counter = 0;
        const store: BusStore<string> = bus.stores.createStore('dog');
        const sub = store.onChange<State.Updated>('magnum', State.Updated);
        sub.unsubscribe(); // nothing should happen because we're not subscribed yet.

        sub.subscribe(
            () => {
                counter++;
            }
        );

        store.put('magnum', 'maggie', State.Created);
        store.put('magnum', 'maggie', State.Updated);
        store.put('magnum', 'maggie', State.Updated);
        store.put('magnum', 'maggie', State.Updated);

        bus.api.tickEventLoop(
            () => {
                expect(counter).toEqual(3);
                sub.unsubscribe();
                store.put('magnum', 'maggie', State.Updated);
                store.put('magnum', 'maggie', State.Updated);
                store.put('magnum', 'maggie', State.Updated);
                store.put('magnum', 'maggie', State.Updated);
            },
            10
        );

        bus.api.tickEventLoop(
            () => {
                expect(counter).toEqual(3);
                done();
            },
            20
        );

    });

    it('check onAllChanges() works correctly', (done) => {

        const cache = bus.stores.createStore('Dog');

        let counter: number = 0;


        cache.onAllChanges<State.Created>(State.Created)
            .subscribe(
                (d: any, args: StoreMessageArgs) => {
                    counter++;
                    if (counter === 1) {
                        expect(args.uuid).toBe('something-else');
                        expect(args.stateChangeType).toBe(State.Created);
                    } else if (counter === 2) {
                       expect(args.uuid).toBe('magnum');
                    }
                }
            );

        cache.onAllChanges<State.Updated>(State.Updated)
            .subscribe(
                () => {
                    counter++;
                    if (counter === 7) {
                        done();
                    }
                }
            );

        cache.put(
            'something-else',
            'not a dog!',
            State.Created
        );
        cache.put(
            'magnum',
            new Dog('maggie', 12, 'get the kitty'),
            State.Created
        );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get out of the pantry'),
            State.Created
        );
        cache.put(
            'cotton',
            new Dog('chickie', 6, 'where is the kitty'),
            State.Created
        );
        cache.put(
            'something-else-again',
            'not a dog either!',
            State.Created
        );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get off the couch!'),
            State.Updated
        );
        cache.put(
            'cotton',
            new Dog('chickie', 6, 'want to go for a walk?'),
            State.Updated
        );

    });

    it('check onAllChanges() works correctly with multiple states', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let counter: number = 0;

        listen<State, Dog>(cache, State.Created, State.Updated)
            .subscribe(
                (d: Dog, args: StoreMessageArgs) => {
                    counter++;
                    if (counter === 1) {
                        expect(args.uuid).toBe('fox');
                        expect(args.stateChangeType).toBe(State.Created);
                    }
                    if (counter === 2) {
                        expect(args.uuid).toBe('fox');
                        expect(args.stateChangeType).toBe(State.Updated);
                        done();
                    }
                }
            );

        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get out of the pantry'),
            State.Created
        );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get off the couch!'),
            State.Updated
        );

    });

    it('check onAllChanges() works correctly with all states', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let counter: number = 0;

        // handle edge case of wrapper functions passing down muli-args.
        listen<State, Dog>(cache)
            .subscribe(
                () => {
                    counter++;
                    if (counter === 3) {
                        done();
                    }
                }
            );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get out of the pantry'),
            State.Created
        );
        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get off the couch!'),
            State.Updated
        );

        cache.put(
            'fox',
            new Dog('foxy pop', 11, 'get off the couch!'),
            State.Deleted
        );
    });

    it('check mutate() works with correct success handling', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('foxy');
                expect(dog.dogPhrase).toEqual('eat it, not bury it');

                // some task was done and the mutation was a success. let the caller know.
                dog.dogPhrase = 'ok, now you can eat it!';
                mutateStream.success(dog);
            }
        );

        cache.mutate(d, Mutate.Update,
            () => {
                expect(d.dogPhrase).toEqual('ok, now you can eat it!');
                done();
            }
        );
    });

    it('check mutate() works with all mutation types', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);
        let counter = 0;
        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog());
        mutateStream.subscribe(
            () => {
                counter++;
            }
        );

        cache.mutate(d, Mutate.Update, null);
        cache.mutate(d, Mutate.RemoveStuff, null);
        cache.mutate(d, Mutate.AddStuff, null);

        bus.api.tickEventLoop(
            () => {
                expect(counter).toEqual(3);
                done();
            }
            , 20
        );
    });

    it('check mutate() works with correct logging, without success handler.', (done) => {

        spyOn(log, 'error').and.callThrough();
        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('foxy');
                expect(dog.dogPhrase).toEqual('eat it, not bury it');

                // some task was done and the mutation was a success. let the caller know.
                dog.dogPhrase = 'ok, now you can eat it!';
                mutateStream.success(dog);
            }
        );

        cache.mutate(d, Mutate.Update, null);

        bus.api.tickEventLoop(
            () => {
                expect(log.error)
                    .toHaveBeenCalledWith('unable to send success event back to mutator, ' +
                        'no success handler provided.', 'MutateStream');
                done();
            }
            , 20
        );
    });


    it('check mutate() works without correct success handling', (done) => {
        spyOn(log, 'error').and.callThrough();
        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(null);

        cache.mutate(d, Mutate.Update, null);

        bus.api.tickEventLoop(
            () => {
                expect(log.error).toHaveBeenCalledWith('unable to handle ' +
                    'cache stream event, no handler provided.', 'MutateStream');
                done();
            }
            , 50
        );
    });

    it('check mutate() works with correct error handling', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);

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

    it('check mutate() works with correct error logging when no error handler provided', (done) => {

        spyOn(log, 'error').and.callThrough();
        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('foxy', 11, 'eat it, not bury it');
        cache.put('fox', d, State.Created);

        const mutateStream: MutateStream<Dog, string> = cache.onMutationRequest(new Dog(), Mutate.Update);
        mutateStream.subscribe(
            (dog: Dog) => {
                expect(dog.dogName).toEqual('foxy');
                expect(dog.dogPhrase).toEqual('eat it, not bury it');

                // something failed with the mutate, throw an error to the caller.
                mutateStream.error('something went wrong');
            }
        );

        cache.mutate(d, Mutate.Update, null);
        bus.api.tickEventLoop(
            () => {
                expect(log.error)
                    .toHaveBeenCalledWith('unable to send error event back to' +
                        ' mutator, no error handler provided.', 'MutateStream');
                done();
            }
            , 50
        );
    });


    it('check mutate() and notifyOnMutation() works correctly', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('maggie', 12, 'get the kitty');
        cache.put('magnum', d, State.Created);

        cache.onMutationRequest<Mutate.Update>(new Dog(), Mutate.Update)
            .subscribe(
                (dog: Dog) => {
                    expect(dog.dogName).toEqual('maggie');
                    expect(dog.dogPhrase).toEqual('get the kitty');

                    // mutate!
                    dog.dogName = 'maggles';
                    dog.dogPhrase = 'where is your ball?';

                    cache.put('magnum', d, State.Updated);
                }
            );

        cache.onChange<State.Updated>('magnum', State.Updated)
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

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        let d: Dog = new Dog('chicken', 6, 'go find the kitty');
        cache.put('cotton', d, State.Created);

        const stream = cache.onMutationRequest<Mutate.Update>(new Dog(), Mutate.Update);

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

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        cache.whenReady(
            () => {
                expect(cache.allValues().length).toEqual(1);
                done();
            }
        );

        let d: Dog = new Dog('stinky', 12, 'where is your ball');
        cache.put('magnum', d, State.Created);
        cache.initialize();

    });

    it('check whenReady() and populate() work.', (done) => {

        const cache: BusStore<Dog> = bus.stores.createStore('Dog');

        cache.whenReady(
            () => {
                expect(cache.allValues().length).toEqual(3);
                expect(cache.get('cotton').dogPhrase).toEqual('go find the kitty');
                done();
            }
        );

        const vals: Map<UUID, Dog> = new Map();
        vals.set('magnum', new Dog('stinky', 12, 'where is your ball'));
        vals.set('cotton', new Dog('chickie', 6, 'go find the kitty'));
        vals.set('fox', new Dog('foxy', 11, 'stop that barking'));
        cache.populate(vals);

    });

    it('Test we can set an auto-reload trigger for a store to fire n times', (done) => {
        let count = 0;
        const reloadTrigger = () => {
            count++;
        };

        const store = bus.stores.createStore('ReloadTest');
        store.setAutoReloadServiceTrigger(reloadTrigger);
        store.startAutoReload(25);

        bus.api.tickEventLoop(
            () => {
                expect(count).toEqual(3);
                done();
            },
            80 // should have fired 3 times in 80ms.
        );

    });

    it('Test we can interrupt an api delay and refire.', (done) => {
        let count = 0;
        const store = bus.stores.createStore('ReloadTestInterrupt');
        const reloadTrigger = () => {
            count++;
        };

        store.setAutoReloadServiceTrigger(reloadTrigger);
        store.startAutoReload(20);

        bus.api.tickEventLoop(
            () => {
                store.refreshApiDelay();
            },
            15
        );

        bus.api.tickEventLoop(
            () => {
                store.refreshApiDelay();
            },
            30
        );

        bus.api.tickEventLoop(
            () => {
                expect(count).toEqual(0);
                done();
            },
            50 // should have fired 0 times in 50ms
        );

    });

    it('Test reload a store', () => {
        let count = 0;
        const reloadTrigger = () => {
            count++;
        };

        const store = bus.stores.createStore('ReloadStoreTest');
        store.setAutoReloadServiceTrigger(reloadTrigger);
        store.reloadStore();
        store.reloadStore();
        store.reloadStore();
        expect(count).toEqual(3);

    });

    it('Test reload a store with no reload handler defined', () => {
        spyOn(bus.logger, 'warn').and.callThrough();
        const store = bus.stores.createStore('ReloadStoreTestNoHandler');
        store.reloadStore();
        expect(bus.logger.warn)
            .toHaveBeenCalledWith('Unable to refresh API delay for ReloadStoreTestNoHandler, no reloadHandler has been defined.', 'BusStore');

    });

});

class Dog {
    constructor(
        private name?: string,
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

    set dogPhrase(phrase) {
        this.commonPhrase = phrase;
    }

}

function listen<T, B>(cache: BusStore<B>, ...things: T[]): StoreStream<B> {
    let arr = new Array<any>();
    arr = arr.concat(things);
    return cache.onAllChanges.apply(cache, arr);
}
