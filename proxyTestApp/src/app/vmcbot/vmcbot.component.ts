import { Component, OnInit } from '@angular/core';
import { EventBus } from '@vmw/bifrost';
import { AbstractBase } from '@vmw/bifrost/core';
import { VMCBotService } from '../../services/vmcbot/vmcbot.service';
import { VMCCommand } from '../../services/vmcbot/vmcbot.model';

@Component({
    selector: 'vmcbot',
    templateUrl: './vmcbot.component.html',
    styleUrls: ['./vmcbot.component.css']
})
export class VMCBotComponent extends AbstractBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;

    constructor() {
        super('VMCBotComponent');
    }

    ngOnInit() {
        this.listenForVMCBotOnlineState();
    }

    public connectVMCBot() {
        this.bus.sendRequestMessage(VMCBotService.serviceChannel, {command:VMCCommand.Connect}, EventBus.id);
    }

    private listenForVMCBotOnlineState() {
        this.bus.listenOnce(VMCBotService.onlineChannel).handle(
            () => {
                this.status = 'online';
                this.online = true;
            }
        );
    }

}
