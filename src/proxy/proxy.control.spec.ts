/**
 * Copyright(c) VMware Inc. 2016-2018
 */

import { EventBus } from '../bus.api';
import { Logger } from '../log';
import { BusTestUtil } from '../util/test.util';
import { ProxyType } from './message.proxy';

fdescribe('Proxy Controls [proxy/proxy.control.ts]', () => {

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

    it('Basic start up works and property fetching accurate as expected.', () => {
        const control = bus.enableMessageProxy({
            protectedChannels: ['auth-chan1'],
            proxyType: ProxyType.Parent,
            targetOrigin: ['http://somewhere.out.there'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        });

        expect(control.isListening).toBeTruthy();
        expect(control.getAllowedOrigins().length).toBe(1);
        expect(control.getAllowedOrigins()[0]).toEqual('http://somewhere.out.there');
        expect(control.getTargetedFrames()).toBeNull();
        expect(control.isTargetingAllFrames).toBeTruthy();

    });

});