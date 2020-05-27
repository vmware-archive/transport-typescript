/*
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { HttpClient } from './http.client';
import { GeneralError } from '../../model/error.model';

export class TransportHttpclient implements HttpClient {

    delete(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    get(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    patch(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    post(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    put(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    private httpOperation(
        request: Request,
        successHandler: Function,
        errorHandler: Function
    ) {

        // use magic fetch!
        fetch(
            request
        ).then(
            (response: Response) => {
                if (response.ok) {
                    return response.text();
                }
                throw response;
            }
        ).then(
            (response) => {
                try {
                    successHandler(JSON.parse(response));
                } catch (e) {
                    successHandler(response);
                }
            }
        ).catch(
            (error: Response | TypeError) => {
                try {
                    if (error instanceof TypeError) {
                        // handle network errors at the final catch block
                        throw error;
                    } else {
                        error.text().then(
                            resp => {
                                let message: string = `HTTP Error ${error.status}: ${error.statusText}`;
                                let status: number = error.status;
                                let errorCode: string;
                                let respErrorObject: any;

                                try {
                                    respErrorObject = JSON.parse(resp);

                                    // if the response has a message property, add to the response.
                                    if (respErrorObject.hasOwnProperty('message')) {
                                        message += ` -  ${respErrorObject.message}`;
                                    }

                                    if (respErrorObject.hasOwnProperty('error_messages')
                                        && Array.isArray(respErrorObject.error_messages)) {
                                        message += ` -  ${respErrorObject.error_messages.join(', ')}`;
                                    }

                                    if (respErrorObject.hasOwnProperty('error_code')
                                        && respErrorObject.error_code != null) {
                                        errorCode = respErrorObject.error_code;
                                    }

                                } catch (err) {
                                    // use base error message set before try/catch block.
                                }

                                // create an error, attach the message and status code, and then also attach
                                // the original object parsed from the API error response.

                                let returnError: GeneralError = new GeneralError(message, status);

                                if (respErrorObject) {
                                    returnError.errorObject = respErrorObject;
                                }

                                if (errorCode) {
                                    returnError.errorCode = respErrorObject;
                                }

                                // send the error back.
                                errorHandler(returnError);
                            }
                        );
                    }
                } catch (e) {
                    errorHandler(new GeneralError(`Fatal HTTP Error: ${e}`));
                }
            }
        );
    }
}
