export interface ChatMessage {
    from: string;
    avatar: string;
    body: string;
    time: any;
    controlEvent: string;
    error: boolean;
}

export const GeneralChatChannel = 'general-chat';
