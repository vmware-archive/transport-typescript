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

export class MessageSchema {

    protected $schema: string;
    protected title: string;
    protected description: string;
    protected type: string;
    protected properties: any;

    constructor (title?: string, description: string = 'message schema', payload?: any, type: string = 'object') {
        this.title = title;
        this.description = description;

        this.type = type;
        this.$schema = 'http://json-schema.org/draft-04/schema#';
        this.properties = {
            '_payload': {
                'type': 'object'
            },
            '_isError': {
                'type': 'boolean'
            },
            '_type': {
                'type': 'integer'
            },
            'required': ['_payload', '_type', 'isError']
        };

        if (payload) {
            this.properties._payload = payload;
        }
    }

    public get _title (): string {
        return this.title;
    }

    public set _title (title: string) {
        this.title = title;
    }

    protected get _description (): string {
        return this.description;
    }

    protected set _description (description: string) {
        this.description = description;
    }

    protected get _type (): string {
        return this.type;
    }

    protected set _type (type: string) {
        this.type = type;
    }
}

export class ErrorSchema extends MessageSchema {

    constructor () {
        super('Error', 'Error Response');
    }
}
