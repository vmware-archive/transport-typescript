/**
 * Copyright(c) VMware Inc., 2016
 */
import { LogLevel, LogChannel, LogObject } from './logger.model';
import { GeneralUtil } from '../util/util';

/**
 * This is the low-lever logger that can be instantiated and destroyed at will. Syslog maintains one of these
 * for use across the application, however, anyone can create an instance of this service and manage independent
 * Log Levels and output.
 */
export class Logger {
    private dateCss = 'color: blue;';
    private fromCss = 'color: green';
    private normalCss = 'color: black;';
    private errorCss = 'color: red;';
    private warnCss = 'color: orange;';
    private infoCss = 'color: brown;';
    private debugCss = 'color: black;';
    private verboseCss = 'color: cyan;';

    /* dark theme friendly colors */
    private dateCssDark = 'color: #ec96fb;';
    private fromCssDark = 'color: #FF9800;';
    private normalCssDark = 'color: #03a9f4';
    private errorCssDark = 'color: red;';
    private warnCssDark = 'color: orange;';
    private infoCssDark = 'color: #03a9f4';
    private debugCssDark = 'color: #03a9f4';
    private verboseCssDark = 'color: #03a9f4';

    private _logLevel: LogLevel;
    private _suppress = false;
    private _silent = false;

    private _lastLog: string;

    private _styledLogsSupported: boolean = true;
    private useDarkThemeFriendlyColors: boolean = true;

    setStylingVisble(flag: boolean) {
        this._styledLogsSupported = flag;
    }

    useDarkTheme(flag: boolean) {
        this.useDarkThemeFriendlyColors = flag;
        if (this.useDarkThemeFriendlyColors) {
            this.dateCss = this.dateCssDark;
            this.fromCss = this.fromCssDark;
            this.normalCss = this.normalCssDark;
            this.errorCss = this.errorCssDark;
            this.warnCss = this.warnCssDark;
            this.infoCss = this.infoCssDark;
            this.debugCss = this.debugCssDark;
            this.verboseCss = this.verboseCssDark;
        }
    }

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
    set logLevel(level: LogLevel) {
        this._logLevel = level;
    }

    get logLevel() {
        return this._logLevel;
    }

    get stylingVisble() {
        return this._styledLogsSupported;
    }

    suppress(flag: boolean) {
        this._suppress = flag;
    }

    silent(flag: boolean) {
        this._silent = flag;
    }

    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    verbose(object: any, from?: string) {
        this.log(new LogObject().build(LogLevel.Verbose, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    debug(object: any, from?: string) {
        this.log(new LogObject().build(LogLevel.Debug, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    info(object: any, from?: string) {
        this.log(new LogObject().build(LogLevel.Info, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    warn(object: any, from?: string) {
        this.log(new LogObject().build(LogLevel.Warn, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    error(object: any, from?: string) {
        this.log(new LogObject().build(LogLevel.Error, LogChannel.channel, object, from, this._suppress));
    }

    /**
     * Log always
     *
     * @param object
     * @param from optional caller filename
     */
    always(object: any, from?: string) {
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

    private log(logObject: LogObject) {
        if (logObject.logLevel < this.logLevel) {
            return;
        }
        if (logObject.caller) {
            this._lastLog = '[' + logObject.caller + ']: ' + logObject.object;
        } else {
            this._lastLog = logObject.object;
        }
        if (logObject.suppress) {
            return;
        }

        if (this._silent) {
            return;
        }

        let payloadIsObject = false;
        if (GeneralUtil.isObject(logObject.object)) {
            payloadIsObject = true;
        }

        let date: string = new Date().toLocaleTimeString();
        let output: string = '%c' + logObject.object;
        if (logObject.caller) {
            output += '%c [' + logObject.caller + ']%c';
            output += ' (' + date + ')';
        } else {
            output += '%c%c';
        }

        if (!this._styledLogsSupported) {
            output = output.replace(/%c/g, '');
        }
        

        switch (logObject.logLevel) {
            case LogLevel.Error:
                if (!payloadIsObject) {
                    output = '⁉️ [Error]: ' + output;
                }
                this.outputWithOptionalStyle(console.error, output, this.errorCss);
                break;

            case LogLevel.Warn:
                if (!payloadIsObject) {
                    output = '⚠️ [Warn]: ' + output;
                }
                this.outputWithOptionalStyle(console.warn, output, this.warnCss);
                break;

            case LogLevel.Info:
                if (!payloadIsObject) {
                    output = '▫️️ [Inf]: ' + output;
                }
                this.outputWithOptionalStyle(console.log, output, this.infoCss);
                break;

            case LogLevel.Debug:

                if (!payloadIsObject) {
                    output = '🔸 [Deb]: ' + output;
                }
                this.outputWithOptionalStyle(console.log, output, this.debugCss);
                break;

            case LogLevel.Verbose:
                if (!payloadIsObject) {
                    output = '📍️ [Ver]: ' + output;
                }
                this.outputWithOptionalStyle(console.log, output, this.verboseCss);
                break;

            // default:
            //     this.outputWithOptionalStyle(console.log, output, this.normalCss);
            //     break;
        }
    }
}
