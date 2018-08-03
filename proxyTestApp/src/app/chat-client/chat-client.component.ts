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
    public status: string = 'offline';

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
                if (!this.isOnline) {
                    this.generalChatMessages.push({
                        from: this.name,
                        avatar: this.avatar,
                        body: this.chat,
                        time: Date.now(),
                        controlEvent: 'Your message was not broadcast, you are offline',
                        error: true
                    });
                } else {
                    this.generalChatMessages.push(message);
                }
            }
        );
        this.isOnline = true;
        this.status = 'online';
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
                time: Date.now(),
                controlEvent: null,
                error: false
            };
            this.chat = '';
            this.bus.sendResponseMessage('general-chat', message);
        }
    }

    public goOffline(): void {
        this.isOnline = false;
        this.online.emit(false);
        this.status = 'offline';

        this.generalChatMessages.push({
            from: this.name,
            avatar: this.avatar,
            body: this.chat,
            time: Date.now(),
            controlEvent: 'You are now offline',
            error: false
        });
    }

    public goOnline(): void {
        this.isOnline = true;
        this.online.emit(true);
        this.status = 'online';

        this.generalChatMessages.push({
            from: this.name,
            avatar: this.avatar,
            body: this.chat,
            time: Date.now(),
            controlEvent: 'You are now online',
            error: false
        });
    }

    scrollToBottom(): void {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }

}
