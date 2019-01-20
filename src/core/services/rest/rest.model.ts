/**
 * Copyright(c) VMware Inc., 2018
 */

/**
 * Channels for communication with the ReST Service, and its message object.
 */

import { GeneralError } from '../../model/error.model';

export enum HttpRequest {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH' ,
    Delete =  'DELETE',
    Put = 'PUT',
    UpdateGlobalHeaders = 'UpdateGlobalHeaders',
    SetRestServiceHostOptions = 'SetRestServiceHostOptions',
    DisableCORSAndCredentials = 'DisableCORSAndCredentials',
}

export enum RestErrorType {
    UnknownMethod
}

/**
 * This is the error class that is returned from the ReST service on HTTP error.
 */
export class RestError extends GeneralError {
    constructor(public message: string, public status?: number, public url?: string) {
        super(message, status);
        this.url = url;
    }
}

export class RestObject {
    public request: HttpRequest;
    public uri: string;
    public body: any;
    public response: any;
    public error: any;
    public headers: any;
    public pathParams: any;
    public queryStringParams: any;
    public refreshRetries: number;

    constructor(
        request: HttpRequest,
        uri: string,
        body: any = null,
        headers: any = {},
        queryStringParams: any = {},
        pathParams: any = {},
        public readonly apiClass?: string | null | undefined,
        public readonly senderName?: string | null | undefined) {

        this.request = request;
        this.uri = uri;
        this.body = body;
        this.headers = headers;
        this.pathParams = pathParams;
        this.queryStringParams = queryStringParams;
    }
}
