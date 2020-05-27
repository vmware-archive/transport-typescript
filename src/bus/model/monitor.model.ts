/*
 * Copyright 2017-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
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
    MonitorCloseChannel = 'Channel_Closed',
    MonitorGalacticUnsubscribe = 'Galactic_Channel_Unsubscribed',
    MonitorCompleteChannel = 'Channel_Completed',
    MonitorDestroyChannel = 'Channel_Destroyed',
    MonitorObserverJoinedChannel = 'Observer_Joined_Channel',
    MonitorObserverSubscribedChannel = 'Observer_Unsubscribed_From_Channel ',
    MonitorObserverUnsubscribedChannel = 'Observer_Unsubscribed',
    MonitorObserverLeftChannel = 'Observer_Left_Channel',
    MonitorNewChannel = 'New_Channel_Created',
    MonitorNewGalacticChannel = 'New_Galactic_Channel_Created',
    MonitorData = 'Channel_Data',
    MonitorGalacticData = 'Galactic_Data',
    MonitorError = 'Error',
    MonitorDropped = 'Dropped',
    MonitorChildProxyRegistered = 'Child_Proxy_Registered',
    MonitorChildProxyListening = 'Child_Proxy_Listening',
    MonitorChildProxyNotListening = 'Child_Proxy_Not_Listening',
    MonitorChildProxyUnRegistered = 'Child_Proxy_UnRegistered',
    MonitorBrokerConnectorConnected = 'Broker_Connector_Connected',
    MonitorBrokerConnectorDisconnected = 'Broker_Connector_Disconnected',
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
