/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import { StoreStream, MutateStream } from '../../store.api';
import { Subscription, Observable } from 'rxjs';
import { MessageFunction } from '../../bus.api';
import { Logger } from '../../log';

export type UUID = string;
export type StoreType = string;

export class MutationRequestWrapper<T, E = any> {

    value: T;
    errorHandler: MessageFunction<E>;
    successHandler: MessageFunction<T>;

    constructor(value: T,
                successHandler?: MessageFunction<T>,
                errorHandler?: MessageFunction<E>) {
        this.value = value;
        this.successHandler = successHandler;
        this.errorHandler = errorHandler;
    }
}

export class BaseStoreState<T, V> {
    constructor(private changeType: T,
                private objectValue: V) {

    }

    public get type(): T {
        return this.changeType;
    }

    public get value(): V {
        return this.objectValue;
    }

}

export class StoreStateChange<T, V> extends BaseStoreState<T, V> {
    constructor(private objectId: UUID,
                changeType: T,
                objectValue: V) {

        super(changeType, objectValue);
    }

    public get id(): UUID {
        return this.objectId;
    }
}

export class StoreStateMutation<T, V, E = any> extends BaseStoreState<T, V> {
    private pvtErrorHandler: MessageFunction<E>;
    private pvtSuccessHandler: MessageFunction<V>;

    constructor(changeType: T,
                objectValue: V) {
        super(changeType, objectValue);
    }

    public set errorHandler(handler: MessageFunction<E>) {
        this.pvtErrorHandler = handler;
    }

    public get errorHandler(): MessageFunction<E> {
        return this.pvtErrorHandler;
    }

    public set successHandler(handler: MessageFunction<V>) {
        this.pvtSuccessHandler = handler;
    }

    public get successHandler(): MessageFunction<V> {
        return this.pvtSuccessHandler;
    }
}

export class StoreStreamImpl<T, E = any> implements StoreStream<T> {

    protected subscription: Subscription;


    constructor(protected stream: Observable<MutationRequestWrapper<T, E>>, protected log: Logger) {

    }

    subscribe(successHandler: MessageFunction<T>): Subscription {

        this.subscription = this.stream.subscribe(
            (req: MutationRequestWrapper<T, E>) => {
                if (successHandler) {

                    // forward onto subscriber.
                    successHandler(req.value);

                } else {
                    this.log.error('unable to handle cache stream event, no handler provided.', 'StoreStream');
                }
            }
        );

        return this.subscription;
    }

    unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

export class MutateStreamImpl<T, E = any> extends StoreStreamImpl<T> implements MutateStream<T, E> {

    protected mutatorErrorHandler: MessageFunction<E>;
    protected mutatorSuccessHandler: MessageFunction<T>;

    constructor(protected stream: Observable<MutationRequestWrapper<T, E>>, log: Logger) {
        super(stream, log);
    }

    subscribe(successHandler: MessageFunction<T>): Subscription {

        this.subscription = this.stream.subscribe(
            (req: MutationRequestWrapper<T, E>) => {
                if (successHandler) {

                    if (req.errorHandler) {
                        // capture mutator error handler.
                        this.mutatorErrorHandler = req.errorHandler;
                    }

                    if (req.successHandler) {
                        // capture mutator success handler.
                        this.mutatorSuccessHandler = req.successHandler;
                    }

                    // forward onto subscriber.
                    successHandler(req.value);

                } else {
                    this.log.error('unable to handle cache stream event, no handler provided.', 'MutateStream');
                }
            }
        );
        return this.subscription;
    }

    error(error: E): void {
        if (this.mutatorErrorHandler) {
            // push off to the event loop to ensure async exec of mutator logic.
            setTimeout(
                () => this.mutatorErrorHandler(error)
            );
        } else {
            this.log.error('unable to send error event back to mutator, no error handler provided.', 'MutateStream');
        }
    }

    success(success: T): void {
        if (this.mutatorSuccessHandler) {
            // push off to the event loop to ensure async exec of mutator logic.
            setTimeout(
                () => this.mutatorSuccessHandler(success)
            );
        } else {
            this.log.error('unable to send success event back to mutator, ' +
                'no success handler provided.', 'MutateStream');
        }
    }
}
