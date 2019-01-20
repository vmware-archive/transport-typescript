import { EventBusEnabled, MessageArgs } from '../../../bus.api';
import { HttpRequest, RestError, RestErrorType, RestObject } from './rest.model';
import { LogLevel } from '../../../log';
import { BusStore } from '../../../store.api';
import { AbstractCore } from '../../abstractions/abstract.core';
import { HttpClient } from './http.client';
import { BifrostHttpclient } from './bifrost.httpclient';

const REFRESH_RETRIES = 3;
const GLOBAL_HEADERS = 'global-headers';
const GLOBAL_HEADERS_UPDATE = 'update';


/**
 * REST Service that operates standard functions on behalf of consumers and services.
 */
export class RestService extends AbstractCore implements EventBusEnabled {

    public static channel = 'bifrost-services::RestService';

    private headers: any;
    private headerStore: BusStore<any>;
    private name: string = 'RESTService';
    private httpClient: HttpClient;
    private globalBaseUri: string;
    private disableCorsAndCredentials: boolean = false;

    public getName(): string {
        return this.name;
    }

    constructor(httpClient?: HttpClient) {
        super();

        if (!httpClient) {
            this.httpClient = new BifrostHttpclient();
        } else {
            this.httpClient = httpClient;
        }

        this.headerStore = this.storeManager.createStore('bifrost::RestService');
        this.listenForRequests();
        this.log.info(`${this.name} Online`);

        // leave this configurable by consumer, defaults to same host/scheme as hosted UI.
        this.globalBaseUri = '';
    }

    private listenForRequests() {
        this.bus.listenRequestStream(RestService.channel)
            .handle((restObject: RestObject, args: MessageArgs) => {
                restObject.refreshRetries = 0;

                console.log('fishmas!', restObject);

                if (restObject.request !== HttpRequest.UpdateGlobalHeaders
                    && restObject.request !== HttpRequest.SetRestServiceHostOptions
                    && restObject.request !== HttpRequest.DisableCORSAndCredentials) {
                    this.doHttpRequest(restObject, args);
                } else {

                    switch (restObject.request) {
                        case HttpRequest.UpdateGlobalHeaders:
                            this.updateHeaders(restObject.headers);
                            break;

                        case HttpRequest.SetRestServiceHostOptions:
                            this.updateHostOptions(restObject.uri);
                            break;

                        case HttpRequest.DisableCORSAndCredentials:
                            this.disableCORS(true);
                            break;

                        default:
                            break;
                    }
                }
            });
    }

    private updateHeaders(headers: any): void {
        this.log.info(`Updating global headers for outbound request: ${headers}`, this.getName());
        this.headerStore.put(GLOBAL_HEADERS, headers, GLOBAL_HEADERS_UPDATE);
    }

    private updateHostOptions(uri: string): void {
        this.log.info(`Updating global base URI to: ${uri}`, this.getName());
        this.globalBaseUri = uri;
    }

    private disableCORS(val: boolean): void {
        this.disableCorsAndCredentials = val;
    }

    private handleData(data: any, restObject: RestObject, args: MessageArgs) {
        this.log.group(LogLevel.Verbose, 'REST APIRequest ' + restObject.request + ' ' + restObject.uri);
        this.log.verbose('** Received response: ' + data, this.getName());
        this.log.verbose('** APIRequest was: ' + restObject, this.getName());
        this.log.verbose('** Headers were: ' + this.headers, this.getName());
        this.log.groupEnd(LogLevel.Verbose);

        // set response in rest request object
        restObject.response = data;

        // send the object back to whomever was listening for this specific request.
        this.bus.sendResponseMessageWithIdAndVersion(RestService.channel,
            restObject, args.uuid, args.version, this.getName());
    }

    private handleError(error: any, restObject: RestObject, args: MessageArgs) {

        if (error) {
            this.log.group(LogLevel.Error, 'Http Error: ' + restObject.request + ' ' +
                restObject.uri + ' -' + ' ' + error.status);

            this.log.error(error, this.getName());
            this.log.error('** APIRequest was: ' + restObject.body, this.getName());
            this.log.error('** Headers were: ' + this.headers, this.getName());
            this.log.groupEnd(LogLevel.Error);

            switch (error.status) {
                case 401:

                    // retry the all to give the backend time to refresh any expired tokens.
                    if (restObject.refreshRetries++ < REFRESH_RETRIES) {
                        this.bus.api.tickEventLoop(
                            () => {
                                this.doHttpRequest(restObject, args);
                            }
                        );
                    } else {
                        this.bus.sendErrorMessageWithIdAndVersion(RestService.channel, error,
                            args.uuid, args.version, this.getName());
                    }
                    break;

                default:
                    this.bus.sendErrorMessageWithIdAndVersion(RestService.channel, error,
                        args.uuid, args.version, this.getName());
            }
        } else {
            this.bus.sendErrorMessageWithIdAndVersion(RestService.channel, 'Http request failed, unknown error',
                args.uuid, args.version, this.getName());
        }

    }

    private doHttpRequest(restObject: RestObject, args: MessageArgs) {
        // handle rest response
        const successHandler = (response: any) => {
            this.handleData(response, restObject, args);
        };

        const errorHandler = (response: any) => {
            this.handleError(response, restObject, args);
        };

        const globalHeaders = this.headerStore.get(GLOBAL_HEADERS);

        // merge globals and request headers
        const requestHeaders = {...restObject.headers, ...globalHeaders};

        console.log('generating headers: ', requestHeaders);

        // generate fetch headers, init and request objects.
        const requestHeadersObject = new Headers(requestHeaders);
        const requestInit = this.generateRequestInitObject(restObject, requestHeadersObject);
        let httpRequest;

        // try to create fetch request.
        try {
            const uri: string = this.globalBaseUri + restObject.uri;
            console.log('CALLING URI:', uri);
            httpRequest = new Request(uri, requestInit);
        } catch (e) {
            this.log.error(`Cannot create request: ${e}`, this.getName());
            this.handleError(
                new RestError('Invalid HTTP request.', RestErrorType.UnknownMethod, restObject.uri),
                restObject,
                args);
            return;
        }

        switch (restObject.request) {
            case HttpRequest.Get:
                this.httpClient.get(httpRequest, successHandler, errorHandler);
                break;

            case HttpRequest.Post:
                this.httpClient.post(httpRequest, successHandler, errorHandler);
                break;

            case HttpRequest.Patch:
                this.httpClient.patch(httpRequest, successHandler, errorHandler);
                break;

            case HttpRequest.Put:
                this.httpClient.put(httpRequest, successHandler, errorHandler);
                break;

            case HttpRequest.Delete:
                this.httpClient.delete(httpRequest, successHandler, errorHandler);
                break;

            default:
                this.log.error(`Bad REST request: ${restObject.request}`, this.getName());
                this.handleError(
                    new RestError('Invalid HTTP request.', RestErrorType.UnknownMethod, restObject.uri),
                    restObject,
                    args);
                return;
        }
    }

    private generateRequestInitObject(restObject: RestObject, headers: Headers): any {

        let requestInit: any = {
            method: restObject.request,
            headers: headers,
            mode: 'cors',
            credentials: 'same-origin',
            referrerPolicy: 'origin-when-cross-origin',
        };

        if (this.disableCorsAndCredentials) {
            //requestInit.mode = 'cors';
            requestInit.credentials = 'omit';
        }

        // GET requests may not have a body
        if (restObject.request !== HttpRequest.Get) {

            try {
                // check if payload has already been stringified or not
                if (JSON.parse(restObject.body)) {
                    requestInit.body = restObject.body;
                }
            } catch (exp) {
                requestInit.body = JSON.stringify(restObject.body);
            }
        }
        console.log('request init object is: ', requestInit);
        return requestInit;
    }
}
