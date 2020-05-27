/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { EventBus } from '../bus.api';
import { IFrameProxyControl, MessageProxyConfig, ProxyControl } from './message.proxy.api';
import { ProxyControlImpl } from './proxy.control';

/**
 * MessageProxy transparently connects up event bus instances across the main application
 * and across child applications, running inside iframes. ShadowDOM support will make it in as an optional
 * variant, once we have WebComponent Support universally in browsers.
 */
export class MessageProxy {

    constructor(private bus: EventBus) {
        // do something
    }

    private proxyControl: IFrameProxyControl;

    /**
     * Enable proxy, pass in a configuration to set things in motion.
     *
     * @param {MessageProxyConfig} config
     */
    public enableProxy(config: MessageProxyConfig): ProxyControl {

        if (!this.proxyControl) {
            this.proxyControl = new ProxyControlImpl(this.bus, config);
        }
        return this.proxyControl;

    }

}
