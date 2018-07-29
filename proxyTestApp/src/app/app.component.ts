import { Component } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';

BusUtil.bootBus();

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

}
