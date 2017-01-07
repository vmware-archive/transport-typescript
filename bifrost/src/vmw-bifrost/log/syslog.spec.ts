/**
 * Copyright(c) VMware Inc., 2016
 */

function getName() {
    return 'syslog.spec';
}

import {Syslog} from './syslog';
import {LogLevel} from './logger.model';
/**
 * This is the unit test for Syslog.
 */

describe('Syslog [log/syslog.spec ]', () => {
    const testMessage = 'Test String';
    const tag = '[' + getName() + ']: ';
    const response = tag + testMessage;

    it('Should check Syslog messages, getters and setters',
        function () {
            Syslog.silent(true);
            Syslog.suppress(true);

            expect(Syslog.last())
                .toBeUndefined();

            Syslog.setLogLevel(LogLevel.Verbose);
            expect(Syslog.getLogLevel())
                .toBe(LogLevel.Verbose);

            Syslog.group(LogLevel.Verbose);
            Syslog.verbose(testMessage, getName());
            Syslog.groupEnd(LogLevel.Verbose);
            expect(Syslog.last())
                .toBe(response);

            Syslog.group(LogLevel.Debug, testMessage, true);
            Syslog.debug(testMessage, getName());
            Syslog.groupEnd(LogLevel.Debug);
            expect(Syslog.last())
                .toBe(response);

            Syslog.info(testMessage, getName());
            expect(Syslog.last())
                .toBe(response);

            Syslog.warn(testMessage, getName());
            expect(Syslog.last())
                .toBe(response);

            Syslog.error(testMessage, getName());
            expect(Syslog.last())
                .toBe(response);

            Syslog.clearLogLevel();
            expect(Syslog.getSavedLogLevel())
                .toBe(LogLevel.Warn);
            Syslog.setLogLevel(LogLevel.Warn);
            Syslog.saveLogLevel();
            Syslog.setLogLevel(LogLevel.Error);
            expect(Syslog.getSavedLogLevel())
                .toBe(LogLevel.Warn);

            Syslog.clearLogLevel();
            Syslog.suppress(false);
        }
    );
});
