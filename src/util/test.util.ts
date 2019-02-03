/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { BifrostEventBus, ORG_ID, ORGS, UUID } from '../bus';
import { EventBus } from '../bus.api';
import { LogLevel } from '../log';
import { BusUtil } from './bus.util';

/**
 * Test utility to encapsulate bus operations for test runs.
 */
export class BusTestUtil extends BusUtil {

    /**
     * Boot bus default options. Should be used in any @Before annotated statements.
     * @returns {EventBus}
     */
    public static bootBus(): EventBus {
        return BifrostEventBus.reboot();
    }

    /**
     * Boot bus with supplied options. Should be used in any @Before annotated statements.
     * @param {LogLevel} logLevel set the desired log level
     * @param {boolean} disableBootMessage disable the boot message.
     * @returns {EventBus} the bus.
     */
    public static bootBusWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        return BifrostEventBus.rebootWithOptions(logLevel, disableBootMessage);
    }

    /**
     * Set the orgId for the currently selected organization (if API is talking to VMware Cloud Services)
     * @param orgId organization ID that is currently being managed.
     */
    public static setOrganizationId(orgId: UUID): void {
        BifrostEventBus.getInstance().stores.createStore(ORGS).put(ORG_ID, orgId, null);
    }

}
