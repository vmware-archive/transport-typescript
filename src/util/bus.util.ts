/*
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { TransportEventBus } from '../bus';
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
        return TransportEventBus.getInstance();
    }

    /**
     * Boot and create a singleton EventBus instance with default options
     * @returns {EventBus} the bus.
     */
    public static bootBus(): EventBus {
        return TransportEventBus.boot();
    }

    /**
     * Boot and create a singleton EventBus instance with custom options for logging level and boot message
     * @param {LogLevel} logLevel log level to set
     * @param {boolean} disableBootMessage set to true to turn off the boot message.
     * @param {boolean} darkTheme enables dark theme friendly logging output (defaults to off).
     * @returns {EventBus} the bus
     */
    public static bootBusWithOptions(logLevel: LogLevel, disableBootMessage: boolean, darkTheme: boolean = false): EventBus {
        return TransportEventBus.bootWithOptions(logLevel, disableBootMessage, darkTheme);
    }

    /**
     * Destroy the bus.
     */
    public static destroy(): void {
        TransportEventBus.destroy();
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
