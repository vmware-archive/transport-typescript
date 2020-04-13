import { EventBusEnabled, MessageArgs, MessageHandler } from '../../../bus.api';
import { HttpRequest, RestError, RestErrorType, RestObject } from './rest.model';
import { LogLevel } from '../../../log';
import { BusStore } from '../../../store.api';
import { AbstractCore } from '../../abstractions/abstract.core';
import { HttpClient } from './http.client';
import { BifrostHttpclient } from './bifrost.httpclient';
import { FabricService } from '../../abstractions/fabric.service';
import { GLOBAL_HEADERS, GLOBAL_HEADERS_UPDATE, HEADERS_STORE } from '../../../fabric/fabric';

const REFRESH_RETRIES = 3;

export enum RequestCorsMode {
    SAME_ORIGIN = 'same-origin',
    NO_CORS = 'no-cors',
    CORS = 'cors',
    NAVIGATE = 'navigate'
}

export enum RequestCredentialsMode {
    OMIT = 'omit',
    SAME_ORIGIN = 'same-origin',
    INCLUDE = 'include'
}

export interface RequestConfigureBody {
    corsMode: RequestCorsMode;
    credentialsMode: RequestCredentialsMode;
}

/**
 * REST Service that operates standard functions on behalf of consumers and services.
 */
export class RestService extends AbstractCore implements EventBusEnabled, FabricService {

    public static channel = 'fabric-rest';

    private headers: any;
    private headerStore: BusStore<any>;
    private name: string = 'RESTService';
    private httpClient: HttpClient;
    private globalBaseUri: string;
    private corsMode: string = 'cors';
    private credentialsMode: string = 'same-origin';
    private disableCorsAndCredentials: boolean = false;
    private restStream: MessageHandler;

    public readonly isRestService = true; // need this because rest service gets munged in production.

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

        this.headerStore = this.storeManager.createStore(HEADERS_STORE);
        this.listenForRequests();
        this.log.info(`${this.name} Online`);

        // leave this configurable by consumer, defaults to same host/scheme as hosted UI.
        this.globalBaseUri = '';
    }

    private listenForRequests() {
        this.restStream = this.bus.listenRequestStream(RestService.channel);
        this.restStream.handle((restObject: RestObject, args: MessageArgs) => {

                // configure refresh.
                restObject.refreshRetries = 0;

                if (restObject.request !== HttpRequest.UpdateGlobalHeaders
                    && restObject.request !== HttpRequest.SetRestServiceHostOptions
                    && restObject.request !== HttpRequest.DisableCORSAndCredentials
                    && restObject.request !== HttpRequest.ConfigureCORSAndCredentials) {
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

                        case HttpRequest.ConfigureCORSAndCredentials:
                            this.updateCorsModeAndCredentials(restObject.body);
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
        this.log.info(`Disabling CORS and credentials`, this.getName());
        this.disableCorsAndCredentials = val;
    }

    private updateCorsModeAndCredentials(body: RequestConfigureBody): void {
        this.log.info(`Configuring CORS mode and credentials with CORS mode: ${body.corsMode}, credentials mode: ${body.credentialsMode}`, this.getName());
        this.corsMode = body.corsMode;
        this.credentialsMode = body.credentialsMode;
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
            this.bus.sendErrorMessageWithIdAndVersion(RestService.channel, error,
                                                      args.uuid, args.version, this.getName());
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
        const requestHeaders = {...globalHeaders, ...restObject.headers};

        // set XSRF token if it is enabled
        if (this.fabric.isXsrfTokenEnabled()) {
            requestHeaders[this.fabric.getXsrfTokenStoreKey()] = this.fabric.getXsrfToken();
        }

        this.log.debug(`Rest Service: preparing headers ${requestHeaders}`, this.getName());

        // generate fetch headers, init and request objects.
        const requestHeadersObject = new Headers(requestHeaders);
        const requestInit = this.generateRequestInitObject(restObject, requestHeadersObject);
        let httpRequest;

        // try to create fetch request.
        try {

            const uri: string = this.globalBaseUri + restObject.uri;
            this.log.debug(`Rest Service: Preparing Fetch Request for URI: ${uri}`, this.getName());
            httpRequest = new Request(uri, requestInit);


        } catch (e) {
            this.log.error(`Rest Service: Cannot create request: ${e}`, this.getName());
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
                this.log.error(`Rest Service: Bad REST request: ${restObject.request}`, this.getName());
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
            mode: this.corsMode,
            credentials: this.credentialsMode,
            referrerPolicy: 'origin-when-cross-origin',
        };

        // keeping it until the deprecated methods are removed.
        if (this.disableCorsAndCredentials) {
            this.log.warn('Use of disableCorsAndCredentials is deprecated and strongly discouraged. This will' +
                'conflict with the configurer method updateCorsModeAndCredentials().');
            requestInit.credentials = 'include';
        }

        // GET requests may not have a body
        if (restObject.request !== HttpRequest.Get) {
            try {
                // DELETE requests may also not have a body
                if (restObject.request === HttpRequest.Delete &&
                    !restObject.body.trim()) {
                    return requestInit;
                }

                // check if payload has already been stringified or not
                if (JSON.parse(restObject.body)) {
                    requestInit.body = restObject.body;
                }
            } catch (exp) {
                requestInit.body = JSON.stringify(restObject.body);
            }
        }
        return requestInit;
    }

    offline(): void {
        this.log.info(`RestService (Local / Browser): OFFLINE`, this.getName());
        this.restStream.close();
    }

    online(): void {
        this.log.info(`RestService (Local / Browser): ONLINE`, this.getName());
        this.listenForRequests();
    }
}
