import { Component } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { LogLevel } from '@vmw/bifrost/log';
import { ServiceLoader } from '@vmw/bifrost/util/service.loader';
import { ServbotService } from '@services/servbot/servbot.service';
import { VMCBotService } from '@services/vmcbot/vmcbot.service';

// create bus and load services.
BusUtil.bootBusWithOptions(LogLevel.Debug, false);

// load our services independently of Angular.
ServiceLoader.addService(ServbotService);
ServiceLoader.addService(VMCBotService);

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

}