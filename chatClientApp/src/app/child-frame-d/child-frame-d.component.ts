import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { ProxyControl } from '@vmw/bifrost/proxy';
import { GeneralChatChannel } from '../chat-message';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';

@Component({
    selector: 'app-child-frame-d',
    templateUrl: './child-frame-d.component.html',
    styleUrls: ['./child-frame-d.component.css']
})
export class ChildFrameDComponent extends AbstractBase implements OnInit {

    private proxyControl: ProxyControl;
    private proxyActive: boolean = false;

    constructor() {
        super('ChildFrameDComponent');
    }

    ngOnInit(): void {

        this.proxyControl = this.bus.enableMessageProxy({
            protectedChannels: [GeneralChatChannel, 'servbot-query'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4300',
            acceptedOrigins: ['http://localhost:4300', 'http://localhost:4400'],
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
