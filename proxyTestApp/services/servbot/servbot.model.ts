/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export enum ChatCommand {
    Connect = 'Connect',
    Motd = 'Motd',
    MessageStats = 'MessageStats',
    Help = 'Help',
    Joke = 'Joke',
    PostMessage = 'PostMessage'
}

export interface ServbotRequest {
    command: ChatCommand;
}

export interface ServbotResponse {
    body: any;
}
