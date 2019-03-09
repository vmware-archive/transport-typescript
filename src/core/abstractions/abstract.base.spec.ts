/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../bus.api';
import { AbstractBase } from './abstract.base';
import { BusTestUtil } from '../../util/test.util';
import { Logger } from '../../log';
import { RestOperations } from '../services/rest/rest.operations';
import { HttpRequest } from '..';

class MyTestClass extends AbstractBase {
    constructor() {
        super('MyTestClass');
    }

    public testDevMode(): void {
        super.enableDevMode();
    }

    public testHostStuff(): void {
        super.setGlobalRestServiceHostOptions('melody', 'baby://');
    }

    public testHeaderStuff(): void {
        super.setGlobalHttpHeaders({'shh':'baby-is-asleep'});
    }

    public testRestServiceRequest(): void {
        super.restServiceRequest({
            uri: 'http://melody.rose',
            method: HttpRequest.Get,
            successHandler: () => {}
        });
    }
}

describe('Bifröst Abstract Operations [cores/abstractions/abstract.operations]', () => {

    let bus: EventBus;
    let testClass: MyTestClass;
    let log: Logger;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBus();
            testClass = new MyTestClass();
            log = bus.api.logger();
        }
    );

    it('Check enable dev mode works',
        () => {
            spyOn(log, 'warn').and.callThrough();
            testClass.testDevMode();
            expect(log.warn).toHaveBeenCalledWith('Application set to dev mode, not to be used in production')
        }
    );

    it('Check the global rest service host options can be set.',
        () => {
            spyOn(RestOperations.getInstance(), 'setRestServiceHostOptions').and.callThrough();
            testClass.testHostStuff();
            expect(RestOperations.getInstance().setRestServiceHostOptions)
                .toHaveBeenCalledWith('melody','baby://','MyTestClass');
        }
    );

    it('Check the global http headers can be set.',
        () => {
            spyOn(RestOperations.getInstance(), 'setGlobalHttpHeaders').and.callThrough();
            testClass.testHeaderStuff();
            expect(RestOperations.getInstance().setGlobalHttpHeaders)
                .toHaveBeenCalledWith({'shh':'baby-is-asleep'}, 'MyTestClass');
        }
    );

    it('Check a rest service request can be made..',
        () => {
            spyOn(RestOperations.getInstance(), 'restServiceRequest').and.callThrough();
            testClass.testRestServiceRequest();
            expect(RestOperations.getInstance().restServiceRequest).toHaveBeenCalled();
        }
    );
});
