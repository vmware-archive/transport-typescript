import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventBus, MessageHandler } from '@vmw/bifrost';
import { AbstractBase } from '@vmw/bifrost/core';
import { ChatMessage, GeneralChatChannel } from '../chat-message';
import { ServbotService } from '../../services/servbot/servbot.service';
import { ChatCommand, ServbotResponse } from '../../services/servbot/servbot.model';
import { GeneralUtil } from '@vmw/bifrost/util/util';

@Component({
    selector: 'chat-client',
    templateUrl: './chat-client.component.html',
    styleUrls: ['./chat-client.component.css']
})
export class ChatClientComponent extends AbstractBase implements OnInit, AfterViewChecked {

    @Input() name: string;
    @Input() avatar: string;
    @Input() theme: string;
    @Output() online = new EventEmitter<boolean>();
    @ViewChild('scrollable') private chatContainer: ElementRef;

    private generalChat: MessageHandler;
    public isOnline: boolean = false;
    public status: string = 'offline';

    public id = EventBus.id;
    public chat: string;
    public generalChatMessages: ChatMessage[];

    constructor() {
        super('ChatClient');
        this.generalChatMessages = [];
    }

    ngOnInit() {

        this.generalChat = this.bus.listenStream(GeneralChatChannel);
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
            },
            (error) => {
                console.log('nope...', error);
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

            if (this.chat.startsWith('/')) {
                this.handleChatCommand();
                return;
            }
            const message: ChatMessage = {
                from: this.name,
                avatar: this.avatar,
                body: this.chat,
                time: Date.now(),
                controlEvent: null,
                error: false
            };
            this.chat = '';
            this.bus.sendResponseMessage(GeneralChatChannel, message, EventBus.id);
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

    private handleChatCommand(): void {

        if (this.chat === '/help') {

            this.bus.requestOnceWithId(
                GeneralUtil.genUUID(),
                ServbotService.queryChannel,
                {command: ChatCommand.Help},
                ServbotService.queryChannel,
                EventBus.id
            ).handle(
                (resp: ServbotResponse) => {
                    this.generalChatMessages.push({
                        from: 'servbot',
                        avatar: '🤖',
                        body: resp.body,
                        time: Date.now(),
                        controlEvent: `Servbot: ${resp.body}`,
                        error: false
                    });
                    this.chat = '';
                }
            );
        }

        if (this.chat === '/msg-stats') {

            this.bus.requestOnceWithId(
                GeneralUtil.genUUID(),
                ServbotService.queryChannel,
                {command: ChatCommand.MessageStats}
            ).handle(
                (resp: ServbotResponse) => {
                    this.generalChatMessages.push({
                        from: 'servbot',
                        avatar: '🤖',
                        body: resp.body,
                        time: Date.now(),
                        controlEvent: `Servbot: ${resp.body}`,
                        error: false
                    });
                    this.chat = '';
                }
            );
        }
    }

}
