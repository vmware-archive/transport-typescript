/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../bus.api';
import { BusTestUtil } from '../../util/test.util';
import { AbstractAutoRestMock } from './abstract.autorestmock';
import { HttpRequest, RestError, RestObject } from '..';

class AutoRestTest extends AbstractAutoRestMock {
    constructor() {
        super('AutoTestTest', 'myself');
    }

    public testHandleData(): void {
        super.handleData('test', new RestObject(HttpRequest.Get, 'test'));
    }

    public testHandleDataWithArgs(): void {
        super.handleData('test', new RestObject(HttpRequest.Get, 'test'),
            {version: 1, from: 'nowhere', uuid: '123'});
    }

    public testHandleError(): void {
        super.handleError(new RestError('error'), new RestObject(HttpRequest.Get, 'test'),
            {version: 1, from: 'nowhere', uuid: '123'});
    }

    public testUnHandledError(): void {
        super.unhandledError(new RestObject(HttpRequest.Get, 'test'), 'test');
    }

    private handleRequest (method: HttpRequest) {
        super.handleServiceRequest(new RestObject(method, 'test',
            null, null, null, null, null, 'myself'),
            {version: 1, from: 'nowhere', uuid: '123'})
    }

    public testHandleServiceGetRequest(): void {
        this.handleRequest(HttpRequest.Get);
    }

    public testHandleServiceMustFail(): void {
        this.mustFail = true;
        this.handleRequest(HttpRequest.Get);
    }

    public testHandleServiceForceResponse(): void {
        this.forceResponse = 'hello';
        this.handleRequest(HttpRequest.Get);
    }

    public testHandleServicePostRequest(): void {
        this.handleRequest(HttpRequest.Post);
    }

    public testHandleServicePatchRequest(): void {
        this.handleRequest(HttpRequest.Patch);
    }

    public testHandleServicePutRequest(): void {
        this.handleRequest(HttpRequest.Put);
    }

    public testHandleServiceDeleteRequest(): void {
        this.handleRequest(HttpRequest.Delete);
    }

    public testHandleServiceUnknownRequest(): void {
        this.handleRequest(HttpRequest.DisableCORSAndCredentials);
    }

    protected httpGet(restRequestObject: RestObject) {
        super.httpGet(restRequestObject);
        this.log.verbose('GET request handled');
    }

    protected httpPost(restRequestObject: RestObject) {
        super.httpPost(restRequestObject);
        this.log.verbose('POST request handled');
    }

    protected httpPatch(restRequestObject: RestObject) {
        super.httpPatch(restRequestObject);
        this.log.verbose('PATCH request handled');
    }

    protected httpPut(restRequestObject: RestObject) {
        super.httpPut(restRequestObject);
        this.log.verbose('PUT request handled');
    }

    protected httpDelete(restRequestObject: RestObject) {
        super.httpDelete(restRequestObject);
        this.log.verbose('DELETE request handled');
    }
}

describe('Bifröst Abstract AutoRestMock [cores/abstractions/abstract.autorestmock.spec]', () => {

    let bus: EventBus;
    let test: AutoRestTest;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBus();
            test = new AutoRestTest();
        }
    );

    it('Check handleData() works',
        () => {
            spyOn(bus, 'sendResponseMessage').and.callThrough();
            test.testHandleData();
            expect(bus.sendResponseMessage).toHaveBeenCalled();
        }
    );

    it('Check handleData() works with arguments',
        () => {
            spyOn(bus, 'sendResponseMessageWithId').and.callThrough();
            test.testHandleDataWithArgs();
            expect(bus.sendResponseMessageWithId).toHaveBeenCalled();
        }
    );

    it('Check handleError() works',
        () => {
            spyOn(bus, 'sendErrorMessageWithId').and.callThrough();
            test.testHandleError();
            expect(bus.sendErrorMessageWithId).toHaveBeenCalled();
        }
    );

    it('Check unhandledError() works',
        () => {
            spyOn(bus, 'sendErrorMessage').and.callThrough();
            test.testUnHandledError();
            expect(bus.sendErrorMessage).toHaveBeenCalled();
        }
    );

    it('Check handleServiceRequest works for GET',
        () => {
            spyOn(bus.logger, 'verbose').and.callThrough();
            test.testHandleServiceGetRequest();
            expect(bus.logger.verbose).toHaveBeenCalledWith('GET request handled');
        }
    );

    it('Check handleServiceRequest works for POST',
        () => {
            spyOn(bus.logger, 'verbose').and.callThrough();
            test.testHandleServicePostRequest();
            expect(bus.logger.verbose).toHaveBeenCalledWith('POST request handled');
        }
    );

    it('Check handleServiceRequest works for PATCH',
        () => {
            spyOn(bus.logger, 'verbose').and.callThrough();
            test.testHandleServicePatchRequest();
            expect(bus.logger.verbose).toHaveBeenCalledWith('PATCH request handled');
        }
    );

    it('Check handleServiceRequest works for PUT',
        () => {
            spyOn(bus.logger, 'verbose').and.callThrough();
            test.testHandleServicePutRequest();
            expect(bus.logger.verbose).toHaveBeenCalledWith('PUT request handled');
        }
    );

    it('Check handleServiceRequest works for DELETE',
        () => {
            spyOn(bus.logger, 'verbose').and.callThrough();
            test.testHandleServiceDeleteRequest();
            expect(bus.logger.verbose).toHaveBeenCalledWith('DELETE request handled');
        }
    );

    it('Check handleServiceRequest works for an unknown request',
        () => {
            test.testHandleServiceUnknownRequest();
            expect(bus.logger)
        }
    );

    it('Check handleServiceRequest works for a forced error response',
        () => {
            spyOn(bus, 'sendErrorMessageWithId').and.callThrough();
            test.testHandleServiceMustFail();
            expect(bus.sendErrorMessageWithId).toHaveBeenCalled();
        }
    );

    it('Check forceResponse works',
        () => {
            spyOn(bus, 'sendResponseMessageWithId').and.callThrough();
            test.testHandleServiceForceResponse();
            expect(bus.sendResponseMessageWithId).toHaveBeenCalled();
        }
    );

});
