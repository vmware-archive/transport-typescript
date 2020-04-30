/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../../bus.api';
import { RestOperations } from './rest.operations';
import { RestService } from './rest.service';
import { HttpRequest, RestError, RestObject } from './rest.model';
import { APIRequest, Message } from '../../../bus';
import { GeneralUtil } from '../../../util/util';
import { BusTestUtil } from '../../../util/test.util';
import { GeneralError } from '../../model/error.model';
import { BrokerConnector, BrokerConnectorChannel, StompBusCommand, StompClient, StompConfig } from '../../../bridge';
import { Subscription } from 'rxjs';

describe('Bifröst Rest Operations [cores/services/rest/rest.operations]', () => {

    let bus: EventBus;
    let operations: RestOperations;

    const connectToMockBroker = () => {
        const configuration = new StompConfig(
            '/somewhere',
            'somehost',
            12345,
            '',
            '',
            false,
            null
        );

        configuration.brokerConnectCount = 1;
        configuration.testMode = true;
        configuration.topicLocation = '/topic';
        configuration.queueLocation = '/queue';
        configuration.useTopics = true;
        BrokerConnector.fireConnectCommand(bus, configuration);
    };

    beforeEach(() => {
        bus = BusTestUtil.bootBus();
        operations = RestOperations.getInstance();
        connectToMockBroker();
    });

    afterEach(() => {
        RestOperations.destroy();
    });

    it('Check singleton exists.',
        () => {
            expect(operations).not.toBeNull();
        }
    );

    it('Check singleton can be destroyed.',
        () => {
            let currentId = operations.id;
            RestOperations.destroy();
            let newId = RestOperations.getInstance().id;
            expect(currentId).not.toEqual(newId);
        }
    );

    it('Check global headers can be sent by operation.',
        (done) => {
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.headers.hello).toEqual('there');
                    sub.unsubscribe();
                    done();
                }
            );

            operations.setGlobalHttpHeaders({hello: 'there'}, 'test');
        }
    );

    it('Check cors and creds can be disabled (not for prod use)',
        (done) => {
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.request).toEqual(HttpRequest.DisableCORSAndCredentials);
                    sub.unsubscribe();
                    done();
                }
            );

            operations.disableCorsAndCredentials('test');
        }
    );

    it('Check host and scheme can be set / changed',
        (done) => {
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.request).toEqual(HttpRequest.SetRestServiceHostOptions);
                    expect(restObject.uri).toEqual('rose://melody');
                    sub.unsubscribe();
                    done();
                }
            );

            operations.setRestServiceHostOptions('melody', 'rose', 'test');
        }
    );

    it('HTTP Request can be made',
        (done) => {
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.request).toEqual(HttpRequest.Get);
                    expect(restObject.uri).toEqual('http://melody.rose');
                    sub.unsubscribe();
                    done();
                }
            );

            operations.restServiceRequest(
                {
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: () => {}
                }, 'test'
            );
        }
    );

    it('HTTP Request can be made and mocked response returned',
        (done) => {
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.request).toEqual(HttpRequest.Get);
                    expect(restObject.uri).toEqual('http://melody.rose');

                    // fake response
                    if (msg.isRequest()) {
                        restObject.response = {pretty: 'baby'};
                        bus.sendResponseMessageWithId(RestService.channel, restObject, msg.id);
                    }
                }
            );

            operations.restServiceRequest(
                {
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: (payload: any) => {
                        expect(payload.pretty).toEqual('baby');
                        done();
                    }
                }, 'test'
            );
        }
    );

    it('Check request ID is able to be set correctly',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {
                    const restObject: RestObject = msg.payload as RestObject;
                    expect(restObject.request).toEqual(HttpRequest.Get);
                    expect(restObject.id).toEqual(id);
                    sub.unsubscribe();
                    done();
                }
            );

            operations.restServiceRequest(
                {
                    id: id,
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: () => {}
                }, 'test'
            );
        }
    );

    it('Check request is wrapped if the channel is galactic',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let bcSub: Subscription;
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {

                    const apiRequest: APIRequest<RestObject> = msg.payload as APIRequest<RestObject>;
                    const restObject: RestObject = apiRequest.payload;
                    const uri = restObject.uri;
                    expect(uri).toEqual('http://melody.rose');

                    sub.unsubscribe();
                    bcSub.unsubscribe();
                    bus.markChannelAsLocal(RestService.channel);
                    done();
                }
            );

            bcSub = bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                bus.markChannelAsGalactic(RestService.channel);
                                operations.restServiceRequest(
                                    {
                                        id: id,
                                        uri: 'http://melody.rose',
                                        method: HttpRequest.Get,
                                        successHandler: () => {}
                                    }, 'test'
                                );
                        }
                    }
                );
        }
    );

    it('Check request is wrapped if the channel is galactic - and apiClass supplied',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let bcSub: Subscription;
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {

                    const apiRequest: APIRequest<RestObject> = msg.payload as APIRequest<RestObject>;
                    const restObject: RestObject = apiRequest.payload;
                    const uri = restObject.uri;
                    const apiClass = restObject.apiClass;
                    expect(uri).toEqual('http://melody.rose');
                    expect(apiClass).toEqual('com.some.Class');
                    bcSub.unsubscribe();
                    sub.unsubscribe();
                    bus.markChannelAsLocal(RestService.channel);
                    done();
                }
            );

            bcSub = bus.listenStream(BrokerConnectorChannel.status)
                .handle(
                    (command: StompBusCommand) => {
                        switch (command.command) {
                            case StompClient.STOMP_CONNECTED:
                                console.log('CONNECTED');
                                bus.markChannelAsGalactic(RestService.channel);
                                operations.restServiceRequest(
                                    {
                                        apiClass: 'com.some.Class',
                                        id: id,
                                        uri: 'http://melody.rose',
                                        method: HttpRequest.Get,
                                        successHandler: () => {}
                                    }, 'test'
                                );
                                break;

                            default:
                                break;
                        }
                    }
                );
        }
    );

    it('Ensure that wire based fabric requests from backend RestService instances are unpacked correctly.',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {

                    if (msg.isRequest()) {

                        const restObject: RestObject = msg.payload as RestObject;
                        expect(restObject.request).toEqual(HttpRequest.Get);
                        expect(restObject.uri).toEqual('http://melody.rose');

                        // fake response
                        if (msg.isRequest()) {
                            restObject.response = JSON.stringify({pretty: 'baby'});
                            bus.sendResponseMessageWithId(RestService.channel,
                                bus.fabric.generateFabricResponse(restObject.id, restObject.response), msg.id);
                        }
                    }
                }
            );

            operations.restServiceRequest(
                {
                    id: id,
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: (payload: any) => {
                        expect(payload.pretty).toEqual('baby');
                        sub.unsubscribe();
                        done();
                    }
                }, 'test'
            );
        }
    );

    it('Ensure that wire based fabric errors from backend RestService instances are unpacked correctly.',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {

                    if (msg.isRequest()) {

                        const restObject: RestObject = msg.payload as RestObject;
                        expect(restObject.request).toEqual(HttpRequest.Get);
                        expect(restObject.uri).toEqual('http://melody.rose');

                        const err: RestError = new RestError('oh dear, the computer said no.');

                        // fake response
                        if (msg.isRequest()) {
                            bus.sendErrorMessageWithId(RestService.channel,
                                bus.fabric.generateFabricResponse(
                                    restObject.id, err,
                                    true , 500,
                                    'error'), msg.id);
                        }
                    }
                }
            );

            operations.restServiceRequest(
                {
                    id: id,
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: () => {
                        fail();
                        done();
                    },
                    errorHandler: (error: GeneralError) => {
                        expect(error.message).toEqual('oh dear, the computer said no.');
                        done();
                    }
                }, 'test'
            );
        }
    );

    it('Ensure that local errors are handled correctly.',
        (done) => {

            const id: string = GeneralUtil.genUUID();
            let sub = bus.api.getChannel(RestService.channel).subscribe(
                (msg: Message) => {

                    if (msg.isRequest()) {

                        const restObject: RestObject = msg.payload as RestObject;
                        expect(restObject.request).toEqual(HttpRequest.Get);
                        expect(restObject.uri).toEqual('http://melody.rose');

                        const err: RestError = new RestError('oh dear, the computer said no... again');

                        // fake response
                        if (msg.isRequest()) {
                            bus.sendErrorMessageWithId(RestService.channel,
                                err, msg.id);
                        }
                    }
                }
            );

            operations.restServiceRequest(
                {
                    id: id,
                    uri: 'http://melody.rose',
                    method: HttpRequest.Get,
                    successHandler: () => {
                        fail();
                        done();
                    },
                    errorHandler: (error: GeneralError) => {
                        expect(error.message).toEqual('oh dear, the computer said no... again');
                        done();
                    }
                }, 'test'
            );
        }
    );

});
