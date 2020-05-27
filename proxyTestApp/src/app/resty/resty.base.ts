/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { ChatMessage } from '../chat-message';
import { AbstractBase } from '@vmw/bifrost/core';
import { ChatOperations } from '@operations/chat.operations';
import { Mixin } from '@operations/mixin';
import { BaseTask } from '@vmc/vmc-api';

@Mixin([ChatOperations])
export class RestyBase extends AbstractBase implements ChatOperations {
    createChatMessage: (from: string, avatar: string, body: any) => ChatMessage;
    createControlMessage: (controlEvent: string, error?: boolean, task?: BaseTask) => ChatMessage;
    publishChatMessage: (message: ChatMessage) => void;
}
