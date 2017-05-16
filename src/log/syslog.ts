/**
 * Copyright(c) VMware Inc., 2016
 */

import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { LogLevel } from './logger.model';

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


@Injectable()
export class Syslog {
    static logger: LoggerService;

    static logLevel = LogLevel.Warn;
    static suppressFlag = false;
    static LOG_LEVEL = 'logLevel';

    /**
     * Sets the minimum level of logging.
     *
     * @param level
     */
    public static setLogLevel (level: LogLevel) {
        Syslog.createLogger();
        Syslog.logLevel = level;
        Syslog.logger.logLevel = level;
    }

    public static getLogLevel () {
        return Syslog.logLevel;
    }

    public static saveLogLevel () {
        localStorage.setItem(Syslog.LOG_LEVEL, Syslog.getLogLevel() + '');
    }

    public static clearLogLevel () {
        localStorage.removeItem(Syslog.LOG_LEVEL);
    }

    public static getSavedLogLevel () {
        let saved = localStorage.getItem(Syslog.LOG_LEVEL);
        if (saved) {
            return +saved;
        }

        Syslog.createLogger();
        Syslog.logLevel = LogLevel.Warn;
        Syslog.logger.logLevel = Syslog.logLevel;
        return Syslog.logLevel;
    }

    public static suppress (flag: boolean) {
        Syslog.createLogger();
        Syslog.suppressFlag = flag;
        Syslog.logger.suppress(flag);
    }

    public static silent (flag: boolean) {
        Syslog.createLogger();
        Syslog.logger.silent(flag);
    }

    public static group(level: LogLevel, label?: string, suppress = Syslog.suppressFlag) {
        Syslog.createLogger();
        Syslog.logger.group (level, label, suppress);
    }

    public static groupEnd(level: LogLevel) {
        Syslog.logger.groupEnd(level);
    }

    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    public static verbose (object: any, from?: string) {
        Syslog.createLogger();
        Syslog.logger.verbose(object, from);
    }

    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    public static debug (object: any, from?: string) {
        Syslog.createLogger();
        Syslog.logger.debug(object, from);
    }

    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    public static info (object: any, from?: string) {
        Syslog.createLogger();
        Syslog.logger.info(object, from);
    }

    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    public static warn (object: any, from?: string) {
        Syslog.createLogger();
        Syslog.logger.warn(object, from);
    }

    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    public static error (object: any, from?: string) {
        Syslog.createLogger();
        Syslog.logger.error(object, from);
    }

    /**
     * Return last logged string
     *
     * @returns {string}
     */
    public static last () {
        Syslog.createLogger();
        return Syslog.logger.last();
    }

    private static createLogger() {
        if (!Syslog.logger) {
            Syslog.logger = new LoggerService();
            Syslog.logger.logLevel = Syslog.logLevel;
        }
    }
}
