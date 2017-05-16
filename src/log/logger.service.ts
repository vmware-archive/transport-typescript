/**
 * Copyright(c) VMware Inc., 2016
 */

import { Injectable } from '@angular/core';
import { LogLevel, LogChannel, LogObject } from './logger.model';

function checkForStyledLogSupport () {
    if (typeof(window) === 'undefined') {
        return false;
    }
    const looksLikePhantomJS = /PhantomJS/.test(window.navigator.userAgent);
    return !looksLikePhantomJS;
}

/**
 * This is the low-lever logger that can be instantiated and destroyed at will. Syslog maintains one of these
 * for use across the application, however, anyone can create an instance of this service and manage independent
 * Log Levels and output.
 */

@Injectable()
export class LoggerService {
    private dateCss = 'color: blue;';
    private fromCss = 'color: green';
    private normalCss = 'color: black;';
    private errorCss = 'color: red;';
    private warnCss = 'color: orange;';
    private infoCss = 'color: brown;';
    private debugCss = 'color: black;';
    private verboseCss = 'color: cyan;';

    private _logLevel: LogLevel;
    private _suppress = false;
    private _silent = false;

    private _lastLog: string;

    private _styledLogsSupported: boolean = checkForStyledLogSupport();

    /**
     * Returns the last item logged.
     *
     * @returns {string}
     */
    last(): string {
       return this._lastLog;
    }

    /**
     * Clear the last log
     */
    clear() {
        this._lastLog = '';
    }

    /**
     * Sets the minimum level of logging.
     *
     * @param level
     */
    set logLevel (level: LogLevel) {
        this._logLevel = level;
    }

    get logLevel () {
        return this._logLevel;
    }

    suppress (flag: boolean) {
        this._suppress = flag;
    }

    silent (flag: boolean) {
        this._silent = flag;
    }

    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    verbose (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Verbose, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    debug (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Debug, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    info (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Info, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    warn (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Warn, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    error (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Error, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log always
     *
     * @param object
     * @param from optional caller filename
     */
    always (object: any, from: string) {
        this.log(new LogObject().build(LogLevel.Off, LogChannel.channel, object, from));
    }

    group(logLevel: LogLevel, label: string, suppress = this._suppress) {
        if (logLevel < this.logLevel || suppress) {
            return;
        }
        console.groupCollapsed(label);
    }

    groupEnd(logLevel: LogLevel) {
        if (logLevel < this.logLevel || this._suppress) {
            return;
        }
        console.groupEnd();
    }

    private outputWithOptionalStyle(fn: Function, output: string, severityCss: string) {
        let consoleArgs = [output];
        if (this._styledLogsSupported) {
            consoleArgs = consoleArgs.concat(this.dateCss, this.fromCss, severityCss);
        }
        fn.apply(console, consoleArgs);
    }

    private log (logObject: LogObject) {
        if (logObject.logLevel < this.logLevel) {
            return;
        }

        this._lastLog = '[' + logObject.caller + ']: ' + logObject.object;

        if (logObject.suppress) {
            return;
        }

        if (this._silent) {
            return;
        }

        let date: string = new Date().toLocaleTimeString();
        let output: string = '%c' + date + ' %c[' + logObject.caller + ']: %c' + logObject.object;
        if (!this._styledLogsSupported) {
            output = output.replace(/%c/g, '');
        }

        switch (logObject.logLevel) {
            case LogLevel.Error:
                this.outputWithOptionalStyle(console.error, output, this.errorCss);
                break;

            case LogLevel.Warn:
                this.outputWithOptionalStyle(console.warn, output, this.warnCss);
                break;

            case LogLevel.Info:
                this.outputWithOptionalStyle(console.log, output, this.infoCss);
                break;

            case LogLevel.Debug:
                this.outputWithOptionalStyle(console.log, output, this.debugCss);
                break;

            case LogLevel.Verbose:
                this.outputWithOptionalStyle(console.log, output, this.verboseCss);
                break;

            default:
                this.outputWithOptionalStyle(console.log, output, this.normalCss);
                break;
        }
    }
}
