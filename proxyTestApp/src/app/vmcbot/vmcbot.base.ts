/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { AbstractBase } from '@vmw/transport/core';
import { MessageFunction } from '@vmw/transport/bus.api';
import { Mixin } from '@operations/mixin';
import { VMCBotOperations } from '@operations/vmcbot.operations';

@Mixin([VMCBotOperations])
export class VMCBotBase extends AbstractBase implements VMCBotOperations {
    connectVMCBot: () => void;
    listenForVMCBotOnlineState: (onlineHandler: MessageFunction<boolean>) => void;
}
