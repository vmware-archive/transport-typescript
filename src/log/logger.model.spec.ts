///<reference path="util.ts"/>
/**
 * Copyright(c) VMware Inc., 2016
 */
import {LogObject, LogLevel, LogLevelObject} from './logger.model';
import {LogUtil} from './util';

/**
 * This is the unit test for the Logger Model.
 */

function getName() {
    return 'logger.model.spec';
}


describe('Log Model [log/logger.model.spec ]', () => {
    const myChannel = '#fake-logger-channel';
    const testString = 'Test String';

    it('Should check loglevel object build',
        function () {
            let logLevelObject = new LogLevelObject().build(LogLevel.Verbose);
            expect(logLevelObject.logLevel)
                .toBe(LogLevel.Verbose);
            logLevelObject.logLevel = LogLevel.Warn;
            expect(logLevelObject.logLevel)
                .toBe(LogLevel.Warn);
        }
    );

    it('Should check log object build',
        function () {
            let log = new LogObject().build(LogLevel.Verbose, myChannel, testString, getName());
            expect(log.logLevel)
                .toBe(LogLevel.Verbose);
            expect(log.channel)
                .toBe(myChannel);
            expect(log.object)
                .toBe(testString);
            expect(log.caller)
                .toBe(getName());
        }
    );

    it('Should check getters and setters',
        function () {
            let log = new LogObject();
            log.logLevel = LogLevel.Debug;
            log.channel = myChannel;
            log.object = testString;
            log.caller = getName();
            log.suppress = false;

            expect(log.logLevel)
                .toBe(LogLevel.Debug);
            expect(log.channel)
                .toBe(myChannel);
            expect(log.object)
                .toBe(testString);
            expect(log.caller)
                .toBe(getName());
            expect(log.suppress)
                .toBeFalsy();

            let object = {'test': 'string'};
            log.object = object;
            expect(log.object)                      // stringify object
                .toBe(LogUtil.pretty(object));
        }
    );
});
