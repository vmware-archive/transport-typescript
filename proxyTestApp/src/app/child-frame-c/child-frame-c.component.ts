import { Component, OnInit } from '@angular/core';
import { EventBus } from '@vmw/bifrost';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';

@Component({
    selector: 'app-child-frame-c',
    templateUrl: './child-frame-c.component.html',
    styleUrls: ['./child-frame-c.component.css']
})
export class ChildFrameCComponent implements OnInit {

    private bus: EventBus;
    constructor() {
        this.bus = BusUtil.getBusInstance();
    }

    ngOnInit(): void {
        this.bus.enableMessageProxy({
            protectedChannels: ['general-chat'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
            targetAllFrames: false,
            targetSpecificFrames: null,
        });
    }
}
