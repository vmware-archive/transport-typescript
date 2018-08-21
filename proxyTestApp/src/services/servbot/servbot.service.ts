import { AbstractService } from '@vmw/bifrost/core';
import { BusStore, EventBus, MessageArgs } from '@vmw/bifrost';
import { ChatCommand, ServbotRequest, ServbotResponse } from './servbot.model';
import { ChatMessage, GeneralChatChannel } from '../../app/chat-message';
import { APIResponse } from '@vmw/bifrost/core/model/response.model';
import { RestOperation } from '@vmw/bifrost/core/services/rest/rest.operations';
import { HttpRequest } from '@vmw/bifrost/core/services/rest/rest.model';
import { GeneralError } from '@vmw/bifrost/core/model/error.model';
import { Joke } from './joke.model';

export class ServbotService extends AbstractService<ServbotRequest, ServbotResponse> {

    public static queryChannel = 'servbot-query';
    public static onlineChannel = 'servbot-online';
    public static serviceChannel = 'servbot';

    private restyState: boolean = false;
    private restyStateStore: BusStore<boolean>;


    constructor() {
        super('ServBot', ServbotService.queryChannel);
        this.log.info("ServBot Service Online");
        this.restyState = false;
    }


    private connectService() {

        // get resty state store.
        this.restyStateStore = this.storeManager.getStore('resty');

        this.bus.connectBridge(
            () => {
                this.log.info(`ServBotService connected to broker successfully on bus ${EventBus.id}`);
                this.bus.sendResponseMessage(ServbotService.onlineChannel, true);
            },
            '/bifrost',
            '/topic',
            '/queue',
            1,
            'localhost',
            8090,
            '/pub'
        );

        // listen to general chat and relay to servbot.
        this.listenToChat();

        // Detect when old man resty wakes up, and goes to sleep, so we know to delegate to him.
        this.restyStateStore.onChange('state', 'online').subscribe(
            (online: boolean) => {
                this.restyStateChange(online);

                if (online) {
                    this.bus.sendResponseMessage(GeneralChatChannel,
                        {
                            from: null,
                            avatar: null,
                            body: null,
                            time: Date.now(),
                            controlEvent: `Servbot: Resty demands we use REST. Booo!`,
                            error: false,
                            task: null
                        }
                    );
                } else {
                    this.bus.sendResponseMessage(GeneralChatChannel,
                        {
                            from: null,
                            avatar: null,
                            body: null,
                            time: Date.now(),
                            controlEvent: `Servbot: Resty is offline, back to the bus for API transport.`,
                            error: false,
                            task: null
                        }
                    );
                }
            }
        );
    }

    private restyStateChange(state: boolean) {
        this.log.info(`Old man resty has woken up... I need to delegate to the Rest Service.`)
        this.restyState = state;
    }

    protected handleServiceRequest(requestObject: ServbotRequest, requestArgs?: MessageArgs): void {

        if (requestObject && requestObject.command) {
            switch (requestObject.command) {

                case ChatCommand.Connect:
                    this.connectService();
                    break;

                default:
                    this.delegate(requestObject, requestArgs);
                    break;
            }
        } else {
            this.log.warn('Unable to proceed, no valid commands passed.')
        }
    }

    private delegate(requestObject: ServbotRequest, args?: MessageArgs): void {

        // if old man resty has woken up, he will want his requests handled over rest, so we can delegate
        // over to the rest service. If he's asleep, then we can handle requests via the distributed bus.

        if (!this.restyState) {

            this.makeGalacticRequest(
                this.buildAPIRequest(ChatCommand[requestObject.command], null),
                ServbotService.serviceChannel,
                this.handleQueryResponse.bind(this));

        } else {

            this.log.debug('Resty is awake, firing command over REST via XHR');

            let successHandler = (response: APIResponse<Joke>) => {
                this.postResponse(ServbotService.queryChannel, {body: response.payload});
            };

            let errorHandler = (response: any) => {
                //let fo: TangoHttpError;
                let error: GeneralError;
                // if(response instanceof TangoHttpError) {
                //     let te = response as TangoHttpError;
                //     error = new GeneralError(te.message);
                //
                // } else{
                    error = new GeneralError('Error with REST Request');
                //}
                error.errorObject = response;
                // convert response into a general error.

                this.postError(ServbotService.queryChannel, error, args);
            };

            const restOperation: RestOperation = {
                uri: `/servbot/${requestObject.command}`,
                method: HttpRequest.Get,
                successHandler: successHandler,
                errorHandler: errorHandler
            };

            this.restServiceRequest(restOperation, this.getName());

        }
    }

    private handleQueryResponse(response: APIResponse<any>): void {
        this.postResponse(ServbotService.queryChannel, {body: response})
    }

    private listenToChat() {
        this.bus.listenStream(GeneralChatChannel).handle(
            (chatMessage: ChatMessage) => {
                const payload = this.buildAPIRequest(ChatCommand[ChatCommand.PostMessage], chatMessage)
                this.bus.sendGalacticMessage(ServbotService.serviceChannel, payload, this.getName())
            }
        );

        // tell everyone that servbot is online!
        this.bus.sendResponseMessage<ChatMessage>(GeneralChatChannel,
            {
                from: this.getName(),
                avatar: '🤖',
                body: 'Type /help to see a list of commands',
                time: Date.now(),
                controlEvent: null,
                error: false,
                task: null

            })
    }

}
