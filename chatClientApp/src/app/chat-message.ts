import { BaseTask } from '@vmc/vmc-api';

export interface ChatMessage {
    from: string;
    avatar: string;
    body: string;
    time: any;
    controlEvent: string;
    error: boolean;
    task: BaseTask;
}

export const GeneralChatChannel = 'general-chat';
