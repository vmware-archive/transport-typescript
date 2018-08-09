import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { RestService } from '@vmw/bifrost/core/services/rest/rest.service';
import { TangoAngularHttpClientAdapter } from '@vmw/tango';
import { HttpClient } from '@angular/common/http';
import { BusStore } from '@vmw/bifrost';
import { GeneralChatChannel } from '../chat-message';


@Component({
    selector: 'resty',
    templateUrl: './resty.component.html',
    styleUrls: ['./resty.component.css']
})
export class RestyComponent extends AbstractBase implements OnInit {

    public status: string = 'asleep';
    public online: boolean = false;
    public avatarIcon = '👴🏻';

    private restyStateStore: BusStore<boolean>;

    constructor(private http: HttpClient) {
        super('RestyComponent');
        this.restyStateStore = this.storeManager.createStore('resty');
    }

    ngOnInit() {
    }

    public wakeupResty() {
        const tangoHttpClientAdaptor = new TangoAngularHttpClientAdapter(this.http, '');
        ServiceLoader.addService(RestService, tangoHttpClientAdaptor);
        this.status = 'online';
        this.online = true;

        // set universal global headers for all requests.
        this.setGlobalHttpHeaders({'Accept': 'application/json'}, this.getName());

        // change state in store, everyone will know old man resty is awake.
        this.restyStateStore.put('state', true, 'online');

        this.bus.sendResponseMessage(GeneralChatChannel,
            {
                from: 'Old Man Resty',
                avatar: this.avatarIcon,
                body: "I demand we use REST now.",
                time: Date.now(),
                controlEvent: null,
                error: false,
                task: null
            }
        );
    }

    public sleepResty() {
        this.status = 'asleep';
        this.online = false;

        // change state in store, everyone will know old man resty is awake.
        this.restyStateStore.put('state', false, 'online');

        this.bus.sendResponseMessage(GeneralChatChannel,
            {
                from: 'Old Man Resty',
                avatar: this.avatarIcon,
                body: 'Going back to sleep, no more REST for now.',
                time: Date.now(),
                controlEvent: null,
                error: false,
                task: null
            }
        );
    }


}