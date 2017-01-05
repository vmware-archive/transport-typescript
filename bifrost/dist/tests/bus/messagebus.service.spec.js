"use strict";
/**
 * Copyright(c) VMware Inc., 2016
 */
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var syslog_1 = require('bifrost/log/syslog');
var util_1 = require('bifrost/log/util');
var logger_model_1 = require('bifrost/log/logger.model');
var message_model_1 = require('bifrost/bus/message.model');
var index_1 = require('bifrost/bus/index');
//import {BifrostModule} from '../bifrost.module';
/**
 * This is the unit test for the MessagebusService.
 */
// beforeEach(function () {
//     TestBed.configureTestingModule({
//         imports: [BifrostModule.forRoot()]
//     });
// });
function makeCallCountCaller(done, targetCount) {
    var count = 0;
    return function () {
        count += 1;
        if (count === targetCount) {
            done();
        }
    };
}
function getName() {
    return 'messagebus.service.spec';
}
describe('Messagebus Service [messagebus.service]', function () {
    var testChannel = 'test-channel';
    var testData = {
        name: 'test-name'
    };
    var testMessage = 'Test String';
    var tag = '[' + getName() + ']: ';
    var response = tag + testMessage;
    var bus;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                Map,
                index_1.MessagebusService,
            ]
        });
    });
    beforeEach(testing_1.inject([core_1.Injector], function (injector) {
        bus = injector.get(index_1.MessagebusService);
        bus.silenceLog(true);
        bus.suppressLog(true);
    }));
    it('Should check messageLog', function () {
        bus.messageLog(testMessage, getName());
        expect(bus.logger()
            .last())
            .toBe(response);
        bus.setLogLevel(logger_model_1.LogLevel.Off);
        expect(bus.logger().logLevel)
            .toBe(logger_model_1.LogLevel.Off);
    });
    it('Should cause a new Channel to be instantiated', function () {
        var channel = bus.getChannel(testChannel, getName());
        expect(channel)
            .not
            .toBeUndefined();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.getName())
            .toBe('MessagebusService');
        expect(bus.enableMonitorDump(true))
            .toBeTruthy();
        expect(bus.getMonitor())
            .not
            .toBeUndefined();
        bus.enableMonitorDump(false);
        expect(bus.send(testChannel, new message_model_1.Message().request('*data*'), getName()))
            .toBeTruthy();
        bus.getChannel(testChannel, getName());
        expect(bus.refCount(testChannel))
            .toBe(2);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.refCount(testChannel))
            .toBe(-1);
    });
    it('Should cause a new Request Channel to be instantiated', function () {
        var channel = bus.getRequestChannel(testChannel, getName());
        expect(channel)
            .not
            .toBeUndefined();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.getName())
            .toBe('MessagebusService');
        expect(bus.enableMonitorDump(true))
            .toBeTruthy();
        expect(bus.getMonitor())
            .not
            .toBeUndefined();
        bus.enableMonitorDump(false);
        expect(bus.send(testChannel, new message_model_1.Message().request('*data*'), getName()))
            .toBeTruthy();
        bus.getChannel(testChannel, getName());
        expect(bus.refCount(testChannel))
            .toBe(2);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.refCount(testChannel))
            .toBe(1);
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.refCount(testChannel))
            .toBe(-1);
    });
    it('Should fail to communicate with a closed channel', function () {
        bus.getChannel(testChannel, getName());
        bus.increment(testChannel);
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
        expect(bus.close(testChannel, getName()))
            .toBeTruthy();
        expect(bus.send(testChannel, new message_model_1.Message().request(testData), getName()))
            .toBeFalsy();
        expect(bus.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.close(testChannel, getName()))
            .toBeFalsy();
    });
    it('Should fail to communicate with a completed channel', function () {
        bus.getChannel(testChannel, getName());
        expect(bus.complete(testChannel, getName()))
            .toBeTruthy();
        expect(bus.send(testChannel, new message_model_1.Message().request(testData), getName()))
            .toBeFalsy();
        expect(bus.error(testChannel, testData))
            .toBeFalsy();
        expect(bus.complete(testChannel, getName()))
            .toBeFalsy();
    });
    it('Should return same Channel for a new subscriber', function () {
        var channel = bus.getChannel(testChannel, getName());
        var channel2 = bus.getChannel(testChannel, getName());
        expect(channel)
            .not
            .toBeUndefined();
        expect(channel2)
            .not
            .toBeUndefined();
        expect(channel)
            .toBe(channel2);
    });
    it('Should send and receive data over the message bus', function (done) {
        var channel = bus.getRequestChannel(testChannel, getName());
        channel.subscribe(function (message) {
            expect(message.payload)
                .toBe(testData);
            bus.close(testChannel, getName());
            expect(bus.close(testChannel, getName()))
                .toBeFalsy();
            done();
        });
        expect(bus.send(testChannel, new message_model_1.Message().request(testData), getName()))
            .toBeTruthy();
    });
    it('Should send and receive error over the message bus', function (done) {
        var channel = bus.getResponseChannel(testChannel, getName());
        channel.subscribe(function (message) {
            expect(message.isError())
                .toBeTruthy();
            expect(message.payload)
                .toBe(testData);
            done();
        });
        expect(bus.send(testChannel, new message_model_1.Message().error(testData), getName()))
            .toBeTruthy();
    });
    it('Should fail to send data over the message bus (negative test)', function () {
        expect(bus.send('nonexistent-Channel', new message_model_1.Message().request(testData), getName()))
            .toBeFalsy();
    });
    it('Should send and receive an error over the message bus', function (done) {
        var channel = bus.getChannel(testChannel, getName());
        channel.subscribe(function (message) {
            syslog_1.Syslog.error('Unexpected data received: ' + util_1.LogUtil.pretty(message), getName());
        }, function (error) {
            expect(error)
                .toBe(testData);
            done();
        });
        expect(bus.error(testChannel, testData))
            .toBeTruthy();
    });
    it('Should fail to send error over the message bus (negative test)', function () {
        expect(bus.error('nonexistent-Channel', testData))
            .toBeFalsy();
    });
    it('Should send data over the message bus to 2 subscribers (one-to-many)', function (done) {
        var doneCaller = makeCallCountCaller(done, 2);
        var channel = bus.getResponseChannel(testChannel, getName());
        channel.subscribe(function (message) {
            expect(message.payload)
                .toBe(testData);
            doneCaller();
        });
        var channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(function (message) {
            expect(message.payload)
                .toBe(testData);
            doneCaller();
        });
        expect(bus.send(testChannel, new message_model_1.Message().response(testData), getName()))
            .toBeTruthy();
    });
    it('Should send an error over the message bus to 2 subscribers (one-to-many)', function (done) {
        var doneCaller = makeCallCountCaller(done, 2);
        var channel = bus.getChannel(testChannel, getName());
        channel.subscribe(function (message) {
            syslog_1.Syslog.error('Channel1: Unexpected data received: ' + util_1.LogUtil.pretty(message), getName());
        }, function (error) {
            expect(error)
                .toBe(testData);
            doneCaller();
        });
        var channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(function (message) {
            syslog_1.Syslog.error('Channel2: Unexpected data received: ' + util_1.LogUtil.pretty(message), getName());
        }, function (error) {
            expect(error)
                .toBe(testData);
            doneCaller();
        });
        expect(bus.error(testChannel, testData))
            .toBeTruthy();
    });
    it('Should send a completion over the message bus to 2 subscribers (one-to-many)', function (done) {
        var doneCaller = makeCallCountCaller(done, 2);
        var channel = bus.getChannel(testChannel, getName());
        channel.subscribe(function (message) {
            syslog_1.Syslog.error('Channel1: Unexpected data received: ' + util_1.LogUtil.pretty(message), getName());
        }, function (error) {
            syslog_1.Syslog.error('Channel1: Unexpected error received: ' + util_1.LogUtil.pretty(error), getName());
        }, function () {
            syslog_1.Syslog.debug('Channel1: Completion received correctly.', 'messagebus.service');
            doneCaller();
        });
        var channel2 = bus.getChannel(testChannel, getName());
        channel2.subscribe(function (message) {
            syslog_1.Syslog.error('Channel2: Unexpected data received: ' + util_1.LogUtil.pretty(message), getName());
        }, function (error) {
            syslog_1.Syslog.error('Channel2: Unexpected error received: ' + util_1.LogUtil.pretty(error), getName());
        }, function () {
            syslog_1.Syslog.debug('Channel2: Completion received correctly.', 'messagebus.service');
            doneCaller();
        });
        expect(bus.complete(testChannel, getName()))
            .toBeTruthy();
    });
    it('Should fail to send completion over the message bus (negative test)', function () {
        expect(bus.complete('nonexistent-Channel', getName()))
            .toBeFalsy();
    });
});
