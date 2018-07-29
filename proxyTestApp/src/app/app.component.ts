import { Component } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { LogLevel } from '@vmw/bifrost/log';
import { EventBus } from '@vmw/bifrost';

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
        this.bus.enableMessageProxy(null)
    }

}
