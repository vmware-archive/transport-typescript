import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { RestService } from '@vmw/bifrost/core/services/rest/rest.service';
import { TangoAngularHttpClientAdapter } from '@vmw/tango';
import { HttpClient } from '@angular/common/http';
import { BusStore } from '@vmw/bifrost';


@Component({
    selector: 'resty',
    templateUrl: './resty.component.html',
    styleUrls: ['./resty.component.css']
})
export class RestyComponent extends AbstractBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;

    private restyStateStore: BusStore<boolean>;

    constructor(private http: HttpClient) {
        super('RestyComponent');
        this.restyStateStore = this.storeManager.createStore('resty');
    }

    ngOnInit() {
    }

    public connectResty() {
        const tangoHttpClientAdaptor = new TangoAngularHttpClientAdapter(this.http, '');
        ServiceLoader.addService(RestService, tangoHttpClientAdaptor);
        this.status = 'online';
        this.online = true;

        // set universal global headers for all requests.
        this.setGlobalHttpHeaders({'Accept': 'application/json'}, this.getName());

        // change state in store, everyone will know old man resty is awake.
        this.restyStateStore.put('state', true, 'online');



    }

}