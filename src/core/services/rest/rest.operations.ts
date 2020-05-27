/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { AbstractCore } from '../../abstractions/abstract.core';
import { BusTransaction, MessageFunction, SentFrom, TransactionType } from '../../../bus.api';
import { UUID } from '../../../bus';
import { HttpRequest, RestError, RestObject } from './rest.model';
import { GeneralUtil } from '../../../util/util';
import { RequestCorsMode, RequestCredentialsMode, RestService } from './rest.service';
import { FabricUtil } from '../../../fabric/fabric.util';

export interface RestOperation {
    id?: UUID;
    uri: string;
    method: HttpRequest;
    body?: any;
    pathParams?: any;
    queryParams?: any;
    headers?: any;
    apiClass?: string;
    sentFrom?: string;
    successHandler: MessageFunction<any>;
    errorHandler?: MessageFunction<any>;
}


export class RestOperations extends AbstractCore {

    protected static _instance: RestOperations;

    /**
     * Kill instance of service.
     */
    public static destroy(): void {
        this._instance = null;
    }

    public static getInstance(): RestOperations {
        return this._instance || (this._instance = new RestOperations());
    }

    public readonly id: UUID;

    constructor() {
        super();
        this.id = GeneralUtil.genUUID();
    }

    public setGlobalHttpHeaders(headers: any, from: SentFrom) {

        const restRequestObject: RestObject = new RestObject(
            HttpRequest.UpdateGlobalHeaders,
            null,
            null,
            headers
        );

        this.bus.sendRequestMessage(RestService.channel, restRequestObject, from);
    }

    /**
     * Dev use only, don't use this in production.
     *
     * @deprecated This method is deprecated in lieu of the new method that would allow full combinations of
     * CORS and credentials modes. See {@link configureCorsAndCredentials}.
     */
    public disableCorsAndCredentials(from: SentFrom) {

        const restRequestObject: RestObject = new RestObject(
            HttpRequest.DisableCORSAndCredentials,
            null,
            null
        );

        this.bus.sendRequestMessage(RestService.channel, restRequestObject, from);
    }

    /**
     * Configure cross-origin requests (CORS) and credentials policies with Fetch API.
     * CORS mode tells whether cross-origin requests can be made successfully across domains.
     * Credentials is Fetch equivalent of `XmlHttpRequest::withCredentials` that indicates whether the user agent
     * should send cookies from one domain to another. The default values for the CORS and credentials are
     * `cors` and `same-origin`, respectively and they require their server counterpart configured accordingly
     * to work properly. See the following references for more information.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     *
     * @param corsMode
     * @param credentialsMode
     * @param from
     */
    public configureCorsAndCredentials(corsMode: RequestCorsMode,
                                       credentialsMode: RequestCredentialsMode, from: SentFrom) {
        const restRequestObject: RestObject = new RestObject(
            HttpRequest.ConfigureCORSAndCredentials,
            null,
            {corsMode, credentialsMode}
        );

        this.bus.sendRequestMessage(RestService.channel, restRequestObject, from);
    }

    /**
     * Change default host and scheme (defaults to same host and scheme)
     * @param host hostname/ip/port etc. This is just a string
     * @param scheme 'http', 'https'
     * @param from who is making this call?
     */
    public setRestServiceHostOptions(host: string, scheme: string = 'https', from: SentFrom) {

        const restRequestObject: RestObject = new RestObject(
            HttpRequest.SetRestServiceHostOptions,
            `${scheme}://${host}`,
            null
        );

        this.bus.sendRequestMessage(RestService.channel, restRequestObject, from);
    }

    public restServiceRequest(operation: RestOperation, from: SentFrom): BusTransaction {

        const body = (operation.body ? operation.body : {});
        const headers = (operation.headers ? operation.headers : {});
        const queryParams = (operation.queryParams ? operation.queryParams : {});
        const pathParams = (operation.pathParams ? operation.pathParams : {});
        const apiClass = (operation.apiClass ? operation.apiClass : undefined);
        const senderName = (operation.sentFrom ? operation.sentFrom : undefined);

        const restRequestObject: RestObject = new RestObject(
            operation.method,
            operation.uri,
            body,
            headers,
            queryParams,
            pathParams,
            apiClass,
            senderName
        );

        let id: UUID;

        if (operation.id) {
            id = operation.id;
        } else {
            id = GeneralUtil.genUUID();
        }
        restRequestObject.id = id;

        // set the payload
        let requestPayload: any = restRequestObject;

        // check if the channel is galactic, if so, wrap in a request object
        if (this.bus.isGalacticChannel(RestService.channel)) {
            let apiClassValue = operation.apiClass;
            if (!operation.apiClass) {
                apiClassValue = 'java.lang.String';
            }

            let javaRest = {
                apiClass: apiClassValue, // this allows us to deal with any response.
                uri: operation.uri,
                method: operation.method,
                body: operation.body,
                responseType: 'string',
                headers: operation.headers,
                sentFrom: from
            };

            requestPayload = this.fabric.generateFabricRequest(operation.method, javaRest);
        }

        this.log.debug(`restServiceRequest fired for URI: ${operation.uri} with id: ${id}`, from);

        const transaction = this.bus.createTransaction(TransactionType.ASYNC, 'rest-operations-' + id);
        transaction.sendRequest(RestService.channel, requestPayload);

        transaction.onComplete(
            (restResponseObject: RestObject[]) => {
                const fabricResponseObject: any = restResponseObject[0];
                let responseObject = fabricResponseObject.payload;

                // check if this is a response coming from the backend.
                // if so, unpack the JSON payload
                if (FabricUtil.isPayloadFabricResponse(fabricResponseObject)) {

                    // try to parse, some payloads are raw, some are ready to go,
                    try {
                        responseObject = JSON.parse(fabricResponseObject.payload);

                    } catch {
                        // can't be unpacked, must be good to go - or completely invalid.
                    }

                    this.log.debug(
                        `Received Fabric REST response for request: ${operation.uri}`
                        , from);

                } else {
                    responseObject = fabricResponseObject.response;
                    this.log.debug(
                        `Received Browser REST response for request: ${operation.uri}`
                        , from);

                }
                operation.successHandler(responseObject);
            }
        );

        if (operation.errorHandler) {
            transaction.onError<RestError>(
                (error: any) => {

                    if (error.payload) {
                        error = error.payload;
                    }

                    operation.errorHandler(error);
                }
            );
        }

        transaction.commit();
        return transaction;
    }

}
