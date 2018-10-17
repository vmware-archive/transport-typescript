/**
 * Copyright(c) VMware Inc., 2016, 2017
 */


import { AbstractAutoService } from './abstract.autoservice';
import { SERVICE_ERROR } from './abstract.service';
import { HttpRequest, RestError, RestObject } from '..';
import { MessageArgs } from '../../bus.api';
import { RestService } from '../services/rest/rest.service';

export const MOCK_FAKE_ERROR = 400;
export const MOCK_UNIMPLEMENTED_ERROR = 444;

/**
 * This is the abstract class for deriving xxx.autorest.mock.ts files in all the services.
 */

export abstract class AbstractAutoRestMock extends AbstractAutoService<RestObject, RestObject> {
    public mustFail = false;
    public forceResponse: any;
    protected name = 'AbstractAutoRestMock';
    private listensTo: string;
    private restError = new RestError('Fake Error.', MOCK_FAKE_ERROR, 'fakeUri');
    protected debug = false;

    constructor(name: string, listensTo: string) {
        super(name, RestService.channel);
        this.name = name;
        this.listensTo = listensTo;
    }

    protected handleData(data: any, restObject: RestObject, args?: MessageArgs) {
        restObject.response = data;
        if (args) {
            this.bus.sendResponseMessageWithId(RestService.channel, restObject, args.uuid, this.getName());
        } else {
            this.bus.sendResponseMessage(RestService.channel, restObject, this.getName());
        }
    }

    protected handleError(err: RestError, restObject: RestObject, args?: MessageArgs) {
        if (args) {
            this.bus.sendErrorMessageWithId(RestService.channel, err, args.uuid, this.getName());
        } else {
            this.bus.sendErrorMessage(RestService.channel, err, this.getName());
        }
    }

    protected unhandledError(restRequestObject: RestObject, apiClass: string) {
        const errMsg = this.name + ': Unhandled API Class (' + apiClass + ') request: ' + restRequestObject.request;
        this.log.error(errMsg);
        this.handleError(new RestError(errMsg, MOCK_UNIMPLEMENTED_ERROR, ''), restRequestObject);
    }

    protected handleServiceRequest(restRequestObject: RestObject, requestArgs?: MessageArgs) {

        // ignore requestors that are not from "our" service
        if (restRequestObject.senderName !== this.listensTo) {
            return;
        }

        // handle forced backend error
        if (this.mustFail) {
            this.handleError(this.restError, restRequestObject, requestArgs);
            return;
        }

        // This allows a specific response to be sent back
        if (this.forceResponse) {
            this.handleData(this.forceResponse, restRequestObject, requestArgs);
            return;
        }

        switch (restRequestObject.request) {
            case HttpRequest.Get:
                this.httpGet(restRequestObject, requestArgs);
                break;

            case HttpRequest.Post:
                this.httpPost(restRequestObject, requestArgs);
                break;

            case HttpRequest.Put:
                this.httpPut(restRequestObject, requestArgs);
                break;

            case HttpRequest.Patch:
                this.httpPatch(restRequestObject, requestArgs);
                break;

            case HttpRequest.Delete:
                this.httpDelete(restRequestObject, requestArgs);
                break;

            default:
                this.restError = new RestError(this.getName() + ': Unknown request: '
                    + restRequestObject.request,
                    SERVICE_ERROR,
                    'fakeUri');
                this.handleError(this.restError, restRequestObject, requestArgs);
        }
    }

    private unimplemented(f: string, r: RestObject) {
        this.log.error(this.getName() + ' Unimplemented mock handler for HTTP ' + f + '!' + r);
    }

    // These should be overridden in the derived class

    protected httpGet(restRequestObject: RestObject, args?: MessageArgs) {
        this.unimplemented('GET', restRequestObject);
    }

    protected httpPost(restRequestObject: RestObject, args?: MessageArgs) {
        this.unimplemented('POST', restRequestObject);
    }

    protected httpPut(restRequestObject: RestObject, args?: MessageArgs) {
        this.unimplemented('PUT', restRequestObject);
    }

    protected httpPatch(restRequestObject: RestObject, args?: MessageArgs) {
        this.unimplemented('PATCH', restRequestObject);
    }

    protected httpDelete(restRequestObject: RestObject, args?: MessageArgs) {
        this.unimplemented('DELETE', restRequestObject);
    }
}
