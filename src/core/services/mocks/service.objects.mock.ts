/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

// These are mock objects for use by FakeService
// They are only used for tests and excluded from production build

import { AbstractMessageObject } from '../../abstractions/abstract.messageobject';
import { ServiceVersion } from '../../abstractions/service.version';


// Enumeration of all requests handled by FakeService
export enum FakeRequest {
    BadRequest,
    RestRelay,          // Make a RestService request
    ApiCall,            // Simulate a call to an API class from Apigen
    GetServiceVersion   // Return the version fo this service
}

export class FakeChannel {
    public static request = '#-fake-service-request';
}

// This is the request object with payload to relay to RestService
export class FakeRestRelayRequestObject  extends AbstractMessageObject< FakeRequest, any > {
    constructor(requestChannel: string, payload: any) {
        super(FakeRequest.RestRelay, requestChannel, payload);
    }
}

// This is the response object for the relay to RestService
export class FakeRestRelayResponseObject extends AbstractMessageObject< FakeRequest, any > {
    constructor(response?: any) {
        super(FakeRequest.RestRelay, '', response);
    }
}

// This is the request object for the GetServiceVersionRequest to FakeService
export class FakeApiCallRequestObject extends AbstractMessageObject< FakeRequest, any > {
    constructor(requestChannel: string, payload: string) {
        super(FakeRequest.ApiCall, requestChannel, payload);
    }
}

// This is the response object for the GetServiceVersionRequest to FakeService
export class FakeApiCallResponseObject extends AbstractMessageObject< FakeRequest, any > {
    constructor(response?: ServiceVersion) {
        super(FakeRequest.ApiCall, '', response);
    }
}

// This is the request object for the GetServiceVersionRequest to FakeService
export class FakeGetServiceVersionRequestObject extends AbstractMessageObject< FakeRequest, any > {
    constructor(requestChannel: string) {
        super(FakeRequest.GetServiceVersion, requestChannel);
    }
}

// This is a generic request object for testing bad requests
export class FakeGenericRequestObject extends AbstractMessageObject< FakeRequest, any > {
    constructor(requestChannel: string, request: FakeRequest) {
        super(request, requestChannel);
    }
}

// This is the response object for the GetServiceVersionRequest to FakeService
export class FakeGetServiceVersionResponseObject extends AbstractMessageObject< FakeRequest, ServiceVersion > {
    constructor(response?: ServiceVersion) {
        super(FakeRequest.GetServiceVersion, '', response);
    }
}

// Union types
export type FakeRequestObject =
    FakeGetServiceVersionRequestObject
    | FakeRestRelayRequestObject
    | FakeApiCallRequestObject
    | FakeGenericRequestObject;

export type FakeResponseObject =
    FakeRestRelayResponseObject
    | FakeApiCallResponseObject
    | FakeGetServiceVersionResponseObject;
