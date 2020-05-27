/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

// This is a mock of the httpClient

import { HttpClient } from './http.client';

export class MockHttpClient implements HttpClient {
    public mustFail = false;
    public errCode = 200;

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
            successHandler(`${request.method} called`);
        }
    }
}
