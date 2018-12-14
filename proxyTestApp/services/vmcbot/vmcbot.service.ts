import { AbstractService } from '@vmw/bifrost/core';
import { EventBus, MessageArgs, MessageHandler } from '@vmw/bifrost/bus.api';
import { VMCBotRequest, VMCBotResponse, VMCCommand } from './vmcbot.model';
import { BaseTask } from '@vmc/vmc-api';
import { ChatMessage, GeneralChatChannel } from '../../src/app/chat-message';
import { Mixin } from '@operations/mixin';
import { ChatOperations } from '@operations/chat.operations';

@Mixin([ChatOperations])
export class VMCBotService extends AbstractService<VMCBotRequest, VMCBotResponse> implements ChatOperations {
    createChatMessage: (from: string, avatar: string, body: any) => ChatMessage;
    createControlMessage: (controlEvent: string, error?: boolean, task?: BaseTask) => ChatMessage;
    publishChatMessage: (message: ChatMessage) => void;

    public static serviceChannel = 'vmcbot';
    public static onlineChannel = 'vmcbot-online';
    public connectionHandler: MessageHandler;

    // hard wired org ID, for demo puposes only.
    private orgId = 'a67ba602-6689-450c-a743-8842ca6b032a';

    public sessionId;

    constructor() {
        super('VMCBot', VMCBotService.serviceChannel);
        this.log.info('VMCBot Service Online');
    }

    private connectService() {

        this.connectionHandler = this.bus.connectBridge(
            (sessionId: string) => {

                this.sessionId = sessionId;
                this.log.info(`VMCBotService connected to broker successfully on bus ${EventBus.id}`);
                this.bus.sendResponseMessage(VMCBotService.onlineChannel, true);

                this.listenToVMCTasks();

                // pubish a chat message to tell everyone we are online.
                this.publishChatMessage(
                    this.createControlMessage('VMCBot is online.')
                );
            },
            '/vmc/ss/nexus/orgs/' + this.orgId,
            '',
            '/queue',
            2,
            'localhost',
            8080
        );
    }

    private listenToVMCTasks() {

        this.bus.listenGalacticStream(`topic/orgs.${this.orgId}.tasks`, this.getName())
            .handle(
                (taskJson: any) => {
                    const task: BaseTask = new BaseTask(taskJson);

                    this.publishChatMessage(
                        this.createControlMessage('task update', false, task)
                    );
                }
            );
    }

    protected handleServiceRequest(requestObject: VMCBotRequest, requestArgs?: MessageArgs): void {

        if (requestObject && requestObject.command) {
            switch (requestObject.command) {

                case VMCCommand.Connect:
                    this.connectService();
                    break;

                default:
                    break;
            }
        } else {
            this.log.warn('Unable to proceed, no valid commands passed.');
        }
    }

}
