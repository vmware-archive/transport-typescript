import { CacheStream, MutateStream } from './cache.api';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MessageFunction } from '../message.model';
import { Syslog } from '../../log/syslog';

export type UUID = string;
export type CacheType = string;

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

export class BaseCacheState<T, V> {
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

export class CacheStateChange<T, V> extends BaseCacheState<T, V> {
    constructor(private objectId: UUID,
                changeType: T,
                objectValue: V) {

        super(changeType, objectValue);
    }

    public get id(): UUID {
        return this.objectId;
    }
}

export class CacheStateMutation<T, V, E = any> extends BaseCacheState<T, V> {
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

export class CacheStreamImpl<T, E = any> implements CacheStream<T> {

    protected subscription: Subscription;


    constructor(protected stream: Observable<MutationRequestWrapper<T, E>>) {

    }

    subscribe(successHandler: MessageFunction<T>, errorHandler?: MessageFunction<E>): Subscription {

        this.subscription = this.stream.subscribe(
            (req: MutationRequestWrapper<T, E>) => {
                if (successHandler) {

                    // forward onto subscriber.
                    successHandler(req.value);

                } else {
                    Syslog.error('unable to handle cache stream event, no handler provided.');
                }
            },
            (error: any) => {
                if (errorHandler) {
                    errorHandler(error);
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

export class MutateStreamImpl<T, E = any> extends CacheStreamImpl<T> implements MutateStream<T, E> {

    protected mutatorErrorHandler: MessageFunction<E>;
    protected mutatorSuccessHandler: MessageFunction<T>;

    constructor(protected stream: Observable<MutationRequestWrapper<T, E>>) {
        super(stream);
    }

    subscribe(successHandler: MessageFunction<T>, errorHandler?: MessageFunction<E>): Subscription {

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
                    Syslog.error('unable to handle cache stream event, no handler provided.');
                }
            },
            (error: any) => {
                if (errorHandler) {
                    errorHandler(error);
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
        }
    }

    success(success: T): void {
        if (this.mutatorSuccessHandler) {
            // push off to the event loop to ensure async exec of mutator logic.
            setTimeout(
                () => this.mutatorSuccessHandler(success)
            );
        }
    }
}