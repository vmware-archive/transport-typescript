/*
 * Copyright 2019-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { EventBus } from '../../../bus.api';
import { Logger, LogLevel } from '../../../log';
import { BusTestUtil } from '../../../util/test.util';
import { TransportHttpclient } from './transport.httpclient';

import * as fetchMock from 'fetch-mock';
import { HttpRequest } from './rest.model';
import { GeneralError } from '../../model/error.model';

describe('Transport HTTP Client [cores/services/rest/transport.httpclient]', () => {

    let bus: EventBus;
    let log: Logger;
    let client: TransportHttpclient;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);
            bus.enableDevMode();
            log = bus.api.logger();
            client = new TransportHttpclient();
        }
    );

    afterEach(
        () => {
            fetchMock.reset();
        }
    );

    it('Can make valid GET fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, 'ok');
            client.get(url, 
                {method: HttpRequest.Get},
                (responseObject: any) => {
                    expect(responseObject).toEqual('ok');
                    done();
                },
                () => {}
            );
        }
    );

    it('Can make GET fetch request that handles server error',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, 500 );

            client.get(url, 
                {method: HttpRequest.Get},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error');
                    done();
                }
            );
        }
    );

    it('Can make bad GET fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get('http://appfabric.vmware.com/', 400);

            client.get(url, 
                {method: HttpRequest.Get},
                () => {
                },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 400: Bad Request');
                    done();
                }
            );
        }
    );

    it('Can make valid POST fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.post(url, 'ok');

            client.post(url,
                    {method: HttpRequest.Post, body: 'hi!'},
                    (responseObject: any) => {
                    expect(responseObject).toEqual('ok');
                    done();
                },
                () => {}
            );
        }
    );

    it('Can make POST fetch request that handles server error',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.post(url, 500);

            client.post(url,
                {method: HttpRequest.Post, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error');
                    done();
                }
            );
        }
    );

    it('Can make bad POST fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.post(url, 400 );

            client.post(url,
                {method: HttpRequest.Post, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 400: Bad Request');
                    done();
                }
            );
        }
    );

    it('Can make valid PATCH fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.patch(url, 'ok');

            client.patch(url,
                {method: HttpRequest.Patch, body: 'hi!'},
                (responseObject: any) => {
                    expect(responseObject).toEqual('ok');
                    done();
                },
                () => {}
            );
        }
    );

    it('Can make PATCH fetch request that handles server error',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.patch(url, 500);

            client.patch(url,
                {method: HttpRequest.Patch, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error');
                    done();
                }
            );
        }
    );

    it('Can make bad PATCH fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.patch(url, 400 );

            client.patch(url,
                {method: HttpRequest.Patch, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 400: Bad Request');
                    done();
                }
            );
        }
    );

    it('Can make valid PUT fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.put(url, 'ok');

            client.put(url,
                {method: HttpRequest.Put, body: 'hi!'},
                (responseObject: any) => {
                    expect(responseObject).toEqual('ok');
                    done();
                },
                () => {}
            );
        }
    );

    it('Can make PUT fetch request that handles server error',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.put(url, 500);

            client.put(url,
                {method: HttpRequest.Put, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error');
                    done();
                }
            );
        }
    );

    it('Can make bad PUT fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.put(url, 400 );

            client.put(url,
                {method: HttpRequest.Put, body: 'hi!'},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 400: Bad Request');
                    done();
                }
            );
        }
    );

    it('Can make valid DELETE fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.delete(url, 'ok');

            client.delete(url,
                {method: HttpRequest.Delete},
                (responseObject: any) => {
                    expect(responseObject).toEqual('ok');
                    done();
                },
                () => {}
            );
        }
    );

    it('Can make DELETE fetch request that handles server error',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.delete(url, 500);

            client.delete(url,
                {method: HttpRequest.Delete},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error');
                    done();
                }
            );
        }
    );

    it('Can make bad DELETE fetch request',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.delete(url, 400 );

            client.delete(url,
                {method: HttpRequest.Delete},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 400: Bad Request');
                    done();
                }
            );
        }
    );

    it('Can handle error message object (mainly from ss-base consumers)',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, {
                status: 500,
                body: JSON.stringify({message: 'oh dear.'})
            });

            client.get(url,
                {method: HttpRequest.Get},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error -  oh dear.');
                    done();
                }
            );
        }
    );

    it('Can handle error messages array object (mainly from ss-base consumers)',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, {
                status: 500,
                body: JSON.stringify({error_messages: ['oh', 'deary', 'me']})
            });

            client.get(url,
                {method: HttpRequest.Get},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.message).toEqual('HTTP Error 500: Internal Server Error -  oh, deary, me');
                    done();
                }
            );
        }
    );

    it('Can handle error code (mainly from ss-base consumers)',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, {
                status: 500,
                body: JSON.stringify({error_code: 500})
            });

            client.get(url,
                {method: HttpRequest.Get},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.status).toEqual(500);
                    expect(failureObject.errorCode.error_code).toEqual(500);
                    done();
                }
            );
        }
    );

    it('Can handle error status (mainly from ss-base consumers)',
        (done) => {
            const url = 'http://appfabric.vmware.com';
            fetchMock.get(url, {
                status: 500,
                body: JSON.stringify({status: 500})
            });

            client.get(url,
                {method: HttpRequest.Get},
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.status).toEqual(500);
                    done();
                }
            );
        }
    );

    it('Can handle TypeError', (done) => {
        const url = 'http://appfabric.vmware.com';
        fetchMock.get(url, {
            throws: new TypeError('network error')
        });

        client.get(url,
            {method: HttpRequest.Get},
            () => { },
            (failureObject: GeneralError) => {
            console.log(failureObject.message);
            expect(failureObject.message).toContain('Fatal HTTP Error:');
            done();
            }
        );
    });
});
