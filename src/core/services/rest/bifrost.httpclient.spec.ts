/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../../bus.api';
import { Logger, LogLevel } from '../../../log';
import { BusTestUtil } from '../../../util/test.util';
import { BifrostHttpclient } from './bifrost.httpclient';

import * as fetchMock from 'fetch-mock';
import { HttpRequest } from './rest.model';
import { GeneralError } from '../../model/error.model';

describe('Bifröst HTTP Client [cores/services/rest/bifrost.httpclient]', () => {

    let bus: EventBus;
    let log: Logger;
    let client: BifrostHttpclient;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
            bus.api.silenceLog(true);
            bus.api.suppressLog(true);
            bus.api.enableMonitorDump(false);
            bus.enableDevMode();
            log = bus.api.logger();
            client = new BifrostHttpclient();
        }
    );

    afterEach(
        () => {
            fetchMock.reset();
        }
    );

    it('Can make valid GET fetch request',
        (done) => {
            fetchMock.get('http://appfabric.vmware.com/', 'ok');

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.get('http://appfabric.vmware.com/', 500 );

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.get('http://appfabric.vmware.com/', 400);

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.post('http://appfabric.vmware.com/', 'ok');

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Post, body: 'hi!'});
            client.post(request,
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
            fetchMock.post('http://appfabric.vmware.com/', 500);

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Post, body: 'hi!'});
            client.post(request,
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
            fetchMock.post('http://appfabric.vmware.com/', 400 );

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Post, body: 'hi!'});
            client.post(request,
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
            fetchMock.patch('http://appfabric.vmware.com/', 'ok');

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Patch, body: 'hi!'});
            client.patch(request,
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
            fetchMock.patch('http://appfabric.vmware.com/', 500);

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Patch, body: 'hi!'});
            client.patch(request,
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
            fetchMock.patch('http://appfabric.vmware.com/', 400 );

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Patch, body: 'hi!'});
            client.patch(request,
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
            fetchMock.put('http://appfabric.vmware.com/', 'ok');

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Put, body: 'hi!'});
            client.put(request,
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
            fetchMock.put('http://appfabric.vmware.com/', 500);

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Put, body: 'hi!'});
            client.put(request,
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
            fetchMock.put('http://appfabric.vmware.com/', 400 );

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Put, body: 'hi!'});
            client.put(request,
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
            fetchMock.delete('http://appfabric.vmware.com/', 'ok');

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Delete});
            client.delete(request,
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
            fetchMock.delete('http://appfabric.vmware.com/', 500);

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Delete});
            client.delete(request,
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
            fetchMock.delete('http://appfabric.vmware.com/', 400 );

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Delete});
            client.delete(request,
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
            fetchMock.get('http://appfabric.vmware.com/', {
                status: 500,
                body: JSON.stringify({message: 'oh dear.'})
            });

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.get('http://appfabric.vmware.com/', {
                status: 500,
                body: JSON.stringify({error_messages: ['oh', 'deary', 'me']})
            });

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.get('http://appfabric.vmware.com/', {
                status: 500,
                body: JSON.stringify({error_code: 500})
            });

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
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
            fetchMock.get('http://appfabric.vmware.com/', {
                status: 500,
                body: JSON.stringify({status: 500})
            });

            let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
            client.get(request,
                () => { },
                (failureObject: GeneralError) => {
                    expect(failureObject.status).toEqual(500);
                    done();
                }
            );
        }
    );

    it('Can handle TypeError', (done) => {
        fetchMock.get('http://appfabric.vmware.com/', {
            throws: new TypeError('network error')
        });

        let request = new Request('http://appfabric.vmware.com', {method: HttpRequest.Get});
        client.get(request,
            () => { },
            (failureObject: GeneralError) => {
            console.log(failureObject.message);
            expect(failureObject.message).toContain('Fatal HTTP Error:');
            done();
            }
        );
    });
});
