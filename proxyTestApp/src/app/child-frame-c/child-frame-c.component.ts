import { Component, OnInit } from '@angular/core';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';
import { ProxyControl } from '@vmw/bifrost/proxy';
import { AbstractBase } from '@vmw/bifrost/core';
import { GeneralChatChannel } from '../chat-message';
import { ServbotService } from '../../services/servbot/servbot.service';

@Component({
    selector: 'app-child-frame-c',
    templateUrl: './child-frame-c.component.html',
    styleUrls: ['./child-frame-c.component.css']
})
export class ChildFrameCComponent extends AbstractBase implements OnInit {

    private proxyControl: ProxyControl;
    private proxyActive: boolean = false;

    constructor() {
        super('ChildFrameCComponent');
    }

    ngOnInit(): void {

        this.proxyControl = this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, ServbotService.queryChannel],
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
