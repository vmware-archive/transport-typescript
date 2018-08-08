import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { RestService } from '@vmw/bifrost/core/services/rest/rest.service';
import { TangoAngularHttpClientAdapter } from '@vmw/tango';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'resty',
    templateUrl: './resty.component.html',
    styleUrls: ['./resty.component.css']
})
export class RestyComponent extends AbstractBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;

    constructor(private http: HttpClient) {
        super('RestyComponent');
    }

    ngOnInit() {
    }

    public connectResty() {
        // const tangoHttpClientAdaptor = new TangoAngularHttpClientAdapter(this.http, '/');
        // ServiceLoader.addService(RestService, tangoHttpClientAdaptor);
        this.status = 'online';
        this.online = true;
    }

}