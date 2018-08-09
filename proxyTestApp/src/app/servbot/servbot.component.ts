import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ServbotService } from '../../services/servbot/servbot.service';
import { EventBus } from '@vmw/bifrost';
import { ChatCommand } from '../../services/servbot/servbot.model';

@Component({
    selector: 'servbot',
    templateUrl: './servbot.component.html',
    styleUrls: ['./servbot.component.css']
})
export class ServbotComponent extends AbstractBase implements OnInit {

    public status: string = 'offline';
    public online: boolean = false;
    public connecting: boolean = false;

    constructor() {
        super('ServbotComponent');
    }

    ngOnInit() {
        this.listenForServbotOnlineState();
    }

    public connectServbot() {
        this.connecting = true;
        this.status = 'connecting';
        this.bus.sendRequestMessage(ServbotService.queryChannel, {command: ChatCommand.Connect}, EventBus.id);
    }

    private listenForServbotOnlineState() {
        this.bus.listenOnce(ServbotService.onlineChannel).
            handle(
            () => {
                this.status = 'online';
                this.online = true;
                this.connecting = false;
            }
        );
    }

}
