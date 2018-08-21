import { Component } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { LogLevel } from '@vmw/bifrost/log';

// create bus and load services.
BusUtil.bootBusWithOptions(LogLevel.Debug, false);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatClientApp';
}
