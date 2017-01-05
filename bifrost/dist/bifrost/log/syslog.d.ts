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
export declare class Syslog {
    static logger: LoggerService;
    static logLevel: LogLevel;
    static suppressFlag: boolean;
    static LOG_LEVEL: string;
    /**
     * Sets the minimum level of logging.
     *
     * @param level
     */
    static setLogLevel(level: LogLevel): void;
    static getLogLevel(): LogLevel;
    static saveLogLevel(): void;
    static clearLogLevel(): void;
    static getSavedLogLevel(): number;
    static suppress(flag: boolean): void;
    static silent(flag: boolean): void;
    static group(level: LogLevel, label?: string, suppress?: boolean): void;
    static groupEnd(level: LogLevel): void;
    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    static verbose(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    static debug(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    static info(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    static warn(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    static error(object: any, from: string): void;
    /**
     * Return last logged string
     *
     * @returns {string}
     */
    static last(): string;
    private static createLogger();
}
