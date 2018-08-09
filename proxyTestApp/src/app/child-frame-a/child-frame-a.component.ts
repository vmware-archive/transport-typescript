import { Component, OnInit } from '@angular/core';
import { ProxyControl, ProxyType } from '@vmw/bifrost/proxy';
import { AbstractBase } from '@vmw/bifrost/core';
import { GeneralChatChannel } from '../chat-message';
import { ServbotService } from '../../services/servbot/servbot.service';

@Component({
    selector: 'app-child-frame-a',
    templateUrl: './child-frame-a.component.html',
    styleUrls: ['./child-frame-a.component.css']
})
export class ChildFrameAComponent extends AbstractBase implements OnInit {

    private proxyControl: ProxyControl;
    private proxyActive: boolean = false;

    constructor() {
        super('ChildFrameAComponent');
    }

    ngOnInit(): void {

        this.proxyControl = this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, ServbotService.queryChannel],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4300',
            acceptedOrigins: ['http://localhost:4300'],
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
