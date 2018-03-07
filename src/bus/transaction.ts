import { UUID } from './cache/cache.model';
import { MessageFunction, Message } from './model/message.model';
import { BusTransaction, TransactionReceipt, TransactionType, EventBus, ChannelName } from './bus.api';
import { TransactionRequest, TransactionRequestImpl, TransactionReceiptImpl } from './model/transaction.model';
import { StompParser } from '../index';
import { LoggerService } from '../log/index';
import { MessageBusEnabled } from './messagebus.service';
import { Syslog } from '../log/syslog';
import { Observable } from 'rxjs/Observable';

/**
 * Copyright(c) VMware Inc. 2016-2018
 */

export class BusTransactionImpl implements BusTransaction {
    
    private requests: Array<TransactionRequest>;
    private transactionType: TransactionType;
    private transactionReceipt: TransactionReceipt;
    private transactionSession: any;
    private bus: EventBus;
    private name: string;
    private completedHandler: any;
    private log: LoggerService;
    private id: UUID;
    private transactionErrorChannel: ChannelName;
    private completed: boolean = false;
    private transactionCompleteError: Error =  null;

    constructor(
            bus: EventBus,
            logger: LoggerService, 
            transactionType: TransactionType = TransactionType.ASYNC,
            name: string = 'BusTransaction'
        ) {
        this.bus = bus;
        this.log = logger;
        this.transactionType = transactionType;
        this.requests = [];
        this.name = name;
        this.id = StompParser.genUUID();
        this.transactionErrorChannel = 'transaction-' + this.id + '-errors';
        this.log.info('🏦 Transaction Created', this.transactionName());
    }

    //private requests
    public sendRequest<Req>(channel: string, payload: Req): void {
      
        if (this.completed) {
            this.transactionCompletedMessage('cannot queue a new request via sendRequest()');
            throw this.transactionCompleteError;
        }
        const req: TransactionRequest = new TransactionRequestImpl<Req>(channel, payload);
        this.requests.push(req);
        this.log.info('⏳ Transaction [' + this.id + '] Request Queued: [' + req.id + ']', this.name);
    }
    public onComplete<Resp>(completeHandler: MessageFunction<Resp[]>): void {
       
        if (this.completed) {
            this.transactionCompletedMessage('cannot register onComplete() handler');
            throw this.transactionCompleteError;
        }
        this.log.info('👋 Transaction Complete Handler Registered', this.transactionName());
        this.completedHandler = completeHandler;
    }

    public commit(): TransactionReceipt {
       
        if (this.completed) {
            this.transactionCompletedMessage('cannot re-commit transaction via commit()');
            throw this.transactionCompleteError;
        }
        
        if (this.requests.length <= 0) {
            throw new Error('Transaction cannot be committed, no requests made.');
        }
        
        this.transactionReceipt = new TransactionReceiptImpl(this.requests.length, this.id);
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
        if (this.completed) {
            this.transactionCompletedMessage('cannot register new error handler via onError()');
            throw this.transactionCompleteError;
        }
        this.bus.listenOnce(this.transactionErrorChannel)
            .handle(
                (error: any) => {
                    this.log.error('Transaction [' + this.id + ']', error);
                    errorHandler(error);
                }
            );
    }

    private sendRequestAndListen(request: TransactionRequest, responseHandler: Function) {
       
        this.log.info('➡️ Sending Request Async Transaction to channel: ' + request.channel, this.transactionName());
        const handler = this.bus.listenOnce(request.channel, this.name);
        handler.handle(
            (response: any) => {
                this.log.info('⬅️ Async Transaction Response on channel: ' + request.channel, this.transactionName());
                responseHandler(response);
            }, 
            (error: any) => {
                
                // send to onError handler.
                this.bus.sendResponseMessage(this.transactionErrorChannel, error);
            }
        ); 
        this.bus.sendRequestMessage(request.channel, request.payload);
    }

    private startAsyncTransaction(): void {
     
        this.log.info('🎬 Starting Async Transaction', this.transactionName());
        let responses = new Array<any>();
        const requestList: Array<TransactionRequest> = this.requests.slice();
        let counter: number = 0;
        
        // create async response handler.
        const responseHandler = (response: any) => {
            counter++;
            responses.push(response);
            this.transactionReceipt.requestsCompleted++;
            if (counter >= this.requests.length) {
                this.transactionReceipt.complete = true;
                this.transactionReceipt.completedTime = new Date();
                this.transactionCompleted();
                this.completedHandler(responses);
                return;
            }
        };

        // started transaction
        this.transactionReceipt.startedTime = new Date();
        
        requestList.forEach(
            (request: TransactionRequest) => {
                this.sendRequestAndListen(request, responseHandler);
                this.transactionReceipt.requestsSent++;
            }
        );

    }

    private transactionName(): string {
        return this.name + '.' + this.id;
    }

    private startSyncTransaction(): void {
        
        this.log.info('🎬 Starting Sync Transaction', this.transactionName());
        let responses = new Array<any>();
        const requestList: Array<TransactionRequest> = this.requests.slice();
        let counter: number = 0;
        
        const requestStream: Observable<TransactionRequest[]> = Observable.of(requestList);
        for (let x = 0; x < requestList.length; x++) {
            if (x >= 0 && x < requestList.length ) {
                requestList[x].nextRequest = requestList[x + 1];
            }
        }
        console.log(requestList);

        // pick up here tomorrow.
        const responseHandler = (response: any) => {
                counter++;
                responses.push(response);
                this.transactionReceipt.requestsCompleted++;
                if (counter >= this.requests.length) {
                    // this.transactionReceipt.complete = true;
                    // this.transactionReceipt.completedTime = new Date();
                    // this.transactionCompleted();
                    // this.completedHandler(responses);
                    // return;
                }
        };


        this.sendRequestAndListen(requestList[0], responseHandler);



        // // create async response handler.
        // const responseHandler = (response: any) => {
        //     counter++;
        //     responses.push(response);
        //     this.transactionReceipt.requestsCompleted++;
        //     if (counter >= this.requests.length) {
        //         this.transactionReceipt.complete = true;
        //         this.transactionReceipt.completedTime = new Date();
        //         this.transactionCompleted();
        //         this.completedHandler(responses);
        //         return;
        //     }
        // };

        // started transaction
        //this.transactionReceipt.startedTime = new Date();
        
        requestStream.subscribe(
            (req: TransactionRequest[]) => {
                console.log('Yep we got a request', req);
            }
        );



        
    }

    private transactionCompleted(): void {
        this.completed = true;
        this.transactionCompleteError = new Error('transaction ' + this.id + ' has already completed');
        this.log.info('🎉 Transaction Completed', this.transactionName());
    }

    private transactionCompletedMessage(msg: string): void {
        this.log.warn('Transaction Complete: ' + msg, this.transactionName());
    }
 }