import { AbstractBase } from '../../abstractions/abstract.base';
import { EventBusEnabled, MessageArgs } from '../../../bus.api';
import { TangoTransportAdapterInterface } from '@vmw/tango/transport/TangoTransportAdapterInterface.d';
import { HttpRequest, RestError, RestErrorType, RestObject } from './rest.model';
import { LogLevel } from '../../../log';


const REFRESH_RETRIES = 3;

/**
 * REST Service that operates standard functions on behald of consumers and services.
 */
export class RestService extends AbstractBase implements EventBusEnabled {

    public static channel = 'bifrost-services::REST';

    private httpClient: TangoTransportAdapterInterface;
    private headers: any;

    /**
     * Pass in an implementation of the TangoTransportAdaptorInterface. This allows a drop in supplier for
     * HTTP Calls and what not, decoupled from the actual HTTP implementation, relying on Tango to do the work for us.
     *
     * @param {TangoTransportAdapterInterface} httpClient
     */
     constructor(httpClient: TangoTransportAdapterInterface) {
        super('RESTService');
        this.httpClient = httpClient;
        this.listenForRequests();

        //this.headers.append('Content-Type', 'application/json; charset=utf-8');
        //this.headers.append('Accept', 'application/json');

    }

    private listenForRequests() {
        this.bus.listenRequestStream(RestService.channel)
            .handle((restObject: RestObject, args: MessageArgs) => {
                restObject.refreshRetries = 0;
                this.doHttpRequest(restObject, args);
            });
    }


    private handleData(data: any, restObject: RestObject, args: MessageArgs) {
        this.log.group(LogLevel.Verbose, 'REST Request ' + HttpRequest[restObject.request] + ' ' + restObject.uri);
        this.log.verbose('** Received response: ' + data, this.getName());
        this.log.verbose('** Request was: ' + restObject, this.getName());
        this.log.verbose('** Headers were: ' + this.headers, this.getName());
        this.log.groupEnd(LogLevel.Verbose);

        // set response in rest request object
        restObject.response = data;

        // send the object back to whomever was listening for this specific request.
        this.bus.sendResponseMessageWithIdAndVersion(RestService.channel,
            restObject, args.uuid, args.version, this.getName());
    }

    private handleError(error: RestError, restObject: RestObject, args: MessageArgs) {
        this.log.group(LogLevel.Error, 'Http Error: ' + HttpRequest[restObject.request] + ' ' +
            restObject.uri + ' -' + ' ' + error.status);

        this.log.error(error, this.getName());
        this.log.error('** Request was: ' + restObject.body, this.getName());
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
    }


    private doHttpRequest(restObject: RestObject, args: MessageArgs) {
        // handle rest response
        const successHandler = (response: any) => {
            this.handleData(response, restObject, args);
        };

        const errorHandler = (response: any) => {
            this.handleError(response, restObject, args);
        };


        switch (restObject.request) {
            case HttpRequest.Get:

                this.httpClient.get(
                    restObject.uri,
                    restObject.pathParams,
                    restObject.queryStringParams,
                    restObject.headers,
                    successHandler, errorHandler);
                break;

            case HttpRequest.Post:

                this.httpClient.post(
                    restObject.uri,
                    restObject.pathParams,
                    restObject.queryStringParams,
                    restObject.body,
                    restObject.headers,
                    successHandler, errorHandler);
                break;

            case HttpRequest.Patch:

                this.httpClient.patch(
                    restObject.uri,
                    restObject.pathParams,
                    restObject.queryStringParams,
                    restObject.body,
                    restObject.headers,
                    successHandler, errorHandler);

                break;

            case HttpRequest.Put:
                this.httpClient.put(
                    restObject.uri,
                    restObject.pathParams,
                    restObject.queryStringParams,
                    restObject.body,
                    restObject.headers,
                    successHandler, errorHandler);
                break;

            case HttpRequest.Delete:
                this.httpClient.delete(
                    restObject.uri,
                    restObject.pathParams,
                    restObject.queryStringParams,
                    restObject.body,
                    restObject.headers,
                    successHandler, errorHandler);
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

}
