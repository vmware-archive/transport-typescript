/**
 * Copyright(c) VMware Inc., 2016
 */


/**
 * A monitor object is generated on each bus transaction. It contains notification of new channels,
 * destroyed channels, as well as channels who have been closed by a subscriber, but is still open
 * to other subscribers. You can call bus.refCount(channelName) to see how many subscribers there are
 * on a channel. bus.send() will also generate a MonitorObject with the transmitted data.
 *
 * As with all messagebus transactions, if there are no subscribers on the monitor channel, nothing
 * is transmitted.
 */

export class MonitorChannel {
    static stream = '#messagebus-monitor';
}

export enum MonitorType {
    MonitorCloseChannel,
    MonitorCompleteChannel,
    MonitorDestroyChannel,
    MonitorNewChannel,
    MonitorData,
    MonitorError,
    MonitorDropped
}

export class MonitorObject {
    _type: MonitorType;
    _from: string;
    _channel: string;
    _data: any;

    build (type: MonitorType, channel: string, from: string, data?: any) {
        this._type = type;
        this._from = from;
        this._channel = channel;
        this._data = data;

        return this;
    }

    get type (): MonitorType {
        return this._type;
    }

    set type (type: MonitorType) {
        this._type = type;
    }

    get from (): string {
        return this._from;
    }

    set from (from: string) {
        this._from = from;
    }

    get channel (): string {
        return this._channel;
    }

    set channel (channel: string) {
        this._channel = channel;
    }

    get data (): any {
        return this._data;
    }

    set data (data: any) {
        this._data = data;
    }

    isNewChannel (): boolean {
        return this._type && this._type === MonitorType.MonitorNewChannel;
    }

    isChannelGone (): boolean {
        return this._type && this._channel && this._type === MonitorType.MonitorDestroyChannel;
    }

    hasData (): boolean {
        return !!this._data;
    }
}