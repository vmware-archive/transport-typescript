import {Channel} from './channel.model';
import {Syslog} from '../log/syslog';
import {LogUtil} from '../log/util';
import {Message} from './message.model';
import {BifrostModule} from '../bifrost.module';
import {TestBed} from '@angular/core/testing';

/**
 * This is the unit test for the Stream model.
 */


describe('Stream Model [stream]', () => {

    let channel: Channel;

    let testObject = {
        name: 'test'
    };

    let testError = {
        error: 'fake error'
    };

    beforeEach(function () {
        channel = new Channel('test-stream');
        TestBed.configureTestingModule({
            imports: [BifrostModule.forRoot()]
        });
    });

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
                Syslog.error('Unexpected error on stream.send: ' + LogUtil.pretty(error), 'stream.spec');
            }
        );

        channel.send(new Message().request(testObject));
    });

    it('Should send and receive an error', (done) => {
        channel.stream.subscribe(
            (message: Message) => {
                // shouldn't come here
                Syslog.error('Unexpected data received: ' + LogUtil.pretty(message), 'stream.spec');
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
                Syslog.error('Unexpected data received: ' + LogUtil.pretty(message), 'stream.spec');
            },

            (error: any) => {
                // shouldn't come here
                Syslog.error('Unexpected error received: ' + LogUtil.pretty(error), 'stream.spec');
            },

            () => {
                expect(channel.isClosed)
                    .toBeTruthy();
                Syslog.debug('Completion correctly received.', 'stream.spec');
                done();
            }
        );

        channel.complete();
    });
});

