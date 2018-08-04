import { AbstractService } from '@vmw/bifrost/core';
import { GalacticRequest, GalacticResponse, MessageArgs } from '@vmw/bifrost';
import { RequestType, ServbotRequest, ServbotResponse } from './servbot.model';


export class ServbotService extends AbstractService<ServbotRequest, ServbotResponse>{

    public static channel = 'servbot-query';

    constructor() {
        super('servbot', ServbotService.channel);
        this.log.info("ServBot Online");
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

    }

    protected handleServiceRequest(requestObject: ServbotRequest, requestArgs?: MessageArgs): void {
            switch(requestObject.request) {
                case RequestType.Connect:
                    this.connectService();
                    break;

                case RequestType.UserStats:
                    this.delegate(requestObject);
                    break;
            }

    }

    private delegate(requestObject: ServbotRequest): void {
        //this.makeG
        const req: GalacticRequest<any> = this.buildGalacticRequest(RequestType[requestObject.request], null);
        this.makeGalacticRequest(req, 'servbot', this.handleQueryResponse);
    }

    private handleQueryResponse(response: GalacticResponse<ServbotResponse>): void {
        console.log(`The fucking thing only went and worked! ${response}`);
    }


}
