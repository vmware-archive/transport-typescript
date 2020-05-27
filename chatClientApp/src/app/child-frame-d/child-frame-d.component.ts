/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/transport/core';
import { ProxyControl } from '@vmw/transport/proxy';
import { GeneralChatChannel } from '../chat-message';
import { ProxyType } from '@vmw/transport/proxy/message.proxy.api';

@Component({
    selector: 'app-child-frame-d',
    templateUrl: './child-frame-d.component.html',
    styleUrls: ['./child-frame-d.component.css']
})
export class ChildFrameDComponent extends AbstractBase implements OnInit {

    private proxyControl: ProxyControl;
    private proxyActive: boolean = false;

    constructor() {
        super('ChildFrameDComponent');
    }

    ngOnInit(): void {

        this.proxyControl = this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, 'servbot-query'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4300',
            acceptedOrigins: [
                'http://localhost:8070',
                'http://localhost:4400',
                'http://localhost:4300',
                'http://localhost:4200',
                'http://10.126.88.213:8070',
                'http://ngx.eng.vmware.com',
                'http://ngx-components.eng.vmware.com'
            ],
            targetAllFrames: false,
            targetSpecificFrames: null,
        });
        this.proxyActive = true;
    }

    public appOnline(appListeningState: boolean): void {
        if (appListeningState && !this.proxyActive) {
            this.proxyControl.listen();
            this.proxyActive = true;
        }

        if (!appListeningState && this.proxyActive) {
            this.proxyControl.stopListening();
            this.proxyActive = false;
        }
    }
}
