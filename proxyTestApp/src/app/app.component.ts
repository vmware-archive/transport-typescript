import { Component } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { LogLevel } from '@vmw/bifrost/log';
import { EventBus } from '@vmw/bifrost';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';

BusUtil.bootBusWithOptions(LogLevel.Debug, false);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    private bus: EventBus;

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.bus.enableMessageProxy({
            protectedChannels: ['chan1', 'chan2', 'chan3'],
            proxyType: ProxyType.Parent,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        })
    }

}


/*

  parentOrigin: string;
    acceptedOrigins: string[];
    targetAllFrames: boolean;
    targetSpecificFrames: string[];
    protectedChannels: string[];
    proxyType: ProxyType;
 */
