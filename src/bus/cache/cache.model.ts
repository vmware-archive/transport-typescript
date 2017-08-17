import { CacheStream } from './cache.api';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MessageFunction } from '../message.model';
import { Syslog } from '../../log/syslog';

export type UUID = string;

export class CacheStateChange<T, V> {
    constructor(private objectId: UUID,
                private changeType: T,
                private objectValue: V) {

    }

    public get id(): UUID {
        return this.objectId;
    }

    public get type(): T {
        return this.changeType;
    }

    public get value(): V {
        return this.objectValue;
    }

}

export class CacheStreamImpl<T> implements CacheStream<T> {
    private subscription: Subscription;

    constructor(private stream: Observable<T>) {

    }

    subscribe(handler: MessageFunction<T>): Subscription {

        this.subscription = this.stream.subscribe(
            (value: T) => {
                if (handler) {
                    handler(value);
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
}