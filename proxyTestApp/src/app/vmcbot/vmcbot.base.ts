import { AbstractBase } from '@vmw/bifrost/core';
import { MessageFunction } from '@vmw/bifrost';
import { Mixin } from '@operations/mixin';
import { VMCBotOperations } from '@operations/vmcbot.operations';

@Mixin([VMCBotOperations])
export class VMCBotBase extends AbstractBase implements VMCBotOperations {
    connectVMCBot: () => void;
    listenForVMCBotOnlineState: (onlineHandler: MessageFunction<boolean>) => void;
}