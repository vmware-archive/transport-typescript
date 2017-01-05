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
export declare class MonitorChannel {
    static stream: string;
}
export declare enum MonitorType {
    MonitorCloseChannel = 0,
    MonitorCompleteChannel = 1,
    MonitorDestroyChannel = 2,
    MonitorNewChannel = 3,
    MonitorData = 4,
    MonitorError = 5,
    MonitorDropped = 6,
}
export declare class MonitorObject {
    _type: MonitorType;
    _from: string;
    _channel: string;
    _data: any;
    build(type: MonitorType, channel: string, from: string, data?: any): this;
    type: MonitorType;
    from: string;
    channel: string;
    data: any;
    isNewChannel(): boolean;
    isChannelGone(): boolean;
    hasData(): boolean;
}
