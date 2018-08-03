/**
 * Copyright(c) VMware Inc., 2016
 */

/**
 * Channels for communication with the ReST Service, and its message object.
 */

export class RestChannel {
    static all = 'services::Rest';
}

export enum HttpRequest {
    Get,
    Post,
    Patch,
    Delete,
    Put
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
    private _request: HttpRequest;
    private _uri: string;
    private _responseChannel: string;
    //private _params: HttpParams;
    private _body: any;
    private _response: any;
    private _error: any;
    private _refreshRetries: number;

    constructor(request: HttpRequest, uri: string, responseChannel: string, body: any = {}) {
        this._request = request;
        this._uri = uri;
        this._responseChannel = responseChannel;

        this._body = body;
        //this._params = params;
    }

    //
    // get request() {
    //     return this._request;
    // }
    //
    // set request(request: HttpRequest) {
    //     this._request = request;
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
