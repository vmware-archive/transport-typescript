/*
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BusTransaction, EventBusEnabled } from '../../bus.api';
import { AbstractCore } from './abstract.core';
import { RestOperation, RestOperations } from '../services/rest/rest.operations';
import { RequestCorsMode, RequestCredentialsMode } from '../services/rest/rest.service';

/**
 * Provides any class access to the EventBus, Rest Operations and higher level operations.
 */

export abstract class AbstractBase extends AbstractCore implements EventBusEnabled {

    protected name: string;
    protected restOperations: RestOperations;

    /**
     * Make a call to the rest service.
     * @param operation the operation you want to run
     */
    protected restServiceRequest(operation: RestOperation): BusTransaction {
        return this.restOperations.restServiceRequest(operation, this.getName());
    }

    /**
     * Set global HTTP headers (made for all calls)
     * @param headers headers will be set for all remote REST calls.
     */
    protected setGlobalHttpHeaders(headers: any) {
        this.restOperations.setGlobalHttpHeaders(headers, this.getName());
    }

    /**
     * Change the global host and scheme for local RestService
     * @param host can be a host or an ip, with port.
     * @param scheme 'https' or 'http', supports both
     */
    protected setGlobalRestServiceHostOptions(host: string, scheme: string) {
        this.restOperations.setRestServiceHostOptions(host, scheme, this.getName());
    }

    /**
     * Enable automatic XSRF token handling.
     */
    protected enableXsrfTokenHandling() {
        this.fabric.setXsrfTokenEnabled(true);
    }

    /**
     * Disable automatic XSRF token handling.
     */
    protected disableXsrfTokenHandling() {
        this.fabric.setXsrfTokenEnabled(false);
    }

    /**
     * Enable Dev Mode.
     * > Disables CORS and credentials for local RestService
     * @deprecated See {@link disableCorsAndCredentials}
     */
    protected enableDevMode() {
        this.log.warn(`Application set to dev mode, not to be used in production`);
        this.restOperations.disableCorsAndCredentials(this.getName());
    }

    /**
     * Configure CORS and credentials policies.
     * @param corsMode
     * @param credentialsMode
     */
    protected configureCorsAndCredentials(corsMode: RequestCorsMode, credentialsMode: RequestCredentialsMode) {
        this.restOperations.configureCorsAndCredentials(corsMode, credentialsMode, this.getName());
    }

    getName(): string {
        return this.name;
    }

    protected constructor(name: string) {
        super();
        this.restOperations = RestOperations.getInstance();
        this.name = name;
    }

}
