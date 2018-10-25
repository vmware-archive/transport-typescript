import { Component, OnInit } from '@angular/core';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';
import { ProxyControl } from '@vmw/bifrost/proxy';
import { AbstractBase } from '@vmw/bifrost/core';
import { GeneralChatChannel } from '../chat-message';

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
            protectedChannels: [GeneralChatChannel, 'servbot-query'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4300',
            acceptedOrigins: [
                'http://localhost:8070',
                'http://localhost:4400',
                'http://localhost:4300',
                'http://localhost:4200',
                'http://10.126.88.213:8070',
                'http://ngx.eng.vmware.com',
                'http://ngx-components.eng.vmware.com'
            ],
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
