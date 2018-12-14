/**
 * Copyright(c) VMware Inc. 2018
 */
import { EventBus } from '@vmw/bifrost/bus.api';
import { AbstractCore } from '@vmw/bifrost/core';
import { BaseTask } from '@vmc/vmc-api';
import { ChatMessage, GeneralChatChannel } from '../chat-message';


export class ChatOperations extends AbstractCore {

    constructor() {
        super();
    }

    public createChatMessage(from: string, avatar: string, body: any): ChatMessage {
        return {
            from: from,
            avatar: avatar,
            body: body,
            time: Date.now(),
            controlEvent: null,
            error: false,
            task: null
        };
    }

    public createControlMessage(controlEvent: string, error?: boolean, task?: BaseTask): ChatMessage {
        return {
            from: null,
            avatar: null,
            body: null,
            time: Date.now(),
            controlEvent: controlEvent,
            error: error,
            task: task
        };
    }

    public publishChatMessage(message: ChatMessage): void {
        this.bus.sendResponseMessage(GeneralChatChannel, message, EventBus.id);
    }
}
