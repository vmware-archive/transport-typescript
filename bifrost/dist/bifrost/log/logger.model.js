/**
 * Channels for communication with the logger Service, and its message object.
 */
"use strict";
var util_1 = require('./util');
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Off"] = 5] = "Off";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
var LogChannel = (function () {
    function LogChannel() {
    }
    LogChannel.channel = '#Log'; // Used later for distributed logs
    LogChannel.logLevel = 'LogLevel';
    return LogChannel;
}());
exports.LogChannel = LogChannel;
var LogLevelObject = (function () {
    function LogLevelObject() {
        this._logLevel = LogLevel.Warn;
    }
    LogLevelObject.prototype.build = function (logLevel) {
        this._logLevel = logLevel;
        return this;
    };
    Object.defineProperty(LogLevelObject.prototype, "logLevel", {
        get: function () {
            return this._logLevel;
        },
        set: function (level) {
            this._logLevel = level;
        },
        enumerable: true,
        configurable: true
    });
    return LogLevelObject;
}());
exports.LogLevelObject = LogLevelObject;
var LogObject = (function () {
    function LogObject() {
    }
    LogObject.prototype.build = function (logLevel, channel, object, caller, suppress) {
        if (suppress === void 0) { suppress = false; }
        this._logLevel = logLevel;
        this._channel = channel;
        this._object = object;
        this._caller = caller;
        this._suppress = suppress;
        return this;
    };
    Object.defineProperty(LogObject.prototype, "logLevel", {
        get: function () {
            return this._logLevel;
        },
        set: function (level) {
            this._logLevel = level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogObject.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        set: function (chan) {
            this._channel = chan;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogObject.prototype, "object", {
        get: function () {
            return this._object;
        },
        set: function (object) {
            if (object.constructor !== String) {
                object = util_1.LogUtil.pretty(object);
            }
            this._object = object;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogObject.prototype, "caller", {
        get: function () {
            return this._caller;
        },
        set: function (source) {
            this._caller = source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LogObject.prototype, "suppress", {
        get: function () {
            return this._suppress;
        },
        set: function (suppress) {
            this._suppress = suppress;
        },
        enumerable: true,
        configurable: true
    });
    return LogObject;
}());
exports.LogObject = LogObject;
