/**
 * Copyright(c) VMware Inc. 2016-2018
 */
import { BifrostEventBus } from '../bus';
import { EventBus } from '../bus.api';
import { LogLevel } from '../log';

/**
 * Test utility to encapsulate bus operations for test runs.
 */
export class BusUtil {

    /**
     * Get instance of the current bus instance.
     * @returns {EventBus} the bus
     */
    public static getBusInstance(): EventBus {
        return BifrostEventBus.getInstance();
    }

    /**
     * Boot and create a singleton EventBus instance with default options
     * @returns {EventBus} the bus.
     */
    public static bootBus(): EventBus {
        return BifrostEventBus.boot();
    }

    /**
     * Boot and create a singleton EventBus instance with custom options for logging level and boot message
     * @param {LogLevel} logLevel log level to set
     * @param {boolean} disableBootMessage set to true to turn off the boot message.
     * @param {boolean} darkTheme enables dark theme friendly logging output (defaults to off).
     * @returns {EventBus} the bus
     */
    public static bootBusWithOptions(logLevel: LogLevel, disableBootMessage: boolean, darkTheme: boolean = false): EventBus {
        return BifrostEventBus.bootWithOptions(logLevel, disableBootMessage, darkTheme);
    }

    /**
     * Destroy the bus.
     */
    public static destroy(): void {
        BifrostEventBus.destroy();
    }

    /**
     * Return connection string used to establish and manage one or more Fabric connections
     * @param {string} host hostname where Fabric backend is served
     * @param {number} port port where Fabric backend is served
     * @param {string} endpoint target endpoint
     */
    public static getFabricConnectionString(host: string, port: number, endpoint: string) {
        return `${host}:${port}${endpoint}`;
    }
}
