/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { MessagebusService } from '../';

import { BusTransactionImpl } from './transaction';
import { BusTransaction, EventBus, TransactionReceipt, TransactionType } from './bus.api';
import { LogLevel } from '../log';
import { StompParser } from '../bridge/stomp.parser';

describe('Bus Transactions [transaction.ts]', () => {

    let transaction: BusTransaction;
    let bus: EventBus;

    beforeEach(
        () => {
            bus = new MessagebusService(LogLevel.Error, true);
            bus.api.loggerInstance.setStylingVisble(false);
            //bus.api.enableMonitorDump(true);
            transaction = bus.createTransaction();
        }
    );

    it('Basic creation should work', () => {
        expect(transaction).not.toBeUndefined();
    });

    it('Should be able to run a single request and trigger onComplete', (done) => {
        const chan = '#somechannel';

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

    it('Should be able to handle errors mid transaction', (done) => {
        const chan = '#somechannel';

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
        expect(transRecipt.completedTime).toBeUndefined();
        expect(transRecipt.startedTime).toBeLessThanOrEqual(startNow);


    });

    xit('Should be able run a simple synchonrous transaction', (done) => {
        const chan = '#somechannel';
        transaction = bus.createTransaction(TransactionType.SYNC);

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
        transaction.sendRequest(chan, 'ting');
        transaction.commit();

    });

});