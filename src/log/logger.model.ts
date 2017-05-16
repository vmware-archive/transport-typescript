/**
 * Channels for communication with the logger Service, and its message object.
 */

import {LogUtil} from './util';
export enum LogLevel {
    Verbose,
    Debug,
    Info,
    Warn,
    Error,
    Off
}

export class LogChannel {
    static channel = '#Log';     // Used later for distributed logs
    static logLevel = 'LogLevel';
}

export class LogLevelObject {
    private _logLevel = LogLevel.Warn;

    build (logLevel: LogLevel) {
        this._logLevel = logLevel;
        return this;
    }

    get logLevel () {
        return this._logLevel;
    }

    set logLevel (level: LogLevel) {
        this._logLevel = level;
    }
}

export class LogObject {
    private _logLevel: LogLevel;
    private _suppress: boolean;
    private _channel: string;
    private _object: any;
    private _caller: string;

    build (logLevel: LogLevel, channel: string, object: any, caller: string, suppress = false) {
        this._logLevel = logLevel;
        this._channel = channel;
        this._object = object;
        this._caller = caller;
        this._suppress = suppress;

        return this;
    }

    get logLevel () {
        return this._logLevel;
    }

    set logLevel (level: LogLevel) {
        this._logLevel = level;
    }

    get channel () {
        return this._channel;
    }

    set channel (chan: string) {
        this._channel = chan;
    }

    get object () {
        return this._object;
    }

    set object (object: any) {
        if (object.constructor !== String) {    // stringify if not string object
            object = LogUtil.pretty(object);
        }
        this._object = object;
    }

    get caller () {
        return this._caller;
    }

    set caller (source: any) {
        this._caller = source;
    }

    get suppress () {
        return this._suppress;
    }

    set suppress (suppress: any) {
        this._suppress = suppress;
    }
}
