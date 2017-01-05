import { LogLevel } from './logger.model';
/**
 * This is the low-lever logger that can be instantiated and destroyed at will. Syslog maintains one of these
 * for use across the application, however, anyone can create an instance of this service and manage independent
 * Log Levels and output.
 */
export declare class LoggerService {
    private dateCss;
    private fromCss;
    private normalCss;
    private errorCss;
    private warnCss;
    private infoCss;
    private debugCss;
    private verboseCss;
    private _logLevel;
    private _suppress;
    private _silent;
    private _lastLog;
    private _styledLogsSupported;
    /**
     * Returns the last item logged.
     *
     * @returns {string}
     */
    last(): string;
    /**
     * Clear the last log
     */
    clear(): void;
    /**
     * Sets the minimum level of logging.
     *
     * @param level
     */
    logLevel: LogLevel;
    suppress(flag: boolean): void;
    silent(flag: boolean): void;
    /**
     * Log if the minimum is at or below LogLevel.verbose
     *
     * @param object
     * @param from optional caller filename
     */
    verbose(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.debug
     *
     * @param object
     * @param from optional caller filename
     */
    debug(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.info
     *
     * @param object
     * @param from optional caller filename
     */
    info(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.warn
     *
     * @param object
     * @param from optional caller filename
     */
    warn(object: any, from: string): void;
    /**
     * Log if the minimum is at or below LogLevel.error
     *
     * @param object
     * @param from optional caller filename
     */
    error(object: any, from: string): void;
    /**
     * Log always
     *
     * @param object
     * @param from optional caller filename
     */
    always(object: any, from: string): void;
    group(logLevel: LogLevel, label: string, suppress?: boolean): void;
    groupEnd(logLevel: LogLevel): void;
    private outputWithOptionalStyle(fn, output, severityCss);
    private log(logObject);
}
