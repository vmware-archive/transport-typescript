"use strict";
/**
 * Copyright(c) VMware Inc., 2016
 */
var logger_service_1 = require('bifrost/log/logger.service');
var logger_model_1 = require('bifrost/log/logger.model');
function getName() {
    return 'logger.service.spec';
}
/**
 * This is the unit test for the Logger Service.
 */
describe('Log Service [log/logger.service.spec ]', function () {
    var testMessage = 'Test String';
    var tag = '[' + getName() + ']: ';
    var response = tag + testMessage;
    var log;
    beforeEach(function () {
        log = new logger_service_1.LoggerService();
        log.silent(true);
    });
    it('Should check logger getters and setters', function () {
        log.suppress(false);
        log.clear();
        expect(log.last())
            .toBe('');
        log.logLevel = logger_model_1.LogLevel.Verbose;
        expect(log.logLevel)
            .toBe(logger_model_1.LogLevel.Verbose);
        log.verbose(testMessage, getName());
        expect(log.last())
            .toBe(response);
        log.debug(testMessage, getName());
        expect(log.last())
            .toBe(response);
        log.info(testMessage, getName());
        expect(log.last())
            .toBe(response);
        log.warn(testMessage, getName());
        expect(log.last())
            .toBe(response);
        log.error(testMessage, getName());
        expect(log.last())
            .toBe(response);
        log.logLevel = logger_model_1.LogLevel.Off;
        log.group(logger_model_1.LogLevel.Info, testMessage);
        log.always(testMessage, getName());
        log.groupEnd(logger_model_1.LogLevel.Info);
        expect(log.last())
            .toBe(response);
        log.logLevel = logger_model_1.LogLevel.Info;
        log.group(logger_model_1.LogLevel.Info, testMessage);
        log.always(testMessage, getName());
        log.groupEnd(logger_model_1.LogLevel.Info);
        expect(log.last())
            .toBe(response);
        log.suppress(true);
        log.clear();
        log.logLevel = logger_model_1.LogLevel.Warn;
        log.group(logger_model_1.LogLevel.Warn, testMessage, true);
        log.info(testMessage, getName());
        log.groupEnd(logger_model_1.LogLevel.Warn);
        expect(log.last())
            .toBe('');
        log.clear();
        log.logLevel = logger_model_1.LogLevel.Warn;
        log.group(logger_model_1.LogLevel.Warn, testMessage, false);
        log.info(testMessage, getName());
        log.groupEnd(logger_model_1.LogLevel.Warn);
        expect(log.last())
            .toBe('');
    });
    it('Should check suppression', function () {
        log.clear();
        log.suppress(true);
        log.logLevel = logger_model_1.LogLevel.Info;
        log.info(testMessage, getName());
        expect(log.last())
            .toBe(response);
    });
});
