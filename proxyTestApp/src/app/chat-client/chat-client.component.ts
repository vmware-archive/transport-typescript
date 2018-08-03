import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventBus, MessageHandler } from '@vmw/bifrost';
import { BusUtil } from '@vmw/bifrost/util/bus.util';
import { ChatMessage } from '../chat-message';


@Component({
  selector: 'chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.css']
})
export class ChatClientComponent implements OnInit, AfterViewChecked {

    @Input() name: string;
    @Input() avatar: string;
    @Input() theme: string;
    @Output() online = new EventEmitter<boolean>();
    @ViewChild('scrollable') private chatContainer: ElementRef;

    private bus: EventBus;
    private generalChat: MessageHandler;
    public isOnline: boolean = false;

    public id = EventBus.id;
    public chat: string;
    public generalChatMessages: ChatMessage[];

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.generalChatMessages = [];
    }

    ngOnInit() {

        this.generalChat = this.bus.listenStream('general-chat');
        this.generalChat.handle(
            (message: ChatMessage) => {
                this.generalChatMessages.push(message);
            }
        );
        this.isOnline = true;
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
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

    public goOffline(): void {
        this.isOnline = false;
        this.online.emit(false);
    }

    public goOnline(): void {
        this.isOnline = true;
        this.online.emit(true);
    }

    scrollToBottom(): void {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }

}
