import { CacheStream } from './cache.api';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MessageFunction } from '../message.model';
import { Syslog } from '../../log/syslog';

export type UUID = string;
export type CacheType = string;

export class MutationRequestWrapper<T, E = any> {

    value: T;
    errorHandler: MessageFunction<E>;

    constructor(value: T,
                errorHandler?: MessageFunction<E>) {
        this.value = value;
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
    private error: MessageFunction<E>;

    constructor(changeType: T,
                objectValue: V) {
        super(changeType, objectValue);
    }

    public set errorHandler(handler: MessageFunction<E>) {
        this.error = handler;
    }

    public get errorHandler() {
        return this.error;
    }

}

export class CacheStreamImpl<T, E = any> implements CacheStream<T> {

    private subscription: Subscription;
    private errorHandler: MessageFunction<E>;

    constructor(private stream: Observable<MutationRequestWrapper<T, E>>) {

    }

    subscribe(handler: MessageFunction<T>): Subscription {

        this.subscription = this.stream.subscribe(
            (req: MutationRequestWrapper<T, E>) => {
                if (handler) {

                    if (req.errorHandler) {
                        // capture error handler.
                        this.errorHandler = req.errorHandler;
                    }

                    // forward onto subscriber.
                    handler(req.value);

                } else {
                    Syslog.error('unable to handle cache stream event, no handler provided.');
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

    error(error: any): void {
        if (this.errorHandler) {
            this.errorHandler(error);
        }
    }
}