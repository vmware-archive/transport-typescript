/**
 * Copyright(c) VMware Inc., 2016
 */
import {LoggerService} from './logger.service';
import {LogLevel} from './logger.model';

function getName() {
    return 'logger.service.spec';
}

/**
 * This is the unit test for the Logger Service.
 */


describe('Log Service [log/logger.service.spec ]', () => {
    const testMessage = 'Test String';
    const tag = '[' + getName() + ']: ';
    const response = tag + testMessage;

    let log: LoggerService;

    beforeEach(function () {
        log = new LoggerService();
        log.silent(true);
    });

    it('Should check logger getters and setters',
        function () {
            log.suppress(false);
            log.clear();
            expect(log.last())
                .toBe('');

            log.logLevel = LogLevel.Verbose;
            expect(log.logLevel)
                .toBe(LogLevel.Verbose);

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

            log.logLevel = LogLevel.Off;
            log.group(LogLevel.Info, testMessage);
            log.always(testMessage, getName());
            log.groupEnd(LogLevel.Info);
            expect(log.last())
                .toBe(response);

            log.logLevel = LogLevel.Info;
            log.group(LogLevel.Info, testMessage);
            log.always(testMessage, getName());
            log.groupEnd(LogLevel.Info);
            expect(log.last())
                .toBe(response);

            log.suppress(true);

            log.clear();
            log.logLevel = LogLevel.Warn;
            log.group(LogLevel.Warn, testMessage, true);
            log.info(testMessage, getName());
            log.groupEnd(LogLevel.Warn);
            expect(log.last())
                .toBe('');

            log.clear();
            log.logLevel = LogLevel.Warn;
            log.group(LogLevel.Warn, testMessage, false);
            log.info(testMessage, getName());
            log.groupEnd(LogLevel.Warn);
            expect(log.last())
                .toBe('');
        }
    );

    it('Should check suppression',
        function () {
            log.clear();
            log.suppress(true);

            log.logLevel = LogLevel.Info;
            log.info(testMessage, getName());
            expect(log.last())
                .toBe(response);
        }
    );
});

