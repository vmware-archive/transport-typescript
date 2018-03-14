/**
 * Copyright(c) VMware Inc. 2016-2017
 */
import { BifrostEventBus } from '../bus';
import { EventBus } from '../bus.api';
import { LogLevel } from '../log';
import { BusUtil } from './bus.util';

/**
 * Test utility to encapsulate bus operations for test runs.
 */
export class BusTestUtil extends BusUtil {

    /**
     * Boot bus default options. Should be used in any @Before annottated statements.
     * @returns {EventBus}
     */
    public static bootBus(): EventBus {
        return BifrostEventBus.reboot();
    }

    /**
     * Boot bus with supplied options. Should be used in any @Before annottated statements.
     * @param {LogLevel} logLevel set the desired log level
     * @param {boolean} disableBootMessage disable the boot message.
     * @returns {EventBus} the bus.
     */
    public static bootBusWithOptions(logLevel: LogLevel, disableBootMessage: boolean): EventBus {
        return BifrostEventBus.rebootWithOptions(logLevel, disableBootMessage);
    }

}