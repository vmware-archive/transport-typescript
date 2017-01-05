/**
 * Copyright(c) VMware Inc., 2016
 */
"use strict";
function getName() {
    return 'syslog.spec';
}
var syslog_1 = require('bifrost/log/syslog');
var logger_model_1 = require('bifrost/log/logger.model');
/**
 * This is the unit test for Syslog.
 */
describe('Syslog [log/syslog.spec ]', function () {
    var testMessage = 'Test String';
    var tag = '[' + getName() + ']: ';
    var response = tag + testMessage;
    it('Should check Syslog messages, getters and setters', function () {
        syslog_1.Syslog.silent(true);
        syslog_1.Syslog.suppress(true);
        expect(syslog_1.Syslog.last())
            .toBeUndefined();
        syslog_1.Syslog.setLogLevel(logger_model_1.LogLevel.Verbose);
        expect(syslog_1.Syslog.getLogLevel())
            .toBe(logger_model_1.LogLevel.Verbose);
        syslog_1.Syslog.group(logger_model_1.LogLevel.Verbose);
        syslog_1.Syslog.verbose(testMessage, getName());
        syslog_1.Syslog.groupEnd(logger_model_1.LogLevel.Verbose);
        expect(syslog_1.Syslog.last())
            .toBe(response);
        syslog_1.Syslog.group(logger_model_1.LogLevel.Debug, testMessage, true);
        syslog_1.Syslog.debug(testMessage, getName());
        syslog_1.Syslog.groupEnd(logger_model_1.LogLevel.Debug);
        expect(syslog_1.Syslog.last())
            .toBe(response);
        syslog_1.Syslog.info(testMessage, getName());
        expect(syslog_1.Syslog.last())
            .toBe(response);
        syslog_1.Syslog.warn(testMessage, getName());
        expect(syslog_1.Syslog.last())
            .toBe(response);
        syslog_1.Syslog.error(testMessage, getName());
        expect(syslog_1.Syslog.last())
            .toBe(response);
        syslog_1.Syslog.clearLogLevel();
        expect(syslog_1.Syslog.getSavedLogLevel())
            .toBe(logger_model_1.LogLevel.Warn);
        syslog_1.Syslog.setLogLevel(logger_model_1.LogLevel.Warn);
        syslog_1.Syslog.saveLogLevel();
        syslog_1.Syslog.setLogLevel(logger_model_1.LogLevel.Error);
        expect(syslog_1.Syslog.getSavedLogLevel())
            .toBe(logger_model_1.LogLevel.Warn);
        syslog_1.Syslog.clearLogLevel();
        syslog_1.Syslog.suppress(false);
    });
});
