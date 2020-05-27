/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit } from '@angular/core';
import { VMCBotBase } from './vmcbot.base';

@Component({
    selector: 'vmcbot',
    templateUrl: './vmcbot.component.html',
    styleUrls: ['./vmcbot.component.css']
})
export class VMCBotComponent extends VMCBotBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;
    public connecting: boolean = false;

    constructor() {
        super('VMCBotComponent');
    }

    ngOnInit() {
        this.listenForVMCBotOnlineState(() => {
            this.status = 'online';
            this.online = true;
        });
    }

    public connectVMCBotToBus() {
        this.status = 'connecting';
        this.connecting = true;
        this.connectVMCBot();
    }

}
