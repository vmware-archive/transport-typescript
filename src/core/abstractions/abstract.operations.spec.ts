/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../bus.api';
import { AbstractOperations } from './abstract.operations';
import { Message } from '../../bus';
import { BusUtil } from '../../util/bus.util';
import { GeneralError } from '../model/error.model';


class MyOperations extends AbstractOperations {
    constructor() {
        super('MyOperations');
    }
}

describe('Bifröst Abstract Operations [cores/abstractions/abstract.operations]', () => {

    let bus: EventBus;
    let operations: MyOperations;

    beforeEach(
        () => {
            bus = BusUtil.getBusInstance();
           operations = new MyOperations();
        }
    );


    it('Check callService operates correctly.',
        (done) => {

            let channel = 'test-service-channel';

            let sub = bus.api.getChannel(channel).subscribe(
                (msg: Message) => {
                    const payload = msg.payload as any;
                    expect(payload.query).toEqual('prettiest');
                    // fake response
                    if (msg.isRequest()) {
                        msg.payload = {prettiest: 'melody'};
                        bus.sendResponseMessageWithId(channel, msg, msg.id);
                        sub.unsubscribe();
                    }
                }
            );

            operations.callService(channel, {query: 'prettiest'},
                (resp: any) => {
                    expect(resp.prettiest).toEqual('melody');
                    done();
                }
            );

        }
    );

    it('Check callService operates correctly with an error.',
        (done) => {

            let channel = 'test-service-channel-error';

            let sub = bus.api.getChannel(channel).subscribe(
                (msg: Message) => {
                    const payload = msg.payload as any;
                    expect(payload.query).toEqual('prettiest');
                    // fake response
                    if (msg.isRequest()) {
                        bus.sendErrorMessageWithId(channel, new GeneralError('bad milk'), msg.id);
                        sub.unsubscribe();
                    }
                }
            );

            operations.callService(channel, {query: 'prettiest'},
                () => {},
                (error: GeneralError) => {
                    expect(error.message).toEqual('bad milk');
                    done();
                }
            );
        }
    );
});
