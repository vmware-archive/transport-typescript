"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Copyright(c) VMware Inc., 2016
 */
var core_1 = require('@angular/core');
var channel_model_1 = require('./channel.model');
var util_1 = require('../log/util');
var logger_service_1 = require('../log/logger.service');
var logger_model_1 = require('../log/logger.model');
var monitor_model_1 = require('./monitor.model');
var message_model_1 = require('./message.model');
require('rxjs/add/operator/filter');
// import * as Ajv from 'ajv';
/**
 * The Messagebus service provides an asynchronous channel-based software bus for sharing data between services and
 * components using a subscription model. Dynamic type checking can be done by both the sender and the receiver(s),
 * but is not a requirement for what is allowed on the bus.
 *
 * Each channel on the bus is a 'Stream' object. The Messagebus is a collection of streams that are identified by
 * the channel name, and referenced through a Map object. The ES6 Map object is now supported in Typescript even in
 * ES5. The following are the interfaces to the Map class:
 *
 * interface Map<K, V> {
 *   clear(): void;
 *   delete(key: K): boolean;
 *   entries(): IterableIterator<[K, V]>;
 *   forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
 *   get(key: K): V;
 *   has(key: K): boolean;
 *   keys(): IterableIterator<K>;
 *   set(key: K, value?: V): Map<K, V>;
 *   size: number;
 *   values(): IterableIterator<V>;
 *   [Symbol.iterator]():IterableIterator<[K,V]>;
 *   [Symbol.toStringTag]: string;
 * }
 *
 * interface MapConstructor {
 *   new <K, V>(): Map<K, V>;
 *   new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
 *   prototype: Map<any, any>;
 * }
 *
 * A channel is implicitly created whenever someone calls getChannel() and no such channel exists.
 */
var MessageBusEnabled = (function () {
    function MessageBusEnabled() {
    }
    return MessageBusEnabled;
}());
exports.MessageBusEnabled = MessageBusEnabled;
var MessagebusService = (function () {
    // private ajv = new Ajv({allErrors: true});
    function MessagebusService(_channelMap) {
        this._channelMap = _channelMap;
        this.monitorChannel = monitor_model_1.MonitorChannel.stream;
        // Disable bus monitor in tests by default
        this.enableMonitor = typeof (jasmine) === 'undefined';
        this.dumpMonitor = true;
        this._channelMap = new Map();
        // Create Monitor channel
        this.monitorStream = new channel_model_1.Channel(this.monitorChannel);
        this._channelMap.set(this.monitorChannel, this.monitorStream);
        this.log = new logger_service_1.LoggerService();
        this.log.logLevel = logger_model_1.LogLevel.Info;
        if (this.enableMonitor) {
            this.monitorBus();
        }
    }
    MessagebusService.prototype.getName = function () {
        return this.constructor.name;
    };
    MessagebusService.prototype.increment = function (cname) {
        this.channelMap.get(cname)
            .increment();
    };
    Object.defineProperty(MessagebusService.prototype, "channelMap", {
        /**
         * Returns the map for monitoring externally (read-only)
         *
         * @returns {Map<string, Channel>}
         */
        get: function () {
            return this._channelMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get a subscription to the monitor channel.
     *
     * @returns {BehaviorSubject<any>}
     */
    MessagebusService.prototype.getMonitor = function () {
        return this.monitorStream.stream;
    };
    /**
     * Turn
     * @param flag
     */
    MessagebusService.prototype.enableMonitorDump = function (flag) {
        this.dumpMonitor = flag;
        return this.dumpMonitor;
    };
    /**
     * Access to private logger so messages can be sequentialized.
     *
     * @returns {LoggerService}
     */
    MessagebusService.prototype.logger = function () {
        return this.log;
    };
    /**
     * For external access to messagebus private logger (so output streams are sequentialized).
     *
     * @param msg
     * @param from
     */
    MessagebusService.prototype.messageLog = function (msg, from) {
        this.log.info(msg, from);
    };
    /**
     * Set the log suppression on or off
     *
     * @param set
     */
    MessagebusService.prototype.suppressLog = function (set) {
        this.log.suppress(set);
    };
    MessagebusService.prototype.silenceLog = function (set) {
        this.log.silent(set);
    };
    /**
     * Externally set messagebus private log level
     *
     * @param logLevel
     */
    MessagebusService.prototype.setLogLevel = function (logLevel) {
        this.log.logLevel = logLevel;
    };
    /**
     * Get a subscribable stream from channel. If the channel doesn't exist, it will be created.
     *
     * @param cname
     * @param from
     * @returns {Subject<Message>}
     */
    MessagebusService.prototype.getChannel = function (cname, from) {
        return this.getChannelObject(cname, from).stream;
    };
    MessagebusService.prototype.getGalacticChannel = function (cname, from) {
        return this.getChannelObject(cname, from)
            .setGalactic().stream;
    };
    MessagebusService.prototype.isGalacticChannel = function (cname) {
        if (this._channelMap.has(cname)) {
            return this._channelMap.get(cname).galactic;
        }
        return false;
    };
    /**
     * A new channel is created by the first reference to it. All subsequent references to that channel are handed
     * the same stream to subscribe to. Accessing this method increments the channels reference count.
     * This method subscribes to both request and response messages. See below for specific directional methods.
     * This method is not filtered.
     *
     * @param cname
     * @param from
     * @returns {Channel}
     */
    MessagebusService.prototype.getChannelObject = function (cname, from) {
        var channel;
        var symbol = ' + ';
        if (this._channelMap.has(cname)) {
            channel = this._channelMap.get(cname);
        }
        else {
            channel = new channel_model_1.Channel(cname);
            this._channelMap.set(cname, channel);
            symbol = ' +++ ';
        }
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorNewChannel, cname, from, symbol);
        this.monitorStream.send(new message_model_1.Message().request(mo));
        channel.increment();
        return channel;
    };
    /**
     * Filter bus events that contain request messages
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    MessagebusService.prototype.getRequestChannel = function (cname, from) {
        return this.getChannel(cname, from)
            .filter(function (message) {
            return (message.isRequest());
        });
    };
    /**
     * Filter bus events that contain response messages. Errors are always response messages.
     *
     * @param cname
     * @param from
     * @returns {Observable<Message>}
     */
    MessagebusService.prototype.getResponseChannel = function (cname, from) {
        return this.getChannel(cname, from)
            .filter(function (message) {
            return (message.isResponse() || message.isError());
        });
    };
    /**
     * Channel reference count
     *
     * @param cname
     * @returns {number}
     */
    MessagebusService.prototype.refCount = function (cname) {
        if (!this._channelMap.has(cname)) {
            return -1;
        }
        return this._channelMap.get(cname).refCount;
    };
    /**
     * Close a channel. If the closer is the last subscriber, then the channel is destroyed.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    MessagebusService.prototype.close = function (cname, from) {
        if (!this._channelMap.has(cname)) {
            return false;
        }
        var channel = this._channelMap.get(cname);
        channel.decrement();
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorCloseChannel, cname, from, ' ' + channel.refCount);
        this.monitorStream.send(new message_model_1.Message().request(mo));
        if (channel.refCount === 0) {
            return this.destroy(channel, from);
        }
        return false;
    };
    /**
     * Transmit arbitrary data on a channel on the message bus if it exists.
     * This routine is called with traceback strings to allow for debugging and monitoring
     * bus traffic.
     *
     * @param cname -> Channel to send to
     * @param message -> Message
     * @param from -> Caller name
     * @returns {boolean} -> on successful transmission
     */
    MessagebusService.prototype.send = function (cname, message, from) {
        // TEMPORARY - flag all messages without schema
        if (!message.messageSchema) {
            this.logger()
                .warn('* No schema in message to ' + cname, from);
        }
        if (!this._channelMap.has(cname)) {
            var mo_1 = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorDropped, cname, from, message);
            this.monitorStream.send(new message_model_1.Message().request(mo_1));
            return false;
        }
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorData, cname, from, message);
        this.monitorStream.send(new message_model_1.Message().request(mo));
        this._channelMap.get(cname)
            .send(message);
        return true;
    };
    /**
     * Transmit an error on a channel on the message bus if it exists.
     *
     * @param cname
     * @param err Error object
     * @returns {boolean} channel existed and transmission made
     */
    MessagebusService.prototype.error = function (cname, err) {
        if (!this._channelMap.has(cname)) {
            return false;
        }
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorError, cname, 'bus error');
        this.monitorStream.send(new message_model_1.Message().error(mo));
        this._channelMap.get(cname)
            .error(err);
        return true;
    };
    /**
     * Transmit complete() on stream.
     *
     * @param cname
     * @param from
     * @returns {boolean}
     */
    MessagebusService.prototype.complete = function (cname, from) {
        if (!this._channelMap.has(cname)) {
            return false;
        }
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorCompleteChannel, cname, from);
        this.monitorStream.send(new message_model_1.Message().request(mo));
        var channel = this._channelMap.get(cname);
        channel.complete();
        return this.destroy(channel, from);
    };
    /**
     * Count listeners across all channels.
     *
     * @returns {number}
     */
    MessagebusService.prototype.countListeners = function () {
        var count = 0;
        this.channelMap.forEach(function (channel, name) {
            count += channel.refCount;
        });
        return count;
    };
    /**
     * Destroy all channels, regardless of whether they still have subscribers.
     * This is intended to be used in afterEach during jasmine tests, so that
     * subscribers from previous tests never fire in subsequent tests.
     *
     * @returns {void}
     */
    MessagebusService.prototype.destroyAllChannels = function () {
        var _this = this;
        this.channelMap.forEach(function (channel, name) {
            _this.destroy(channel, name);
        });
    };
    /**
     *  Destroy a Channel and remove it from our map. If it is not closed, close it first.
     *
     * @param channel
     * @param from
     * @returns {boolean}
     */
    MessagebusService.prototype.destroy = function (channel, from) {
        var mo = new monitor_model_1.MonitorObject().build(monitor_model_1.MonitorType.MonitorDestroyChannel, channel.name, from);
        this.monitorStream.send(new message_model_1.Message().request(mo));
        delete this._channelMap.get(channel.name);
        this._channelMap.delete(channel.name);
        return true;
    };
    MessagebusService.prototype.dumpData = function (mo, tag) {
        var message = mo.data;
        this.log.group(logger_model_1.LogLevel.Info, tag);
        this.log.info(' -> ' + mo.channel, 'Channel');
        if (message.isRequest()) {
            this.log.info('REQUEST', 'Type');
        }
        else {
            if (message.isError()) {
                this.log.info('ERROR', 'Type');
            }
            else {
                this.log.info('RESPONSE', 'Type');
            }
        }
        this.log.group(logger_model_1.LogLevel.Info, message.isError() ? 'Error' : 'Payload');
        this.log.info(util_1.LogUtil.pretty(message.payload), mo.from);
        this.log.groupEnd(logger_model_1.LogLevel.Info);
        if (message.messageSchema) {
            this.log.group(logger_model_1.LogLevel.Info, 'Schema: ' + message.messageSchema._title);
            this.log.info(util_1.LogUtil.pretty(message.messageSchema), 'Schema');
            this.log.groupEnd(logger_model_1.LogLevel.Info);
        }
        this.log.groupEnd(logger_model_1.LogLevel.Info);
    };
    /**
     * This is a listener on the monitor channel which dumps message events to the console
     */
    MessagebusService.prototype.monitorBus = function () {
        var _this = this;
        this.getMonitor()
            .subscribe(function (message) {
            if (!message.isError()) {
                var mo = message.payload;
                switch (mo.type) {
                    case monitor_model_1.MonitorType.MonitorNewChannel:
                        _this.log.info(mo.data + mo.channel, mo.from);
                        break;
                    case monitor_model_1.MonitorType.MonitorCloseChannel:
                        _this.log.info(' X ' + mo.channel + '[' + mo.data + ']', mo.from);
                        break;
                    case monitor_model_1.MonitorType.MonitorCompleteChannel:
                        _this.log.info(' C ' + mo.channel, mo.from);
                        break;
                    case monitor_model_1.MonitorType.MonitorDestroyChannel:
                        _this.log.info('XXX ' + mo.channel, mo.from);
                        break;
                    case monitor_model_1.MonitorType.MonitorData:
                        if (!_this.dumpMonitor) {
                            break;
                        }
                        _this.dumpData(mo, mo.from + ' -> ' + mo.channel +
                            (message.messageSchema
                                ? '  ['
                                    + message.messageSchema._title
                                    + ']'
                                : ''));
                        break;
                    case monitor_model_1.MonitorType.MonitorDropped:
                        if (!_this.dumpMonitor) {
                            break;
                        }
                        _this.dumpData(mo, '*DROP* message from ' + mo.from + ' -> ' + mo.channel +
                            (message.messageSchema
                                ? '  ['
                                    + message.messageSchema._title
                                    + ']'
                                : ''));
                        break;
                    default:
                        break;
                }
            }
            else {
                _this.log.error('Error on monitor channel: ' + util_1.LogUtil.pretty(message), _this.getName());
            }
        });
    };
    MessagebusService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Map])
    ], MessagebusService);
    return MessagebusService;
}());
exports.MessagebusService = MessagebusService;
