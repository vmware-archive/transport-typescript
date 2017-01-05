"use strict";
///<reference path="util.ts"/>
/**
 * Copyright(c) VMware Inc., 2016
 */
var logger_model_1 = require('bifrost/log/logger.model');
var util_1 = require('bifrost/log/util');
/**
 * This is the unit test for the Logger Model.
 */
function getName() {
    return 'logger.model.spec';
}
describe('Log Model [log/logger.model.spec ]', function () {
    var myChannel = '#fake-logger-channel';
    var testString = 'Test String';
    it('Should check loglevel object build', function () {
        var logLevelObject = new logger_model_1.LogLevelObject().build(logger_model_1.LogLevel.Verbose);
        expect(logLevelObject.logLevel)
            .toBe(logger_model_1.LogLevel.Verbose);
        logLevelObject.logLevel = logger_model_1.LogLevel.Warn;
        expect(logLevelObject.logLevel)
            .toBe(logger_model_1.LogLevel.Warn);
    });
    it('Should check log object build', function () {
        var log = new logger_model_1.LogObject().build(logger_model_1.LogLevel.Verbose, myChannel, testString, getName());
        expect(log.logLevel)
            .toBe(logger_model_1.LogLevel.Verbose);
        expect(log.channel)
            .toBe(myChannel);
        expect(log.object)
            .toBe(testString);
        expect(log.caller)
            .toBe(getName());
    });
    it('Should check getters and setters', function () {
        var log = new logger_model_1.LogObject();
        log.logLevel = logger_model_1.LogLevel.Debug;
        log.channel = myChannel;
        log.object = testString;
        log.caller = getName();
        log.suppress = false;
        expect(log.logLevel)
            .toBe(logger_model_1.LogLevel.Debug);
        expect(log.channel)
            .toBe(myChannel);
        expect(log.object)
            .toBe(testString);
        expect(log.caller)
            .toBe(getName());
        expect(log.suppress)
            .toBeFalsy();
        var object = { 'test': 'string' };
        log.object = object;
        expect(log.object) // stringify object
            .toBe(util_1.LogUtil.pretty(object));
    });
});
