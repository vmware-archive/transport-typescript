import {MockSocket} from './stomp.mocksocket';
import {StompConfig, StompSession} from './stomp.model';

describe('Stomp Model [stomp.config]', () => {

    describe('Stomp Configuration', () => {

        it('We should be able to create a configuration and validate the properties are set',
            () => {
                let config = new StompConfig(
                    '/endpoint',
                    'somehost',
                    12345,
                    'user',
                    'pass'
                );

                expect(config.host).toBeDefined();
                expect(config.port).toBeDefined();
                expect(config.user).toBeDefined();
                expect(config.pass).toBeDefined();
                expect(config.useSSL).toBeFalsy();
                expect(config.endpoint).toBeDefined();
                expect(config.requireACK).toBeFalsy();
                expect(config.generateConnectionURI())
                    .toEqual('ws://somehost:12345/endpoint');

                config = new StompConfig(
                    '/endpoint',
                    'somehost',
                    12345,
                    'user',
                    'pass',
                    true,
                    true
                );

                expect(config.requireACK).toBeTruthy();
                expect(config.generateConnectionURI())
                    .toEqual('wss://somehost:12345/endpoint');


                expect(config.testMode).toEqual(false);
                config.testMode = true;
                expect(config.testMode).toEqual(true);


                expect(config.config).not.toBeNull();


                // check galatic options
                expect(config.useTopics).toBeTruthy();
                expect(config.useQueues).toBeFalsy();

                config.useQueues = true;
                config.useTopics = false;
                expect(config.useQueues).toBeTruthy();
                expect(config.useTopics).toBeFalsy();
                expect(config.topicLocation).toEqual('/topic');
                expect(config.queueLocation).toEqual('/queue');

                config.queueLocation = '/postoffice';
                config.topicLocation = '/donald-trump';

                expect(config.topicLocation).toEqual('/donald-trump');
                expect(config.queueLocation).toEqual('/postoffice');
            }
        );

        it('We should be able to generate a config statically',
            () => {
                let gen: StompConfig = StompConfig.generate(
                    '/somewhere',
                    'thebesthost',
                    31337,
                    true,
                    'darth',
                    'vader'
                );

                expect(gen.endpoint).toEqual('/somewhere');
                expect(gen.host).toEqual('thebesthost');
                expect(gen.port).toEqual(31337);
                expect(gen.useSSL).toEqual(true);
                expect(gen.user).toEqual('darth');
                expect(gen.pass).toEqual('vader');
            }
        );

        it('We should be able to create mock and real sockets',
            () => {
                let config = new StompConfig(
                    '/endpoint',
                    'somehost',
                    1080,
                    'user',
                    'pass'
                );

                let s: any = config.generateSocket();
                expect((s instanceof WebSocket)).toBeTruthy();
                expect((s instanceof MockSocket)).toBeFalsy();

                expect(config.generateConnectionURI())
                    .toEqual('ws://somehost:1080/endpoint');


                config.testMode = true;
                s = config.generateSocket();

                expect((s instanceof WebSocket)).toBeFalsy();
                expect((s instanceof MockSocket)).toBeTruthy();
                expect(config.config).not.toBeNull();
            }
        );
    });

    describe('Stomp Session', () => {

        it('We should be able to create a session and validate it',
            () => {

                let config = new StompConfig(
                    '/endpoint',
                    'somehost',
                    -1,
                    'user',
                    'pass'
                );

                config.testMode = true;
                let session = new StompSession(config);

                expect(session.connect).toBeTruthy();
                expect(session.client).not.toBeNull();
                expect(session.id).not.toBeNull();
                expect(session.config).not.toBeNull();
            }
        );
    });
});

