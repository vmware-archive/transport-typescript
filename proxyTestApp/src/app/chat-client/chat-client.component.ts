import { Component, Input, OnInit } from '@angular/core';
import { EventBus, MessageHandler } from '@vmw/bifrost';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { ChatMessage } from '../chat-message';
import { ProxyType } from '@vmw/bifrost/proxy/message.proxy';


@Component({
  selector: 'chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.css']
})
export class ChatClientComponent implements OnInit {

    @Input() name: string;
    @Input() avatar: string;
    @Input() theme: string;


    private bus: EventBus;

    public generalChatMessages: string[];
    private generalChat: MessageHandler;
    public id = EventBus.id;
    public chat: string;



    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.generalChatMessages = [];
    }

    ngOnInit() {

        this.bus.enableMessageProxy({
            protectedChannels: ['general-chat'],
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

    public onKey(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            const message: ChatMessage = {
                from: this.name,
                avatar: this.avatar,
                body: this.chat,
                time: Date.now()
            };
            this.chat = '';
            this.bus.sendResponseMessage('general-chat', message);
        }
    }

}
