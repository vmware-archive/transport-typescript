export enum VMCCommand {
    Connect = 'Connect'
}

export interface VMCBotRequest {
    command: VMCCommand;
}

export interface VMCBotResponse {
    body: any;
}
