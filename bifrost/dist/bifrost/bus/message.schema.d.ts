/**
 * Copyright(c) VMware Inc., 2016
 */
/**
 * The MessageSchema describes the format of the Message payload (API).
 * We use JSON-schema to describe our message payloads.
 *
 * The accessors are underscored because they are meant to be used by the validation engine and should not be
 * invoked directly from anywhere else in the application. The instance variables need to have the provided names.
 */
export declare class MessageSchema {
    protected $schema: string;
    protected title: string;
    protected description: string;
    protected type: string;
    protected properties: any;
    constructor(title?: string, description?: string, payload?: any, type?: string);
    _title: string;
    protected _description: string;
    protected _type: string;
}
export declare class ErrorSchema extends MessageSchema {
    constructor();
}
