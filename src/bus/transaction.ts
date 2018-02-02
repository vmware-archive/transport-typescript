import { UUID } from './cache/cache.model';
import { MessageFunction } from './model/message.model';
import { BusTransaction } from './bus.api';

/**
 * Copyright(c) VMware Inc. 2016-2017
 */

export interface TransactionRequest {
    channel: string;
    id: UUID;
    //sent
}

export class BusTransactionImpl implements BusTransaction {
    
    //private requests


    public sendRequest(channel: string, payload: any): void {
        throw new Error('Method not implemented.');
    }
    public onComplete<T>(completeHandler: MessageFunction<T>): void {
        throw new Error('Method not implemented.');
    }

    public commit(): void {
        throw new Error('Method not implemented.');
    }

    public onError<T>(errorHandler: MessageFunction<T>): void {
        throw new Error('Not implemented yet.');
    }
}