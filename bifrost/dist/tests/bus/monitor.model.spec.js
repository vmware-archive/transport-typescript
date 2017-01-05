"use strict";
var monitor_model_1 = require('bifrost/bus/monitor.model');
/**
 * This is the unit test for the Monitor model.
 */
function getName() {
    return 'monitor.model.spec';
}
describe('Monitor Model [monitor.model]', function () {
    var testType = monitor_model_1.MonitorType.MonitorData;
    var testChannel = '#monitor-test-channel';
    var testData = { data: 'test' };
    it('Should verify monitor creation', function () {
        var monitorObject = new monitor_model_1.MonitorObject();
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
    it('Should build a new monitor object and test getters and setters', function () {
        var monitorObject = new monitor_model_1.MonitorObject()
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
        monitorObject.type = monitor_model_1.MonitorType.MonitorData;
        monitorObject.data = testData;
        expect(monitorObject.hasData())
            .toBeTruthy();
        monitorObject.type = monitor_model_1.MonitorType.MonitorNewChannel;
        monitorObject.data = undefined;
        expect(monitorObject.isNewChannel())
            .toBeTruthy();
        monitorObject.type = monitor_model_1.MonitorType.MonitorCloseChannel;
        expect(monitorObject.isChannelGone())
            .toBeFalsy();
        monitorObject.type = monitor_model_1.MonitorType.MonitorDestroyChannel;
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
