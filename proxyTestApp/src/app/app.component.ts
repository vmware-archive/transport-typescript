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
            protectedChannels: ['auth-chan1'],
            proxyType: ProxyType.Parent,
            targetOrigin: ['http://localhost:4200'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        })
    }

}
