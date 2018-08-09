/**
 * Copyright(c) VMware Inc., 2016
 */

/**
 * Channels for communication with the ReST Service, and its message object.
 */

export enum HttpRequest {
    Get,
    Post,
    Patch,
    Delete,
    Put,
    UpdateGlobalHeaders
}

export enum RestErrorType {
    UnknownMethod
}

export class GeneralError {
    constructor(public message: string, public status?: any) {
        this.message = message;
        this.status = status;
    }
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
        pathParams: any = {}) {

        this.request = request;
        this.uri = uri;
        this.body = body;
        this.headers = headers;
        this.pathParams = pathParams;
        this.queryStringParams = queryStringParams;
    }

    //
    // get command() {
    //     return this._request;
    // }
    //
    // set command(command: HttpRequest) {
    //     this._request = command;
    // }
    //
    // get uri() {
    //     return this._uri;
    // }
    //
    // set uri(uri) {
    //     this._uri = uri;
    // }
    //
    // get responseChannel() {
    //     return this._responseChannel;
    // }
    //
    // set responseChannel(responseChannel: string) {
    //     this._responseChannel = responseChannel;
    // }
    //
    // get body() {
    //     return this._body;
    // }
    //
    // set body(body: any) {
    //     this._body = body;
    // }
    //
    // get params() {
    //     return this._params;
    // }
    //
    // set params(p: HttpParams) {
    //     this._params = p;
    // }
    //
    // get response() {
    //     return this._response;
    // }
    //
    // set response(response: any) {
    //     this._response = response;
    // }
    //
    // get error() {
    //     return this._error;
    // }
    //
    // set error(error: any) {
    //     this._error = error;
    // }
    //
    // get refreshRetries() {
    //     return this._refreshRetries;
    // }
    //
    // set refreshRetries(refreshRetries: number) {
    //     this._refreshRetries = refreshRetries;
    // }
}
