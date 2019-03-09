import { AbstractService } from '@vmw/bifrost/core';
import { EventBus, MessageArgs } from '@vmw/bifrost/bus.api';
import { BusStore } from '@vmw/bifrost/store.api';
import { ChatCommand, ServbotRequest, ServbotResponse } from './servbot.model';
import { ChatMessage, GeneralChatChannel } from '../../src/app/chat-message';
import { APIResponse } from '@vmw/bifrost/core/model/response.model';
import { RestOperation } from '@vmw/bifrost/core/services/rest/rest.operations';
import { HttpRequest } from '@vmw/bifrost/core/services/rest/rest.model';
import { GeneralError } from '@vmw/bifrost/core/model/error.model';
import { Joke } from './joke.model';
import { Mixin } from '@operations/mixin';
import { ChatOperations } from '@operations/chat.operations';
import { BaseTask } from '@vmc/vmc-api';

@Mixin([ChatOperations])
export class ServbotService extends AbstractService<ServbotRequest, ServbotResponse> implements ChatOperations {
  createChatMessage: (from: string, avatar: string, body: any) => ChatMessage;
  createControlMessage: (controlEvent: string, error?: boolean, task?: BaseTask) => ChatMessage;
  publishChatMessage: (message: ChatMessage) => void;

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
      '/fabric',
      '/topic',
      '/queue',
      1,
      'localhost',
      8090,
      '/pub',
      '',
      '',
      false
    );

    // listen to general chat and relay to servbot.
    this.listenToChat();

    // Detect when old man resty wakes up, and goes to sleep, so we know to delegate to him.
    this.restyStateStore.onChange('state', 'online').subscribe(
      (online: boolean) => {
        this.restyStateChange(online);

        if (online) {
          this.publishChatMessage(
            this.createControlMessage(`Servbot: Resty demands we use REST. Booo!`)
          );
        } else {

          this.publishChatMessage(
            this.createControlMessage(`Servbot: Resty is offline, back to the bus for API transport.`)
          );
        }
      }
    );
  }

  private restyStateChange(state: boolean) {
    this.log.info(`Old man resty has woken up... I need to delegate to the Rest Service.`);
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
        let error: GeneralError;
        error = new GeneralError(response.message); // TangoError.
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

      this.restServiceRequest(restOperation);

    }
  }

  private handleQueryResponse(response: APIResponse<any>): void {
    this.postResponse(ServbotService.queryChannel, {body: response})
  }

  // everything said on 'generat-chat' is broadcast to servbot, it keeps a log.
  private listenToChat() {
    this.bus.listenStream(GeneralChatChannel).handle(
      (chatMessage: ChatMessage) => {
        const payload = this.buildAPIRequest(ChatCommand[ChatCommand.PostMessage], chatMessage);
        this.bus.sendGalacticMessage(ServbotService.serviceChannel, payload, this.getName())
      }
    );

    // tell everyone that servbot is online!
    this.publishChatMessage(
      this.createChatMessage(
        this.getName(), '🤖', 'Type /help to see a list of commands')
    );
  }
}
