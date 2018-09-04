import { GeneralUtil } from './util';

describe('Bus Util [util/bus.util.spec]', () => {

    it('Check an object can be parsed.',
        () => {
            expect(GeneralUtil.isObject('not an object')).toBeFalsy();
            expect(GeneralUtil.isObject('{"cutestBaby": "melody"}')).toBeTruthy();
        }
    );
});
