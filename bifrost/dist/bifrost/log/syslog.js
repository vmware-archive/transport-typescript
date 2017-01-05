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
var logger_service_1 = require('./logger.service');
var logger_model_1 = require('./logger.model');
/**
 * Logging facility
 *
 * This class is a wrapper for console.log(). It checks to see if console is
 * present before ttrying to output to it. This facility mimics syslog() by
 * providing multiple log levels for the output. The minimum log level can be
 * be specified by using setLogLevel(). The default log level is LogLevel.warn.
 * Calling setLogLevel(LogLevel.none) will turn off all logging. This can be
 * called dynamically to change the log level at any point in the app.
 */
var Syslog = (function () {
    function Syslog() {
    }
    /**
     * Sets the minimum level of logging.
     *
     * @param level
     */
    Syslog.setLogLevel = function (level) {
        Syslog.createLogger();
        Syslog.logLevel = level;
        Syslog.logger.logLevel = level;
    };
    Syslog.getLogLevel = function () {
        return Syslog.logLevel;
    };
    Syslog.saveLogLevel = function () {
        localStorage.setItem(Syslog.LOG_LEVEL, Syslog.getLogLevel() + '');
    };
    Syslog.clearLogLevel = function () {
        localStorage.removeItem(Syslog.LOG_LEVEL);
    };
    Syslog.getSavedLogLevel = function () {
        var saved = localStorage.getItem(Syslog.LOG_LEVEL);
        if (saved) {
            return +saved;
        }
        Syslog.createLogger();
        Syslog.logLevel = logger_model_1.LogLevel.Warn;
        Syslog.logger.logLevel = Syslog.logLevel;
        return Syslog.logLevel;
    };
    Syslog.suppress = function (flag) {
        Syslog.createLogger();
        Syslog.suppressFlag = flag;
        Syslog.logger.suppress(flag);
    };
    Syslog.silent = function (flag) {
        Syslog.createLogger();
        Syslog.logger.silent(flag);
    };
    Syslog.group = function (level, label, suppress) {
        if (suppress === void 0) { suppress = Syslog.suppressFlag; }
        Syslog.createLogger();
        Syslog.logger.group(level, label, suppress);
    };
    Syslog.groupEnd = function (level) {
        Syslog.logger.groupEnd(level);
    };
    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    Syslog.verbose = function (object, from) {
        Syslog.createLogger();
        Syslog.logger.verbose(object, from);
    };
    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    Syslog.debug = function (object, from) {
        Syslog.createLogger();
        Syslog.logger.debug(object, from);
    };
    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    Syslog.info = function (object, from) {
        Syslog.createLogger();
        Syslog.logger.info(object, from);
    };
    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    Syslog.warn = function (object, from) {
        Syslog.createLogger();
        Syslog.logger.warn(object, from);
    };
    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    Syslog.error = function (object, from) {
        Syslog.createLogger();
        Syslog.logger.error(object, from);
    };
    /**
     * Return last logged string
     *
     * @returns {string}
     */
    Syslog.last = function () {
        Syslog.createLogger();
        return Syslog.logger.last();
    };
    Syslog.createLogger = function () {
        if (!Syslog.logger) {
            Syslog.logger = new logger_service_1.LoggerService();
            Syslog.logger.logLevel = Syslog.logLevel;
        }
    };
    Syslog.logLevel = logger_model_1.LogLevel.Warn;
    Syslog.suppressFlag = false;
    Syslog.LOG_LEVEL = 'logLevel';
    Syslog = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Syslog);
    return Syslog;
}());
exports.Syslog = Syslog;
