/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../../bus.api';
import { Logger, LogLevel } from '../../../log';
import { BusTestUtil } from '../../../util/test.util';

import * as fetchMock from 'fetch-mock'
import { RestOperations } from './rest.operations';
import { RestService } from './rest.service';
import { RestObject } from './rest.model';
import { Message } from '../../../bus';

describe('Bifröst Rest Operations [cores/services/rest/rest.operations]', () => {

    let bus: EventBus;
    let log: Logger;
    let operations: RestOperations;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);
            bus.enableDevMode();
            log = bus.api.logger();
            operations = RestOperations.getInstance();
        }
    );

    afterEach(
        () => {
            fetchMock.reset();
        }
    );

    it('Check singleton exists.',
        () => {
            expect(operations).not.toBeNull();
        }
    );

    it('Check singleton can be destroyed.',
        () => {
            let currentId = operations.id;
            RestOperations.destroy();
            let newId = RestOperations.getInstance().id;
            expect(currentId).not.toEqual(newId);
        }
    );

    xit('Check global headers can be sent by operation.',
        (done) => {
            // bus.(RestService.channel).handle(
            //     (restObject: RestObject) => {
            //         expect(restObject.headers.hello).toEqual('there');
            //         done();
            //     }
            // );
            bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    console.log(msg);
                    done();
                }
            );

            operations.setGlobalHttpHeaders({hello: 'there'}, 'test');
        }
    );

});