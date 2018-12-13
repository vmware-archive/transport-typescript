import { EventBus, MessageFunction } from '@vmw/bifrost/bus.api';
import { AbstractCore } from '@vmw/bifrost/core';
import { GeneralError } from '@vmw/bifrost/core/model/error.model';
import { GeneralUtil } from '@vmw/bifrost/util/util';
import { ServbotService } from '../services/servbot/servbot.service';
import { ChatCommand, ServbotResponse } from '../services/servbot/servbot.model';

export class ServbotOperations extends AbstractCore {

    constructor() {
        super();
    }

    public makeServbotRequest(command: ChatCommand,
                              successHandler: MessageFunction<ServbotResponse>,
                              errorHandler: MessageFunction<GeneralError>): void {

        this.bus.requestOnceWithId(
            GeneralUtil.genUUID(),
            'servbot-query',
            {command: command},
            'servbot-query',
            EventBus.id
        ).handle(
            (resp: ServbotResponse) => {
               successHandler(resp);
            },
            (error: GeneralError) => {
               errorHandler(error);
            }
        );
    }

    public listenForServbotOnlineState(onlineHandler: MessageFunction<boolean>): void {
        this.bus.listenOnce(ServbotService.onlineChannel).
        handle(
            (online: boolean) => {
                onlineHandler(online);
            }
        );
    }

    public connectServbot(): void {
        this.bus.sendRequestMessage(ServbotService.queryChannel, {command: ChatCommand.Connect}, EventBus.id);
    }

}
