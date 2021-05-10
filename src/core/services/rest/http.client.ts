/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export interface HttpClient {
    get(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void;
    post(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void;
    put(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void;
    patch(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void;
    delete(uri: string, requestInit: RequestInit, successHandler: Function, failureHandler: Function): void;
}
