/**
 * Copyright(c) VMware Inc. 2018-2019
 */
import {AbstractBase} from './abstract.base';
import { BusTransaction, ChannelName, EventBus, MessageFunction, TransactionType } from '../../bus.api';
import {GeneralError} from '../model/error.model';
import {AbstractMessageObject} from './abstract.messageobject';
import { BusUtil } from '../../util/bus.util';

export abstract class AbstractOperations extends AbstractBase {

    /**
     * Call a service via the event bus
     *
     * @param channel the channel on which the service is listening on
     * @param request the request object you want to send to the service.
     * @param successHandler handle the successful response from the service.
     * @param errorHandler handle any errors that are caught or thrown by the service.
     */
    public callService<RequestType, RetPayload>(
        channel: ChannelName,
        request: RequestType,
        successHandler: MessageFunction<RetPayload>,
        errorHandler?: MessageFunction<GeneralError>) {

        const bus: EventBus = BusUtil.getBusInstance();
        const transaction: BusTransaction = bus.createTransaction(TransactionType.ASYNC, this.getName());

        transaction.onComplete<AbstractMessageObject<RequestType, RetPayload>>(
            (resp: [AbstractMessageObject<RequestType, RetPayload>]) => {
                successHandler(resp[0].payload);
            }
        );

        transaction.onError(
            (error: GeneralError) => {
                if (errorHandler) {
                    errorHandler(error);
                }
            }
        );

        transaction.sendRequest(channel, request);
        transaction.commit();
    }
}
