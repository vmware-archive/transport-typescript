import {MonitorType, MonitorObject} from './monitor.model';

/**
 * This is the unit test for the Monitor model.
 */

function getName() {
    return 'monitor.model.spec';
}


describe('Monitor Model [monitor.model]', () => {
    const testType = MonitorType.MonitorData;
    const testChannel = '#monitor-test-channel';
    const testData: any = {data: 'test'};

    it('Should verify monitor creation', () => {
        let monitorObject: MonitorObject = new MonitorObject();

        expect(monitorObject.type)
            .toBeUndefined();
        expect(monitorObject.channel)
            .toBeUndefined();
        expect(monitorObject.from)
            .toBeUndefined();
        expect(monitorObject.data)
            .toBeUndefined();
        expect(monitorObject.hasData())
            .toBeFalsy();
        expect(monitorObject.isNewChannel())
            .toBeFalsy();
        expect(monitorObject.isChannelGone())
            .toBeFalsy();
    });

    it('Should build a new monitor object and test getters and setters', () => {
        let monitorObject: MonitorObject = new MonitorObject()
            .build(testType, testChannel, getName());

        expect(monitorObject.type)
            .toBe(testType);
        expect(monitorObject.channel)
            .toBe(testChannel);
        expect(monitorObject.from)
            .toBe(getName());
        expect(monitorObject.data)
            .toBeUndefined();
        expect(monitorObject.hasData())
            .toBeFalsy();
        expect(monitorObject.isNewChannel())
            .toBeFalsy();
        expect(monitorObject.isChannelGone())
            .toBeFalsy();

        monitorObject.type = MonitorType.MonitorData;
        monitorObject.data = testData;
        expect(monitorObject.hasData())
            .toBeTruthy();

        monitorObject.type = MonitorType.MonitorNewChannel;
        monitorObject.data = undefined;
        expect(monitorObject.isNewChannel())
            .toBeTruthy();

        monitorObject.type = MonitorType.MonitorCloseChannel;
        expect(monitorObject.isChannelGone())
            .toBeFalsy();

        monitorObject.type = MonitorType.MonitorDestroyChannel;
        expect(monitorObject.isChannelGone())
            .toBeTruthy();

        monitorObject.from = 'somewhere';
        monitorObject.channel = testChannel;
        expect(monitorObject.from)
            .toBe('somewhere');
        expect(monitorObject.channel)
            .toBe(testChannel);
    });

});

