export enum RequestType {
        Connect = 'Connect',
        UserStats = 'UserStats',
        GetMotd = 'GetMotd',
        MessageStats = 'MessageStats',
        GetJoke = 'GetJoke'
}

export interface ServbotRequest {
    request: RequestType;
}

export interface ServbotResponse {
    originalRequest: ServbotRequest;
    body: string;
}
