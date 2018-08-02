import { Component, OnInit } from '@angular/core';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { EventBus, MessageHandler } from '@vmw/bifrost';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';
import { LogLevel } from '@vmw/bifrost/log';
import { ToastNotification } from '@vmw/ngx-components';
import { ChatMessage } from '../chat-message';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    private bus: EventBus;
    public generalChatMessages: ChatMessage[];
    private generalChat: MessageHandler;
    public id = EventBus.id;
    public notifications: ToastNotification[];
    public consoleEvents: string[];

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.bus.api.setLogLevel(LogLevel.Verbose);
        this.bus.api.enableMonitorDump(true);
        this.generalChatMessages = [];
        this.consoleEvents = [];
    }

    ngOnInit() {

        this.bus.enableMessageProxy({
            protectedChannels: ['general-chat', 'special-chat'],
            proxyType: ProxyType.Parent,
            parentOrigin: 'http://localhost:4200',
            acceptedOrigins: ['http://localhost:4200'],
            targetAllFrames: true,
            targetSpecificFrames: null,
        });

        this.generalChat = this.bus.listenStream('general-chat');
        this.generalChat.handle(
            (message: ChatMessage) => {
                this.generalChatMessages.push(message);
            }
        );

        this.notifications = [];
    }

    public saySomething() {
        this.bus.sendResponseMessage('general-chat','Parent: Hey Everyone!');
    }

}

