import { EventBus, MessageFunction } from '@vmw/bifrost';
import { AbstractCore } from '@vmw/bifrost/core';
import { VMCBotService } from '@services/vmcbot/vmcbot.service';
import { VMCCommand } from '@services/vmcbot/vmcbot.model';

export class VMCBotOperations extends AbstractCore {

    constructor() {
        super();
    }

    public connectVMCBot(): void {
        this.bus.sendRequestMessage(VMCBotService.serviceChannel, {command:VMCCommand.Connect}, EventBus.id);
    }

    public listenForVMCBotOnlineState(onlineHandler: MessageFunction<boolean>) {
        this.bus.listenOnce(VMCBotService.onlineChannel).handle(
            (online: boolean) => onlineHandler(online)
        );
    }

}