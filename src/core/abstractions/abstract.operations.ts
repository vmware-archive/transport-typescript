/*
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
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
        successHandler: MessageFunction<RetPayload | RetPayload[]>,
        errorHandler?: MessageFunction<GeneralError>) {

        const bus: EventBus = BusUtil.getBusInstance();
        const transaction: BusTransaction = bus.createTransaction(TransactionType.ASYNC, this.getName());
        const execContext: any = bus.api.ngZone() ?? { run: (fn: () => void) => fn() };

        if (bus.fabric.isXsrfTokenEnabled()) {
            (request as any)['headers'] = {
                ...(request as any)['headers'],
                [bus.fabric.getXsrfTokenStoreKey()]: bus.fabric.getXsrfToken()
            };
        }

        transaction.onComplete<AbstractMessageObject<RequestType, RetPayload>>(
            (responses: AbstractMessageObject<RequestType, RetPayload>[]) => {
                const transactionResults = responses.map(response => response.payload);
                execContext.run(() => successHandler(transactionResults.length === 1 ? transactionResults[0] : transactionResults));
            }
        );

        transaction.onError(
            (error: GeneralError) => {
                if (errorHandler) {
                    execContext.run(() => errorHandler(error));
                }
            }
        );

        transaction.sendRequest(channel, request);
        transaction.commit();
    }
}
