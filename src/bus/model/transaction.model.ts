import { UUID, StoreType } from '../store/store.model';
import { StompParser } from '../../bridge/stomp.parser';
import { TransactionReceipt } from '../../bus.api';

export interface TransactionRequest {
    channel: string;
    id: UUID;
    payload: any;
    complete: boolean;
    aborted: boolean;
    startedTime: Date;
    completedTime: Date;
    abortedTime: Date;
    nextRequest: TransactionRequest;
    store: StoreType;
}

export class TransactionRequestImpl<T> implements TransactionRequest {
    public channel: string;
    public id: UUID;
    public payload: any;
    public complete: boolean;
    public aborted: boolean;
    public startedTime: Date;
    public completedTime: Date;
    public abortedTime: Date;
    public nextRequest: TransactionRequest;
    public store: StoreType;

    constructor(channel?: string, payload?: any, store?: StoreType) {
        this.channel = channel;
        this.id = StompParser.genUUID();
        this.payload = payload;
        this.complete = false;
        this.aborted = false;
        this.store = store;
    }
}

export class TransactionReceiptImpl implements TransactionReceipt {
    public totalRequests: number;
    public requestsSent: number;
    public requestsCompleted: number;
    public complete: boolean;
    public aborted: boolean;
    public startedTime: Date;
    public completedTime: Date;
    public abortedTime: Date;
    public id: UUID;

    constructor(totalRequests: number, id: UUID) {
        this.totalRequests = totalRequests;
        this.requestsSent = 0;
        this.requestsCompleted = 0;
        this.aborted = false;
        this.complete = false;
        this.id = id;
    }
}
