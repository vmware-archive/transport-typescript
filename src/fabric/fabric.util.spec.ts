/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus, ORG_ID, ORGS } from '../bus.api';
import { Logger, LogLevel } from '../log';
import { BusTestUtil } from '../util/test.util';
import { BrokerConnector } from '../bridge';
import { FabricUtil } from './fabric.util';

describe('Fabric Utils [fabric/fabric.util.spec]', () => {

    let bus: EventBus;
    let log: Logger;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);
            bus.enableDevMode();
            log = bus.api.logger();
        }
    );

    it('Check validation works for requests',
        () => {
            expect(FabricUtil.isPayloadFabricRequest(
                bus.fabric.generateFabricRequest('hello', 'there')
            )).toBeTruthy();
        }
    );

    it('Check validation works for requests with empty payloads',
        () => {
            expect(FabricUtil.isPayloadFabricRequest(null)).toBeFalsy();
        }
    );

});
