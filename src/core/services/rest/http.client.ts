/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export interface HttpClient {
    get(request: Request, successHandler: Function, failureHandler: Function): void;
    post(request: Request, successHandler: Function, failureHandler: Function): void;
    put(request: Request, successHandler: Function, failureHandler: Function): void;
    patch(request: Request, successHandler: Function, failureHandler: Function): void;
    delete(request: Request, successHandler: Function, failureHandler: Function): void;
}
