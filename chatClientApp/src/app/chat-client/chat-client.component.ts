import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventBus, MessageHandler } from '@vmw/bifrost/bus.api';
import { ChatMessage, GeneralChatChannel } from '../chat-message';
import { BaseTask } from '@vmc/vmc-api';
import { GeneralError } from '@vmw/bifrost/core/model/error.model';
import { ChatCommand, ServbotResponse } from '../servbot.model';
import { ChatClientBase } from './chat-client.base';

@Component({
    selector: 'chat-client',
    templateUrl: './chat-client.component.html',
    styleUrls: ['./chat-client.component.css']
})
export class ChatClientComponent extends ChatClientBase implements OnInit, AfterViewChecked {

    @Input() name: string;
    @Input() avatar: string;
    @Input() theme: string;
    @Output() online = new EventEmitter<boolean>();
    @ViewChild('scrollable') private chatContainer: ElementRef;

    private generalChat: MessageHandler;
    public isOnline = false;
    public status = 'offline';

    public id = EventBus.id;
    public chat: string;
    public generalChatMessages: ChatMessage[];
    public task: BaseTask;

    constructor() {
        super('ChatClient');
        this.generalChatMessages = [];
    }

    private addChatMessage(message: ChatMessage): void {
        this.generalChatMessages.push(message);
    }

    ngOnInit() {

        this.generalChat = this.bus.listenStream(GeneralChatChannel);
        this.generalChat.handle(
            (message: ChatMessage) => {
                if (!this.isOnline) {
                    this.addChatMessage(
                        this.createControlMessage(
                            'Your message was not broadcast, you are offline', true)
                    );

                } else {
                    if (message.task) {
                        this.task = message.task;
                    } else {
                        this.addChatMessage(message);
                    }
                }
            },
            (error) => {
                console.log('something went wrong: ', error);
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

            const message = this.createChatMessage(this.name, this.avatar, this.chat);
            this.chat = '';
            this.publishChatMessage(message);
        }
    }

    public goOffline(): void {
        this.isOnline = false;
        this.online.emit(false);
        this.status = 'offline';

        this.addChatMessage(this.createControlMessage('You are now offline', false));
    }

    public goOnline(): void {
        this.isOnline = true;
        this.online.emit(true);
        this.status = 'online';

        this.addChatMessage(this.createControlMessage('You are now online', false));
    }

    scrollToBottom(): void {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }

    private handleChatCommand(): void {

        if (this.chat.startsWith('/')) {

            let commandString = this.chat.replace('/', '');
            commandString = commandString.charAt(0).toUpperCase() + commandString.slice(1);

            const command: ChatCommand = ChatCommand[commandString];

            if (command) {

                this.makeServbotRequest(command,
                    (resp: ServbotResponse) => {
                        this.addChatMessage(this.createControlMessage(`Servbot: ${resp.body}`));
                    },
                    (error: GeneralError) => {
                        this.addChatMessage(
                            this.createControlMessage(
                                `${error.message}: '${error.errorObject.error}' (${error.errorObject.status}) - ${error.errorObject.path}`, true
                            )
                        );
                    }
                );
            } else {

                this.addChatMessage(
                    this.createControlMessage(
                        `Bad command '${commandString.toLowerCase()}'`, true
                    )
                );
            }
            this.chat = '';
        }
    }

}
