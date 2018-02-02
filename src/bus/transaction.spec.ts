/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { MessagebusService } from '../';

import { BusTransactionImpl } from './transaction';
import { BusTransaction, EventBus } from './bus.api';

xdescribe('Bus Transactions [trasnaction.ts]', () => {
    
    let transaction: BusTransaction;
    let bus: EventBus;
    
    beforeEach(
        () => {
            transaction = new BusTransactionImpl();
            bus = new MessagebusService();
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

});