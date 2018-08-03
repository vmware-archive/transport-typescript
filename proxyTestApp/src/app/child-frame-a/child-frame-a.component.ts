import { Component, OnInit } from '@angular/core';
import { ProxyControl, ProxyType } from '@vmw/bifrost/proxy/message.proxy';
import { EventBus } from '@vmw/bifrost';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-child-frame-a',
    templateUrl: './child-frame-a.component.html',
    styleUrls: ['./child-frame-a.component.css']
})
export class ChildFrameAComponent implements OnInit {

    private bus: EventBus;
    private proxyControl: ProxyControl;
    private proxyActive: boolean = false;

    constructor(route: ActivatedRoute) {

        this.bus = BusUtil.getBusInstance();
    }

    ngOnInit(): void {

        this.proxyControl = this.bus.enableMessageProxy({
            protectedChannels: ['general-chat'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
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
