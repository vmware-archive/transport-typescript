/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit } from '@angular/core';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { RestService } from '@vmw/bifrost/core/services/rest/rest.service';
import { TangoAngularHttpClientAdapter } from '@vmw/tango';
import { HttpClient } from '@angular/common/http';
import { BusStore } from '@vmw/bifrost/store.api';
import { RestyBase } from './resty.base';


@Component({
    selector: 'resty',
    templateUrl: './resty.component.html',
    styleUrls: ['./resty.component.css']
})
export class RestyComponent extends RestyBase implements OnInit {

    public status = 'asleep';
    public online = false;
    public avatarIcon = '👴🏻';
    private serviceLoaded = false;

    private restyStateStore: BusStore<boolean>;

    constructor(private http: HttpClient) {
        super('RestyComponent');
        this.restyStateStore = this.storeManager.createStore('resty');
    }

    ngOnInit() {
    }

    public wakeupResty() {
        if (!this.serviceLoaded) {
            const tangoHttpClientAdaptor = new TangoAngularHttpClientAdapter(this.http, '');

            // load rest service dynamically and use Tango Client as transport.
            ServiceLoader.addService(RestService, tangoHttpClientAdaptor);
            this.serviceLoaded = true;
        }
        this.status = 'online';
        this.online = true;

        // set universal global headers for all requests.
        this.setGlobalHttpHeaders({'Accept': 'application/json'});

        // change state in store, everyone will know old man resty is awake.
        this.restyStateStore.put('state', true, 'online');


        this.publishChatMessage(
            this.createChatMessage(
                'Old Man Resty',
                this.avatarIcon,
                'Stop using that new fangled bus, use REST instead'
            )
        );
    }

    public sleepResty() {
        this.status = 'asleep';
        this.online = false;

        // change state in store, everyone will know old man resty is awake.
        this.restyStateStore.put('state', false, 'online');

        this.publishChatMessage(
            this.createChatMessage(
                'Old Man Resty',
                this.avatarIcon,
                'Going back to sleep, no more REST for now.'
            )
        );
    }


}
