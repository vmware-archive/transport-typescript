import { BusUtil } from './bus.util';
import { LogLevel } from '../log';

describe('Bus Util [util/bus.util.spec]', () => {

    beforeEach(
        () => {

        }
    )

    it('Check we can boot and grab an instance of the bus correctly.',
        () => {

            const bus = BusUtil.bootBus();
            expect(bus).not.toBeNull();
            const busCopy = BusUtil.getBusInstance()
            expect(busCopy).not.toBeNull();
            expect(bus).toEqual(busCopy);

        }
    );


    it('Check we can boot with options correctly',
        () => {

            BusUtil.destroy();

            const bus = BusUtil.bootBusWithOptions(LogLevel.Debug, false);
            expect(bus).not.toBeNull();
            spyOn(bus.logger, 'debug');
            bus.logger.debug('chickie');
            expect(bus.logger.debug).toHaveBeenCalledWith('chickie');

        }
    );
});
