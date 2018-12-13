import { AbstractBase } from '@vmw/bifrost/core';
import { ServbotOperations } from '@operations/servbot.operations';
import { MessageFunction } from '@vmw/bifrost/bus.api';
import { GeneralError } from '@vmw/bifrost/core/model/error.model';
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
