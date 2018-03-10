/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { BifrostEventBus } from '../';

import { BusTransactionImpl } from './transaction';
import { BusTransaction, EventBus, TransactionReceipt, TransactionType } from '../bus.api';
import { LoggerService, LogLevel } from '../log';
import { StompParser } from '../bridge/stomp.parser';

describe('Bus Transactions [transaction.ts]', () => {

    let transaction: BusTransaction;
    let bus: EventBus;
    const chan = '#some-test-channel';
    let log: LoggerService;

    beforeEach(
        () => {
            bus = new BifrostEventBus(LogLevel.Off, true);
            bus.api.loggerInstance.setStylingVisble(false);
            //bus.api.enableMonitorDump(true);
            transaction = bus.createTransaction();
            log = bus.api.logger();
        }
    );

    it('Basic creation should work', () => {
        expect(transaction).not.toBeUndefined();
    });

    it('Should be able to run a single request and trigger onComplete', (done) => {
        bus.respondStream(chan)
            .generate(
                () => 'pong'
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(1);
                expect(results[0]).toEqual('pong');
                done();
            }
        );

        transaction.sendRequest(chan, 'ping');
        transaction.commit();

    });

    it('Should be able to run a multiple requests on same channel and trigger onComplete', (done) => {
        bus.respondStream(chan)
            .generate(
                () => 'pong'
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(3);
                expect(results[0]).toEqual('pong');
                expect(results[1]).toEqual('pong');
                expect(results[2]).toEqual('pong');
                done();

            }
        );

        transaction.sendRequest(chan, 'ping');
        transaction.sendRequest(chan, 'ping');
        transaction.sendRequest(chan, 'ping');
        transaction.commit();

    });

    it('Should be able to run a multiple requests on different channels and trigger onComplete', (done) => {
        const chanA = '#somechannel-b';
        const chanB = '#somechannel-a';

        bus.respondStream(chanA)
            .generate(
                () => 'pong'
            );

        bus.respondStream(chanB)
            .generate(
                () => 'pongy'
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(2);
                expect(results[0]).toEqual('pong');
                expect(results[1]).toEqual('pongy');
                done();

            }
        );

        transaction.sendRequest(chanA, 'ping');
        transaction.sendRequest(chanB, 'ping');
        transaction.commit();

    });

    it('Should be able to run a multiple requests on different channels and trigger onComplete', (done) => {
        const chanA = '#somechannel-b';
        const chanB = '#somechannel-a';

        bus.respondStream(chanA)
            .generate(
                () => 'pong'
            );

        bus.respondStream(chanB)
            .generate(
                () => 'pongy'
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(4);
                expect(results.includes('pong')).toBeTruthy();
                expect(results.includes('pongy')).toBeTruthy();
                let pongCount = 0;
                let pongyCount = 0;
                for (let i = 0; i < results.length; ++i) {
                    if (results[i] === 'pong') {
                        pongCount++;
                    }
                    if (results[i] === 'pongy') {
                        pongyCount++;
                    }
                }
                expect(pongCount).toEqual(2);
                expect(pongyCount).toEqual(2);
                done();
            }
        );

        transaction.sendRequest(chanA, 'ping');
        transaction.sendRequest(chanB, 'ping');
        transaction.sendRequest(chanA, 'ping');
        transaction.sendRequest(chanB, 'ping');
        transaction.commit();

    });

    it('Should be able to handle errors mid async transaction', (done) => {
        transaction.onError(
            (error: string) => {
                expect(error).toEqual('error!');
                done();
            }
        );

        bus.listenRequestOnce(chan)
            .handle(
                () => {
                    bus.sendErrorMessage(chan, 'error!');
                }
            );

        transaction.sendRequest(chan, 'ping');
        transaction.commit();

    });

    it('Transaction start and end times should be valid', (done) => {
        let transRecipt: TransactionReceipt;

        bus.respondOnce(chan)
            .generate(
                () => 'pong'
            );


        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(1);
                expect(results[0]).toEqual('pong');

                let endNow = new Date().getTime();

                expect(transRecipt.completedTime).not.toBeNull();
                expect(transRecipt.aborted).toBeFalsy();
                expect(transRecipt.complete).toBeTruthy();
                expect(transRecipt.completedTime).toBeLessThanOrEqual(endNow);
                done();
            }
        );

        transaction.sendRequest(chan, 'ping');
        transRecipt = transaction.commit();
        let startNow = new Date().getTime();
        expect(transRecipt.startedTime).not.toBeNull();
        expect(transRecipt.aborted).toBeFalsy();
        expect(transRecipt.complete).toBeFalsy();
        expect(transRecipt.completedTime).toBeUndefined();
        expect(transRecipt.startedTime).toBeLessThanOrEqual(startNow);


    });

    it('Should be able run a simple synchonrous transaction', (done) => {
        transaction = bus.createTransaction(TransactionType.SYNC);
        let count = 0;
        bus.respondStream(chan)
            .generate(
                () => 'pong' + count++
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(5);
                expect(results[0]).toEqual('pong0');
                expect(results[1]).toEqual('pong1');
                expect(results[2]).toEqual('pong2');
                expect(results[3]).toEqual('pong3');
                expect(results[4]).toEqual('pong4');
                done();
            }
        );

        transaction.sendRequest(chan, 'ping');
        transaction.sendRequest(chan, 'ting');
        transaction.sendRequest(chan, 'sing');
        transaction.sendRequest(chan, 'ring');
        transaction.sendRequest(chan, 'fing');
        transaction.commit();

    });

    it('Should be able run a simple synchonrous transactions across multiple channels', (done) => {
        const chanA = '#somechannel-a';
        const chanB = '#somechannel-b';
        transaction = bus.createTransaction(TransactionType.SYNC);
        let countA = 0;
        let countB = 0;
        bus.respondStream(chanA)
            .generate(
                () => 'pong' + countA++
            );

        bus.respondStream(chanB)
            .generate(
                () => 'ponger' + countB++
            );

        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(6);
                expect(results[0]).toEqual('pong0');
                expect(results[1]).toEqual('ponger0');
                expect(results[2]).toEqual('pong1');
                expect(results[3]).toEqual('ponger1');
                expect(results[4]).toEqual('pong2');
                expect(results[5]).toEqual('ponger2'); 
                done();
            }
        );

        transaction.sendRequest(chanA, 'ping');
        transaction.sendRequest(chanB, 'ting');
        transaction.sendRequest(chanA, 'sing');
        transaction.sendRequest(chanB, 'ring');
        transaction.sendRequest(chanA, 'fing');
        transaction.sendRequest(chanB, 'fing');
        transaction.commit();

    });

    it('Should be able to handle errors mid sync transaction', (done) => {
        transaction = bus.createTransaction(TransactionType.SYNC);
       
        transaction.onError(
            (error: string) => {
                expect(error).toEqual('error!');
                done();
            }
        );

        bus.listenRequestOnce(chan)
            .handle(
                () => {
                    bus.sendErrorMessage(chan, 'error!');
                }
            );

        transaction.sendRequest(chan, 'ping');
        transaction.commit();
    });

    it('Should be able wait for multiple stores to be ready asychronously before completing transaction', (done) => {
        transaction.onComplete(
            (results: string[]) => {
                expect(results.length).toEqual(3);
                done();
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.waitForStoreReady('store2');
        transaction.waitForStoreReady('store3');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        const store2 = bus.stores.createStore('store2');
        const store3 = bus.stores.createStore('store3');
        
        store1.initialize();
        store2.initialize();
        store3.initialize();
    });

    it('Should be able wait for multiple stores and requests to be completed asynchronously', (done) => {
        let count = 0;

        bus.respondStream(chan)
            .generate(
               () => StompParser.genUUID()
             );

        transaction.onComplete(
            (results: any[]) => {
                
                expect(results.length).toEqual(6);
                done();
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.sendRequest(chan, 'ping1');
        transaction.waitForStoreReady('store2');
        transaction.sendRequest(chan, 'ping2');
        transaction.waitForStoreReady('store3');
        transaction.sendRequest(chan, 'ping3');

        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        const store2 = bus.stores.createStore('store2');
        const store3 = bus.stores.createStore('store3');
        
        store1.initialize();
        store2.initialize();
        store3.initialize();
    });

    it('Should be able wait for multiple stores and requests to be completed synchronously', (done) => {
    
        transaction = bus.createTransaction(TransactionType.SYNC, 'mixed-sync-store');
        let count = 0;

        bus.respondStream(chan)
            .generate(
               () => 'pong-' + count++
             );

        transaction.onComplete(
            (results: any[]) => {
                expect(results.length).toEqual(6);
                expect(results[0] instanceof Map).toBeTruthy();
                expect(results[0].get('ember')).toEqual('chomp');
                expect(results[1]).toEqual('pong-0');
                expect(results[2] instanceof Map).toBeTruthy();
                expect(results[2].get('fox')).toEqual('honk');
                expect(results[3]).toEqual('pong-1');
                expect(results[4] instanceof Map).toBeTruthy();
                expect(results[4].get('cotton')).toEqual('stomp');
                expect(results[5]).toEqual('pong-2');
                done();
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.sendRequest(chan, 'ping1');
        transaction.waitForStoreReady('store2');
        transaction.sendRequest(chan, 'ping2');
        transaction.waitForStoreReady('store3');
        transaction.sendRequest(chan, 'ping3');

        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        const store2 = bus.stores.createStore('store2');
        const store3 = bus.stores.createStore('store3');
        
        store1.put('ember', 'chomp', null);
        store1.initialize();

        store2.put('fox', 'honk', null);
        store2.initialize();

        store3.put('cotton', 'stomp', null);
        store3.initialize();

    });

    it('Check waitForStoreReady() cannot fire if the transaction as been completed', (done) => {

        spyOn(log, 'warn').and.callThrough();
        transaction.onComplete(
            () => {
                try {
                    transaction.waitForStoreReady('store1');
                } catch (e) {
                    expect(log.warn).toHaveBeenCalledTimes(1);
                    done();
                }
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        store1.initialize();
    });

    it('Check sendRequest() cannot fire if the transaction as been completed', (done) => {

        spyOn(log, 'warn').and.callThrough();
        transaction.onComplete(
            () => {
                try {
                    transaction.sendRequest('maggie', 'pop');
                } catch (e) {
                    expect(log.warn).toHaveBeenCalledTimes(1);
                    done();
                }
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        store1.initialize();
    });

    it('Check onComplete() cannot fire if the transaction as been completed', (done) => {

        spyOn(log, 'warn').and.callThrough();
        transaction.onComplete(
            () => {
                try {
                    transaction.onComplete(() => console.log('chickie'));
                } catch (e) {
                    expect(log.warn).toHaveBeenCalledTimes(1);
                    done();
                }
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        store1.initialize();
    });

    it('Check commit() cannot fire if the transaction as been completed', (done) => {

        spyOn(log, 'warn').and.callThrough();
        transaction.onComplete(
            () => {
                try {
                    transaction.commit();
                } catch (e) {
                    expect(log.warn).toHaveBeenCalledTimes(1);
                    done();
                }
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        store1.initialize();
    });


    it('Check commit() cannot fire if no requests have been made', (done) => {

        try {
            transaction.commit();
        } catch (e) {
            done();
        }

    });

    it('Check onError() cannot fire if the transaction as been completed', (done) => {

        spyOn(log, 'warn').and.callThrough();
        transaction.onComplete(
            () => {
                try {
                    transaction.onError(() => console.log('chickie'));
                } catch (e) {
                    expect(log.warn).toHaveBeenCalledTimes(1);
                    done();
                }
            }
        );

        transaction.waitForStoreReady('store1');
        transaction.commit();

        const store1 = bus.stores.createStore('store1');
        store1.initialize();
    });



});