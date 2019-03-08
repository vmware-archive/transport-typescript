/**
 * Copyright(c) VMware Inc. 2019
 */
import { EventBus } from '../../../bus.api';
import { LogLevel } from '../../../log';
import { BusTestUtil } from '../../../util/test.util';
import { RestOperations } from './rest.operations';
import { RestService } from './rest.service';
import { HttpRequest, RestObject } from './rest.model';
import { Message } from '../../../bus';

describe('Bifröst Rest Operations [cores/services/rest/rest.operations]', () => {

    let bus: EventBus;
    let operations: RestOperations;

    bus = BusTestUtil.bootBusWithOptions(LogLevel.Off, true);
    operations = RestOperations.getInstance();

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

            operations.setRestServiceHostOptions('melody','rose','test');
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
                },'test'
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
                },'test'
            );
        }
    );
});
