/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { TransportEventBus, ORG_ID, ORGS, UUID } from '../bus';
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
        return TransportEventBus.reboot();
    }

    /**
     * Boot bus with supplied options. Should be used in any @Before annotated statements.
     * @param {LogLevel} logLevel set the desired log level
     * @param {boolean} disableBootMessage disable the boot message.
     * @returns {EventBus} the bus.
     */
    public static bootBusWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        return TransportEventBus.rebootWithOptions(logLevel, disableBootMessage);
    }

    /**
     * Set the orgId for the currently selected organization (if API is talking to VMware Cloud Services)
     * @param orgId organization ID that is currently being managed.
     */
    public static setOrganizationId(orgId: UUID): void {
        TransportEventBus.getInstance().stores.createStore(ORGS).put(ORG_ID, orgId, null);
    }
}
