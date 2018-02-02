import { UUID } from '../cache/cache.model';
import { BusTransactionImpl } from '../transaction';
import { StompParser, TransactionReceipt } from '../../index';

export interface TransactionRequest {
    channel: string;
    id: UUID;
    payload: any;
    complete: boolean;
    aborted: boolean;
    startedTime: number;
    completedTime: number;
    abortedTime: number;
}

export class TransactionRequestImpl<T> implements TransactionRequest {
    public channel: string;
    public id: UUID;
    public payload: any;
    public complete: boolean;
    public aborted: boolean;
    public startedTime: number;
    public completedTime: number;
    public abortedTime: number;

    constructor(channel: string, payload: any) {
        this.channel = channel;
        this.id = StompParser.genUUID();
        this.payload = payload;
        this.complete = false;
        this.aborted = false;
    }
}

export class TransactionReceiptImpl implements TransactionReceipt {
    public totalRequests: number;
    public requestsSent: number;
    public requestsCompleted: number;
    public complete: boolean;
    public aborted: boolean;
    public startedTime: number;
    public completedTime: number;
    public abortedTime: number;

    constructor(totalRequests: number) {
        this.totalRequests = totalRequests;
        this.requestsSent = 0;
        this.requestsCompleted = 0;
        this.aborted = false;
        this.complete = false;
    }
}