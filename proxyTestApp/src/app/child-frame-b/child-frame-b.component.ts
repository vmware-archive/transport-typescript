import { Component, OnInit } from '@angular/core';
import { EventBus, MessageHandler } from '@vmw/bifrost';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { LogLevel } from '@vmw/bifrost/log';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';

@Component({
    selector: 'app-child-frame-b',
    templateUrl: './child-frame-b.component.html',
    styleUrls: ['./child-frame-b.component.css']
})
export class ChildFrameBComponent implements OnInit {

    private bus: EventBus;
    public generalChatMessages: string[];
    private generalChat: MessageHandler;
    public id = EventBus.id;

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.bus.api.setLogLevel(LogLevel.Verbose);
        this.bus.api.enableMonitorDump(true);
        this.generalChatMessages = [];
    }

    ngOnInit() {

        this.bus.enableMessageProxy({
            protectedChannels: ['general-chat', 'special-chat'],
            proxyType: ProxyType.Child,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
            targetAllFrames: false,
            targetSpecificFrames: null,
        });

        this.generalChat = this.bus.listenStream('general-chat');
        this.generalChat.handle(
            (message: string) => {
                this.generalChatMessages.push(message);
            }
        );
    }

    public saySomething() {
        this.bus.sendResponseMessage('general-chat', 'Child B: Hi!');
    }

}
