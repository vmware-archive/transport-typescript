/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { MessagebusService } from '../';

import { BusTransactionImpl } from './transaction';
import { BusTransaction, EventBus, TransactionReceipt } from './bus.api';

xdescribe('Bus Transactions [trasnaction.ts]', () => {
    
    let transaction: BusTransaction;
    let bus: EventBus;
    
    beforeEach(
        () => {
            bus = new MessagebusService();
            transaction = new BusTransactionImpl(bus, bus.api.logger());   
        }
    );

    it('Basic creation should work', () => {
        expect(transaction).not.toBeUndefined();
    });

    it('Should be able to run a single request and trigger onComplete', (done) => {
        const chan = '#somechannel';
        
        bus.respondOnce(chan)
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
        const chan = '#somechannel';
        
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

    it('Should be able to handle errors mid transaction', (done) => {
        const chan = '#somechannel';
        
        bus.listenRequestOnce(chan)
            .handle(
                () => {
                    bus.sendErrorMessage(chan, 'error!');
                }
            );
            
        transaction.onError(
            (error: string) => {
                expect(error).toEqual('error!');
                done();
            }
        );
        
        transaction.sendRequest(chan, 'ping');
        transaction.commit();
        
    });

    it('Transaction start and end times should be valid', (done) => {
        const chan = '#somechannel';
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
        expect(transRecipt.completedTime).toBeNull();
        expect(transRecipt.startedTime).toBeLessThanOrEqual(startNow);
    

    });

});