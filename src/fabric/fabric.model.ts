/**
 * Copyright(c) VMware Inc. 2019
 */

export enum Stores {
    FabricConnection = 'fabric-connection',
    XsrfToken = 'xsrf-token'
}

export enum RequestHeaderConsts {
    CSP_AUTH_TOKEN = 'csp-auth-token',
    CUSTOM_HEADER_PREFIX = 'X-',
    XSRF_TOKEN = 'XSRF-TOKEN'
}

export enum FabricConnectionStoreKey {
    State = 'state',
}
