/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { Channel } from './channel.model';
import { LogUtil } from '../../log/util';
import { Message } from './message.model';
import { Logger } from '../../log';

/**
 * This is the unit test for the Stream model.
 */

const name = 'channel.model';

describe('Stream Model [channel.model]', () => {

    let channel: Channel;
    let log: Logger;

    let testObject = {
        name: 'test'
    };

    let testError = {
        error: 'fake error'
    };
    beforeEach(
        () => {
            channel = new Channel('test-stream');
            log = new Logger();
            log.silent(true);
        }
    );

    it('Should verify stream creation', () => {
        channel.decrement();
        channel.decrement();
        expect(channel.refCount)
            .toBe(0);
        expect(channel.name)
            .toBe('test-stream');
        expect(channel.stream)
            .not
            .toBeUndefined();
    });

    it('Should send and receive an object', (done) => {
        channel.stream.subscribe(
            (message: Message) => {
                expect(message.payload.name)
                    .toBe(testObject.name);
                done();
            },

            (error: any) => {
                // shouldn't come here
                log.error('Unexpected error on stream.send: ' + LogUtil.pretty(error), name);
            }
        );

        channel.send(new Message().request(testObject));
    });

    it('Should send and receive an error', (done) => {
        channel.stream.subscribe(
            (message: Message) => {
                // shouldn't come here
                log.error('Unexpected data received: ' + LogUtil.pretty(message), name);
            },

            (error: any) => {
                expect(error.error)
                    .toBe(testError.error);
                done();
            }
        );

        channel.error(testError);
    });

    it('Should send and receive a completion', (done) => {
        channel.stream.subscribe(
            (message: Message) => {
                // shouldn't come here
                log.error('Unexpected data received: ' + LogUtil.pretty(message), name);
            },

            (error: any) => {
                // shouldn't come here
                log.error('Unexpected error received: ' + LogUtil.pretty(error), name);
            },

            () => {
                expect(channel.isClosed)
                    .toBeTruthy();
                log.debug('Completion correctly received.', name);
                done();
            }
        );

        channel.complete();
    });

    it('check subscribers and observers work correctly.', () => {
        const uuidA = channel.createSubscriber();
        expect(channel.getSubscriber(uuidA).id).toEqual(uuidA);

        const uuidB = channel.createObserver();
        expect(channel.getObserver(uuidB).id).toEqual(uuidB);

        channel.removeObserver(uuidB);
        expect(channel.getObserver(uuidB)).toBeUndefined();

        channel.setGalactic();
        expect(channel.galactic).toBeTruthy();

        channel.setLocal();
        expect(channel.galactic).toBeFalsy();
        
    });

    it('check galactic and private switches work.', () => {

        channel.setGalactic();
        expect(channel.galactic).toBeTruthy();

        channel.setLocal();
        expect(channel.galactic).toBeFalsy();
        
    });

    it('check private and public switches work.', () => {
        channel.setPrivate();
        expect(channel.isPrivate).toBeTruthy();

        channel.setPublic();
        expect(channel.isPrivate).toBeFalsy();
    })
});

