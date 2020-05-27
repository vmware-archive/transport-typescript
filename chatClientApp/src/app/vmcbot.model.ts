/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export enum VMCCommand {
    Connect = 'Connect'
}

export interface VMCBotRequest {
    command: VMCCommand;
}

export interface VMCBotResponse {
    body: any;
}
