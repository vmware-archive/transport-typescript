/**
 * Copyright(c) VMware Inc., 2017-2018
 */

import { AbstractBase } from './abstract.base';

/**
 * This is the generic abstract mock service. It is called with references to the actual service and
 * the associated mock ReST service and provides a proxy reference to both. This enables component unit tests
 * to only create this mock service and not have to know about how the actual services and their mock ReST services
 * are created. The flags from the ReST service is intercepted here and passed through.
 */

export class AbstractAutoServiceMock extends AbstractBase {
    protected debug = false;

    constructor(name: string) {
        super(name);
    }
}
