/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

// This is a mock of the httpClient

import { HttpClient } from './http.client';

export class MockHttpClient implements HttpClient {
    public mustFail = false;
    public errCode = 200;

    delete(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(uri, requestInit, successHandler, failureHandler);
    }

    get(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(uri, requestInit, successHandler, failureHandler);
    }

    patch(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(uri, requestInit, successHandler, failureHandler);
    }

    post(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(uri, requestInit, successHandler, failureHandler);
    }

    put(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(uri, requestInit, successHandler, failureHandler);
    }

    private httpOperation(
        uri: string, requestInit: RequestInit,
        successHandler: Function,
        errorHandler: Function
    ) {
        if (this.mustFail) {
            if (this.errCode !== 401) {     // to simulate unknown error
                errorHandler(null);
                return;
            }

            const err: any = {};
            err['status'] = this.errCode;
            err['message'] = 'Fake Error';
            errorHandler(err);
        } else {
            successHandler(`${requestInit.method} called`);
        }
    }
}
