/**
 * Copyright(c) VMware Inc., 2016
 */
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
var core_1 = require('@angular/core');
var logger_model_1 = require('./logger.model');
function checkForStyledLogSupport() {
    if (typeof (window) === 'undefined') {
        return false;
    }
    var looksLikePhantomJS = /PhantomJS/.test(window.navigator.userAgent);
    return !looksLikePhantomJS;
}
/**
 * This is the low-lever logger that can be instantiated and destroyed at will. Syslog maintains one of these
 * for use across the application, however, anyone can create an instance of this service and manage independent
 * Log Levels and output.
 */
var LoggerService = (function () {
    function LoggerService() {
        this.dateCss = 'color: blue;';
        this.fromCss = 'color: green';
        this.normalCss = 'color: black;';
        this.errorCss = 'color: red;';
        this.warnCss = 'color: orange;';
        this.infoCss = 'color: brown;';
        this.debugCss = 'color: black;';
        this.verboseCss = 'color: cyan;';
        this._suppress = false;
        this._silent = false;
        this._styledLogsSupported = checkForStyledLogSupport();
    }
    /**
     * Returns the last item logged.
     *
     * @returns {string}
     */
    LoggerService.prototype.last = function () {
        return this._lastLog;
    };
    /**
     * Clear the last log
     */
    LoggerService.prototype.clear = function () {
        this._lastLog = '';
    };
    Object.defineProperty(LoggerService.prototype, "logLevel", {
        get: function () {
            return this._logLevel;
        },
        /**
         * Sets the minimum level of logging.
         *
         * @param level
         */
        set: function (level) {
            this._logLevel = level;
        },
        enumerable: true,
        configurable: true
    });
    LoggerService.prototype.suppress = function (flag) {
        this._suppress = flag;
    };
    LoggerService.prototype.silent = function (flag) {
        this._silent = flag;
    };
    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.verbose = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Verbose, logger_model_1.LogChannel.channel, object, from, this._suppress));
    };
    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.debug = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Debug, logger_model_1.LogChannel.channel, object, from, this._suppress));
    };
    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.info = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Info, logger_model_1.LogChannel.channel, object, from, this._suppress));
    };
    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.warn = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Warn, logger_model_1.LogChannel.channel, object, from, this._suppress));
    };
    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.error = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Error, logger_model_1.LogChannel.channel, object, from, this._suppress));
    };
    /**
     * Log always
     *
     * @param object
     * @param from optional caller filename
     */
    LoggerService.prototype.always = function (object, from) {
        this.log(new logger_model_1.LogObject().build(logger_model_1.LogLevel.Off, logger_model_1.LogChannel.channel, object, from));
    };
    LoggerService.prototype.group = function (logLevel, label, suppress) {
        if (suppress === void 0) { suppress = this._suppress; }
        if (logLevel < this.logLevel || suppress) {
            return;
        }
        console.groupCollapsed(label);
    };
    LoggerService.prototype.groupEnd = function (logLevel) {
        if (logLevel < this.logLevel || this._suppress) {
            return;
        }
        console.groupEnd();
    };
    LoggerService.prototype.outputWithOptionalStyle = function (fn, output, severityCss) {
        var consoleArgs = [output];
        if (this._styledLogsSupported) {
            consoleArgs = consoleArgs.concat(this.dateCss, this.fromCss, severityCss);
        }
        fn.apply(console, consoleArgs);
    };
    LoggerService.prototype.log = function (logObject) {
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
        var date = new Date().toLocaleTimeString();
        var output = '%c' + date + ' %c[' + logObject.caller + ']: %c' + logObject.object;
        if (!this._styledLogsSupported) {
            output = output.replace(/%c/g, '');
        }
        switch (logObject.logLevel) {
            case logger_model_1.LogLevel.Error:
                this.outputWithOptionalStyle(console.error, output, this.errorCss);
                break;
            case logger_model_1.LogLevel.Warn:
                this.outputWithOptionalStyle(console.warn, output, this.warnCss);
                break;
            case logger_model_1.LogLevel.Info:
                this.outputWithOptionalStyle(console.log, output, this.infoCss);
                break;
            case logger_model_1.LogLevel.Debug:
                this.outputWithOptionalStyle(console.log, output, this.debugCss);
                break;
            case logger_model_1.LogLevel.Verbose:
                this.outputWithOptionalStyle(console.log, output, this.verboseCss);
                break;
            default:
                this.outputWithOptionalStyle(console.log, output, this.normalCss);
                break;
        }
    };
    LoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
