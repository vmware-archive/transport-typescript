import { EventBusEnabled, MessageArgs } from '../../../bus.api';
import { HttpRequest, RestError, RestErrorType, RestObject } from './rest.model';
import { LogLevel } from '../../../log';
import { BusStore } from '../../../store.api';
import { AbstractCore } from '../../abstractions/abstract.core';
import { GeneralError } from '../../model/error.model';

const REFRESH_RETRIES = 3;
const GLOBAL_HEADERS = 'global-headers';
const GLOBAL_HEADERS_UPDATE = 'update';


/**
 * REST Service that operates standard functions on behalf of consumers and services.
 */
export class RestService extends AbstractCore implements EventBusEnabled {

    public static channel = 'bifrost-services::REST';

    private headers: any;
    private headerStore: BusStore<any>;
    private name: string = 'RESTService';

    public getName(): string {
        return this.name;
    }

    constructor() {
        super();
        this.headerStore = this.storeManager.createStore('bifrost::RestService');
        this.listenForRequests();
        this.log.info(`${this.name} Online`);
    }

    private listenForRequests() {
        this.bus.listenRequestStream(RestService.channel)
            .handle((restObject: RestObject, args: MessageArgs) => {
                restObject.refreshRetries = 0;

                if (restObject.request !== HttpRequest.UpdateGlobalHeaders) {
                    this.doHttpRequest(restObject, args);
                } else {
                    this.updateHeaders(restObject.headers);
                }
            });
    }

    private updateHeaders(headers: any): void {
        this.log.info('Updating global headers for outbound request', this.getName());
        this.headerStore.put(GLOBAL_HEADERS, headers, GLOBAL_HEADERS_UPDATE);
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

        // generate fetch headers, init and request objects.
        const requestHeadersObject = new Headers(requestHeaders);
        const requestInit = this.generateRequestInitObject(restObject, requestHeadersObject);
        const httpRequest = new Request(restObject.uri, requestInit);


        switch (restObject.request) {
            case HttpRequest.Get:
            case HttpRequest.Post:
            case HttpRequest.Patch:
            case HttpRequest.Put:
            case HttpRequest.Delete:
                this.httpOperation(httpRequest, successHandler, errorHandler);
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
        };

        // GET requests may not have a body
        if (restObject.request !== HttpRequest.Get) {
            requestInit.body = restObject.body;
        }

        return requestInit;
    }

    private httpOperation(
        request: Request,
        successHandler: Function,
        errorHandler: Function
    ) {
        fetch(
            request
        ).then(
            (response: Response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new TypeError(
                    `HTTP ${request.method} Error: ${response.status}: ${response.statusText}`
                );
            }
        ).then(
            (json: any) => {
                successHandler(JSON.stringify(json));
            }
        ).catch(
            function (error: TypeError) {
                errorHandler(new GeneralError(error.message));
            }
        );
    }
}
