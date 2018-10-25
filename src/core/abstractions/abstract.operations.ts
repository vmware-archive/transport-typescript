/**
 * Copyright(c) VMware Inc. 2018
 */
import { AbstractBase } from './abstract.base';
import { BusTransaction, ChannelName, MessageFunction, TransactionType } from '../../bus.api';
import { GeneralError } from '../model/error.model';
import { AbstractMessageObject } from './abstract.messageobject';

export abstract class AbstractOperations extends AbstractBase {

    public callService<RequestType, RetPayload>(
        channel: ChannelName,
        request: RequestType,
        successHandler: MessageFunction<RetPayload>,
        errorHandler?: MessageFunction<GeneralError>) {

        const transaction: BusTransaction = this.bus.createTransaction(TransactionType.ASYNC, this.getName());

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