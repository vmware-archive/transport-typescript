/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit } from '@angular/core';
import { ServbotBase } from './servbot.base';

@Component({
    selector: 'servbot',
    templateUrl: './servbot.component.html',
    styleUrls: ['./servbot.component.css']
})
export class ServbotComponent extends ServbotBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;
    public connecting: boolean = false;

    constructor() {
        super('ServbotComponent');
    }

    ngOnInit() {
        this.listenForServbotOnlineState(
            () => {
                this.status = 'online';
                this.online = true;
                this.connecting = false;
            }
        );
    }

    public connectServbotToBus() {
        this.connecting = true;
        this.status = 'connecting';
        this.connectServbot();
    }

}
