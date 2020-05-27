/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BaseTask } from '../../vmc-models/api/vmc-api';

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
