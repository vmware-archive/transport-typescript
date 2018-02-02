import { UUID } from './cache/cache.model';
import { MessageFunction, Message } from './model/message.model';
import { BusTransaction, TransactionReceipt, TransactionType, EventBus } from './bus.api';
import { TransactionRequest, TransactionRequestImpl, TransactionReceiptImpl } from './model/transaction.model';
import { StompParser } from '../index';
import { LoggerService } from '../log/index';
import { MessageBusEnabled } from './messagebus.service';

/**
 * Copyright(c) VMware Inc. 2016-2018
 */

export class BusTransactionImpl implements BusTransaction {
    
    private requests: Array<TransactionRequest>;
    private transactionType: TransactionType;
    private transactionCompleted: boolean;
    private transactionReceipt: TransactionReceipt;
    private transactionSession: any;
    private bus: EventBus;
    private name: string;
    private completedHandler: any;
    private log: LoggerService;
    private id: UUID;

    constructor(
            bus: EventBus,
            logger: LoggerService, 
            transactionType: TransactionType = TransactionType.ASYNC,
            name: string = 'BusTransaction'
        ) {
        this.bus = bus;
        this.log = logger;
        this.transactionType = transactionType;
        this.transactionCompleted = false;
        this.requests = [];
        this.name = name;
        this.id = StompParser.genUUID();
        this.log.info('🏦 Transaction Created: ' + this.id, this.name);
    }

    //private requests
    public sendRequest<Req>(channel: string, payload: Req): void {
        const req: TransactionRequest = new TransactionRequestImpl<Req>(channel, payload);
        this.requests.push(req);
        this.log.info('⏳ Transaction [' + this.id + '] Request Queued: [' + req.id + ']', this.name);
    }
    public onComplete<Resp>(completeHandler: MessageFunction<Resp[]>): void {
        this.log.info('⌛ Transaction [' + this.id + '] Complete', this.name);
        this.completedHandler = completeHandler;
    }

    public commit(): TransactionReceipt {
        
        if (this.requests.length <= 0) {
            throw new Error('Transaction cannot be committed, no requests made.');
        }
        
        if (this.transactionCompleted) {
            throw new Error('Transaction has already been completed, cannot recommit.');
        }

        this.transactionReceipt = new TransactionReceiptImpl(this.requests.length);
        switch (this.transactionType) {

            case TransactionType.ASYNC:
                this.startAsyncTransaction();
                break;
            
            case TransactionType.SYNC:
                this.startSyncTransaction();
                break;
            
            default:
                break;
        }

        return this.transactionReceipt;
    }

    public onError<T>(errorHandler: MessageFunction<T>): void {
        throw new Error('Not implemented yet.');
    }

    // private createAsyncListener(): void {



    // }

    private sendRequestAndListen(request: TransactionRequest, doThing: any) {
        //let returnChan = request.channel + '-tran-' + StompParser.genUUIDShort();
        /*sendChannel: ChannelName, requestPayload: T, returnChannel?: ChannelName,
                               from?: SentFrom, schema?: any): MessageHandler<R>;
                               */
        this.log.info('🎬 Sending Request Async Transaction [' + this.id + ']', this.name);
        const handler = this.bus.requestOnce(request.channel, request.payload, this.name);
        handler.handle(
            (response: any) => {
                this.log.info('🎬 Sending Request Async Transaction [' + this.id + ']', this.name);
                doThing(request.id, response);
            }
        ); 

    }


    private startAsyncTransaction(): void {
        this.log.info('🎬 Starting Async Transaction [' + this.id + ']', this.name);
        let responses = new Array<any>();
        const requestList: Array<TransactionRequest> = this.requests.slice();
        let counter: number = 0;
        let thingy = (id: UUID, response: any) => {
            console.log('got back and ID ' + id + ' and something', response);
            counter++;
            responses.push(response);
            if (counter >= this.requests.length) {
                this.completedHandler(responses);
                return;
            }
        };

        requestList.forEach(
            (request: TransactionRequest) => {
                this.sendRequestAndListen(request, thingy);
            }
        );


        // const session = {
        //         complete: false,
        //         requestsPending: this.requests.slice(),
        //         requestsCompleted: [],


        // };



        // do nothing;

    }

    private startSyncTransaction(): void {
        // do nothing;
        
    }
}