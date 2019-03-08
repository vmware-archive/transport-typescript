/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../bus.api';
import { BusTestUtil } from '../../util/test.util';
import { LogLevel } from '../../log';
import { AbstractOperations } from './abstract.operations';
import { RestService } from '../services/rest/rest.service';
import { Message } from '../../bus';
import { RestObject } from '..';


class MyOperations extends AbstractOperations {
    constructor() {
        super('MyOperations');
    }
}

xdescribe('Bifröst Abstract Operations [cores/abstractions/abstract.operations]', () => {

    let bus: EventBus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
    let operations: MyOperations;

    beforeEach(
        () => {
            operations = new MyOperations();
        }
    );

    it('Check callService operates correctly.',
        (done) => {

            let channel = 'test-channel';

            let sub = bus.api.getChannel(channel).subscribe(
                (msg: Message) => {
                    const payload = msg.payload as any;
                    expect(payload.query).toEqual('prettiest');
                    // fake response
                    if (msg.isRequest()) {
                        bus.sendResponseMessageWithId(channel, {prettiest: 'melody'}, msg.id);
                        done();
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
});
