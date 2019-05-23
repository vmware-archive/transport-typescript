/**
 * Copyright(c) VMware Inc., 2016
 */
import { Logger } from './logger.service';
import { LogLevel } from './logger.model';

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

    let log: Logger;

    beforeEach(() => {
        log = new Logger();
        log.silent(true);
    });

    it('Should check logger getters and setters',
        () => {
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
        () => {
            log.clear();
            log.suppress(true);

            log.logLevel = LogLevel.Info;
            log.info(testMessage, getName());
            expect(log.last())
                .toBe(response);
        }
    );

    it('Check output with caller',
        () => {
            log.clear();
            log.suppress(false);
            log.silent(false);
            log.setStylingVisble(false);

            log.info('hello', 'puppy');
            expect(log.last()).toBe('[puppy]: hello');

        }
    );

    it('Check output without caller',
        () => {
            log.clear();
            log.suppress(false);
            log.silent(false);
            log.setStylingVisble(false);

            log.info('hello', null);
            expect(log.last()).toBe('hello');
        }
    );

    it('Check output with styling',
        () => {
            log.clear();
            log.suppress(false);
            log.silent(false);
            log.setStylingVisble(true);

            log.info('hello', null);
            expect(log.last()).toBe('hello');
        }
    );

    it('Check output with styling at all levels.',
        () => {
            log.clear();
            log.suppress(false);
            log.silent(false);
            log.setStylingVisble(false);

            log.info('hello', null);
            expect(log.last()).toBe('hello');

            log.debug('hello', null);
            expect(log.last()).toBe('hello');

            log.error('hello', null);
            expect(log.last()).toBe('hello');

            log.warn('hello', null);
            expect(log.last()).toBe('hello');

            log.verbose('hello', null);
            expect(log.last()).toBe('hello');

            log.verbose('hello', null);
            expect(log.last()).toBe('hello');
        }
    );

    it('check logging helper on/off methods operate correctly.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOffAllLogging();

            log.info('no-log', null);
            expect(log.last()).toBe('');

            log.turnOnAllLogging();

            log.error('go-log', null);
            expect(log.last()).toBe('go-log');
        }
    );

    it('check verbose logging helper.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOnVerboseLogging();

            log.verbose('clocks', null);
            expect(log.last()).toBe('clocks');
        }
    );

    it('check debug logging helper.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOnDebugLogging();

            log.verbose('socks', null);
            expect(log.last()).toBe('');

            log.debug('socks', null);
            expect(log.last()).toBe('socks');
        }
    );

    it('check info logging helper.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOnInfoLogging();

            log.debug('shops', null);
            expect(log.last()).toBe('');

            log.info('shops', null);
            expect(log.last()).toBe('shops');
        }
    );

    it('check warn logging helper.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOnWarnLogging();

            log.info('melody', null);
            expect(log.last()).toBe('');

            log.warn('melody', null);
            expect(log.last()).toBe('melody');
        }
    );

    it('check error logging helper.',
        () => {
            log.clear();
            log.setStylingVisble(false);
            log.turnOnErrorLogging();

            log.warn('rose', null);
            expect(log.last()).toBe('');

            log.error('rose', null);
            expect(log.last()).toBe('rose');
        }
    );
});

