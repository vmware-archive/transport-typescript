/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { AbstractBase } from '@vmw/transport/core';
import { ServbotOperations } from '@operations/servbot.operations';
import { MessageFunction } from '@vmw/transport/bus.api';
import { GeneralError } from '@vmw/transport/core/model/error.model';
import { Mixin } from '@operations/mixin';
import { ChatCommand, ServbotResponse } from '@services/servbot/servbot.model';

@Mixin([ServbotOperations])
export class ServbotBase extends AbstractBase implements ServbotOperations {
    makeServbotRequest: (command: ChatCommand,
                         successHandler: MessageFunction<ServbotResponse>,
                         errorHandler: MessageFunction<GeneralError>) => void;
    listenForServbotOnlineState: (onlineHandler: MessageFunction<boolean>) => void;
    connectServbot: () => void;
}
