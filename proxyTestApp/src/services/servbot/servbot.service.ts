import { AbstractService } from '@vmw/bifrost/core';
import { GalacticResponse, MessageArgs } from '@vmw/bifrost';
import { RequestType, ServbotRequest, ServbotResponse } from './servbot.model';
import { ChatMessage, GeneralChatChannel } from '../../app/chat-message';


export class ServbotService extends AbstractService<ServbotRequest, ServbotResponse> {

    public static queryChannel = 'servbot-query';
    public static serviceChannel = 'servbot';

    constructor() {
        super('ServBot Service', ServbotService.queryChannel);
        this.log.info("ServBot Service Online");
    }

    private connectService() {

        this.bus.connectBridge(
            () => {
                this.log.info("ServBotService connected to broker successfully");
            },
            '/bifrost',
            '/topic',
            '/queue',
            1,
            'localhost',
            8080,
            '/pub'
        );

        // listen to general chat and relay to servbot.
        this.listenToChat();

    }

    protected handleServiceRequest(requestObject: ServbotRequest, requestArgs?: MessageArgs): void {
        switch (requestObject.request) {
            case RequestType.Connect:
                this.connectService();
                break;

            default:
                this.delegate(requestObject);
                break;
        }

    }

    private delegate(requestObject: ServbotRequest): void {
        this.makeGalacticRequest(
            this.buildGalacticRequest(RequestType[requestObject.request], null),
            ServbotService.serviceChannel,
            this.handleQueryResponse.bind(this));
    }

    private handleQueryResponse(response: GalacticResponse<string>): void {
        this.postResponse(ServbotService.queryChannel, {body: response[0]})
    }

    private listenToChat() {
        this.bus.listenStream(GeneralChatChannel).handle(
            (chatMessage: ChatMessage) => {
                const payload = this.buildGalacticRequest(RequestType[RequestType.PostMessage], chatMessage)
                this.bus.sendGalacticMessage(ServbotService.serviceChannel, payload, this.getName())
            }
        );
    }

}
