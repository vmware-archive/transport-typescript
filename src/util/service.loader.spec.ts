import { LogLevel } from '../log';
import { EventBus } from '../bus.api';
import { BusTestUtil } from './test.util';
import { ServiceLoader } from './service.loader';

class TestServiceA {
    public booted: boolean = false;

    constructor() {
        this.booted = true;
    }
}

class TestServiceB {
    constructor(public constructorArgA: string, public constructorArgB: string) {
    }
}

describe('Bus Util [util/bus.util.spec]', () => {

    let bus: EventBus;

    beforeEach(
        () => {
            bus = BusTestUtil.bootBusWithOptions(LogLevel.Debug, true);
        }
    );

    afterEach(
        () => {
            ServiceLoader.destroyAllServices();
        }
    );

    it('Check the service loader instantiates and holds services correctly.',
        () => {
            ServiceLoader.addService(TestServiceA);
            let services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(1);

            services.forEach(
                (service: TestServiceA) => {
                    expect(service.booted).toBeTruthy();
                });

            // try and reload the service again
            ServiceLoader.addService(TestServiceA);
            services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(1);

        }
    );

    it('Check the service loader instantiates services with constructor args correctly.',
        () => {
            ServiceLoader.addService(TestServiceB, 'hello', 'baby melody');
            let services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(1);

            services.forEach(
                (service: TestServiceB) => {
                    expect(service.constructorArgA).toEqual('hello');
                    expect(service.constructorArgB).toEqual('baby melody');

                });

            ServiceLoader.addService(TestServiceA);
            services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(2);

        }
    );

    it('Check the service loader handles multuple services correctly',
        () => {
            ServiceLoader.addService(TestServiceB, 'hello', 'baby melody');
            let services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(1);


            ServiceLoader.addService(TestServiceA);
            services = ServiceLoader.getLoadedServices();
            expect(services.size).toEqual(2);

        }
    );

});
