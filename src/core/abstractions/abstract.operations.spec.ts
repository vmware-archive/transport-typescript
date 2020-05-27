/*
 * Copyright 2019-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
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

describe('Transport Abstract Operations [cores/abstractions/abstract.operations]', () => {

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

    it('Check callService with XSRF handling operates correctly.',
        (done) => {

            let channel = 'test-service-channel';

            let sub = bus.api.getChannel(channel).subscribe(
                (msg: Message) => {
                    const payload = msg.payload as any;
                    expect(payload.headers).toBeDefined();
                    expect(payload.headers[bus.fabric.getXsrfTokenStoreKey()]).toBe('fake-token');
                    expect(payload.query).toEqual('prettiest');
                    // fake response
                    if (msg.isRequest()) {
                        msg.payload = {prettiest: 'melody'};
                        bus.sendResponseMessageWithId(channel, msg, msg.id);
                        sub.unsubscribe();
                    }
                }
            );

            bus.fabric.setXsrfTokenEnabled(true);
            bus.fabric.setXsrfToken('fake-token');
            operations.callService(channel, {query: 'prettiest'},
                (resp: any) => {
                    expect(resp.prettiest).toEqual('melody');
                    done();
                }
            );

        }
    );

});
