export enum ChatCommand {
    Connect = 'Connect',
    GetMotd = 'GetMotd',
    MessageStats = 'MessageStats',
    Help = 'Help',
    GetJoke = 'GetJoke',
    PostMessage = 'PostMessage'
}

export interface ServbotRequest {
    command: ChatCommand;
}

export interface ServbotResponse {
    body: string;
}
