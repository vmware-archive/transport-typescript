export enum RequestType {
        Connect = 'Connect',
        GetMotd = 'GetMotd',
        MessageStats = 'MessageStats',
        GetJoke = 'GetJoke',
        PostMessage = 'PostMessage'
}

export interface ServbotRequest {
    request: RequestType;
}

export interface ServbotResponse {
    body: string;
}
