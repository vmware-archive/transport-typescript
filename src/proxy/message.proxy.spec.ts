/**
 * Copyright(c) VMware Inc. 2016-2018
 */

import { EventBus } from '../bus.api';
import { Logger } from '../log';
import { BusTestUtil } from '../util/test.util';

describe('Message Proxy [proxy/message.proxy.ts]', () => {

    let bus: EventBus;
    let log: Logger;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBus();
            bus.api.loggerInstance.setStylingVisble(false);
            //bus.api.enableMonitorDump(true);
            log = bus.api.logger();
        }
    );

    it('Basic start up works as expected.', () => {
        //expect(transaction).not.toBeUndefined();
    });

});