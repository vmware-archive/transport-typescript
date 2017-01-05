export declare enum LogLevel {
    Verbose = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Off = 5,
}
export declare class LogChannel {
    static channel: string;
    static logLevel: string;
}
export declare class LogLevelObject {
    private _logLevel;
    build(logLevel: LogLevel): this;
    logLevel: LogLevel;
}
export declare class LogObject {
    private _logLevel;
    private _suppress;
    private _channel;
    private _object;
    private _caller;
    build(logLevel: LogLevel, channel: string, object: any, caller: string, suppress?: boolean): this;
    logLevel: LogLevel;
    channel: string;
    object: any;
    caller: any;
    suppress: any;
}
