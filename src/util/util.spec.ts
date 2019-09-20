import { GeneralUtil } from './util';

describe('Bus Util [util/bus.util.spec]', () => {

    it('Check an object can be parsed.',
        () => {
            expect(GeneralUtil.isObject('not an object')).toBeFalsy();
            expect(GeneralUtil.isObject('{"cutestBaby": "melody"}')).toBeTruthy();
        }
    );

    it('Check a cookie can be fetched', () => {
        spyOnProperty(document, 'cookie').and.returnValue('cookie=cracker; pine=apple;');
        expect(GeneralUtil.getCookie('cookie')).toBe('cracker');
        expect(GeneralUtil.getCookie('apple')).toBeNull();
    });
});
