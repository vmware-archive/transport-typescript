/**
 * Copyright(c) VMware Inc., 2016
 */
"use strict";
/**
 * A monitor object is generated on each bus transaction. It contains notification of new channels,
 * destroyed channels, as well as channels who have been closed by a subscriber, but is still open
 * to other subscribers. You can call bus.refCount(channelName) to see how many subscribers there are
 * on a channel. bus.send() will also generate a MonitorObject with the transmitted data.
 *
 * As with all messagebus transactions, if there are no subscribers on the monitor channel, nothing
 * is transmitted.
 */
var MonitorChannel = (function () {
    function MonitorChannel() {
    }
    MonitorChannel.stream = '#messagebus-monitor';
    return MonitorChannel;
}());
exports.MonitorChannel = MonitorChannel;
(function (MonitorType) {
    MonitorType[MonitorType["MonitorCloseChannel"] = 0] = "MonitorCloseChannel";
    MonitorType[MonitorType["MonitorCompleteChannel"] = 1] = "MonitorCompleteChannel";
    MonitorType[MonitorType["MonitorDestroyChannel"] = 2] = "MonitorDestroyChannel";
    MonitorType[MonitorType["MonitorNewChannel"] = 3] = "MonitorNewChannel";
    MonitorType[MonitorType["MonitorData"] = 4] = "MonitorData";
    MonitorType[MonitorType["MonitorError"] = 5] = "MonitorError";
    MonitorType[MonitorType["MonitorDropped"] = 6] = "MonitorDropped";
})(exports.MonitorType || (exports.MonitorType = {}));
var MonitorType = exports.MonitorType;
var MonitorObject = (function () {
    function MonitorObject() {
    }
    MonitorObject.prototype.build = function (type, channel, from, data) {
        this._type = type;
        this._from = from;
        this._channel = channel;
        this._data = data;
        return this;
    };
    Object.defineProperty(MonitorObject.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonitorObject.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (from) {
            this._from = from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonitorObject.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        set: function (channel) {
            this._channel = channel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonitorObject.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
        },
        enumerable: true,
        configurable: true
    });
    MonitorObject.prototype.isNewChannel = function () {
        return this._type && this._type === MonitorType.MonitorNewChannel;
    };
    MonitorObject.prototype.isChannelGone = function () {
        return this._type && this._channel && this._type === MonitorType.MonitorDestroyChannel;
    };
    MonitorObject.prototype.hasData = function () {
        return !!this._data;
    };
    return MonitorObject;
}());
exports.MonitorObject = MonitorObject;
