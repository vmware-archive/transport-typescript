/*
 * Copyright 2017-2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import {StompParser} from './stomp.parser';
import {StompClient} from './stomp.client';
import {Message} from '../bus/model/message.model';
import { GeneralUtil } from '../util/util';

describe('Stomp Parser [stomp.parser]', () => {

    it('We should be able to parse the byte content length of a body',
        () => {

            let message1 = '{"something":"goes_here"}';
            let message2 = '{"a":"1","b":"2","c":"3","d":"4"}';
            let message3 = 'what a lovely potato';
            let message4 = 'stompy stomp stomper parser parses strings';
            let message5 = 'c3RvbXAgaXMgYSBzaW1wbGUgdGV4dCBiYXNlZCBtZXNzYWdlIHByb3RvY29sLg==';

            expect(StompParser.byteCount(message1))
                .toEqual(25);

            expect(StompParser.byteCount(message2))
                .toEqual(33);

            expect(StompParser.byteCount(message3))
                .toEqual(20);

            expect(StompParser.byteCount(message4))
                .toEqual(42);

            expect(StompParser.byteCount(message5))
                .toEqual(64);

        }
    );

    it('We should be able to generate a valid UUID',
        () => {

            let uuid1 = GeneralUtil.genUUID();
            let uuid2 = GeneralUtil.genUUID();
            expect(uuid1.length).toEqual(36);
            expect(uuid1.charAt(8)).toEqual('-');
            expect(uuid1.charAt(13)).toEqual('-');
            expect(uuid2.length).toEqual(36);
            expect(uuid2.charAt(8)).toEqual('-');
            expect(uuid2.charAt(13)).toEqual('-');

            // lets get reggy.
            let chargrp = '[a-zA-Z0-9]';
            let re = new RegExp(chargrp + '{8}-' + chargrp + '{4}-' +
                chargrp + '{4}-' + chargrp + '{4}-' + chargrp + '{12}');

            expect(re.test(uuid1)).toBeTruthy();
            expect(re.test(uuid2)).toBeTruthy();
            expect(re.test('abc-123-45666-1')).toBeFalsy();
            expect(re.test('who doesn\'t like boots?')).toBeFalsy();
        }
    );

    it('We should be able to correctly marshall a STOMP message',
        () => {

            let message1: string = StompParser.marshal(
                StompClient.STOMP_CONNECT,
                {'test-header': 'hello', 'some-value': 1234},
                'stompy is a friend of stampy the elephant'
            );

            let message2: string = StompParser.marshal(
                StompClient.STOMP_MESSAGE,
                {'test-header': 'hello', 'some-value': 1234},
                'hey hey hey!'
            );

            let message3: string = StompParser.marshal(
                StompClient.STOMP_MESSAGE,
                {'test-header': 'hello', 'some-value': 1234},
                {look: 'an-object', with: 'properties'}
            );

            let expectedMessage1 = 'CONNECT\n' +
                'test-header:hello\n' +
                'some-value:1234\n' +
                'accept-version:1.2\n\n' +
                'stompy is a friend of stampy the elephant\0';

            let expectedMessage2 = 'MESSAGE\n' +
                'test-header:hello\n' +
                'some-value:1234\n' +
                'accept-version:1.2\n\n' +
                'hey hey hey!\0';


            let expectedMessage3 = 'MESSAGE\n' +
                'test-header:hello\n' +
                'some-value:1234\n' +
                'accept-version:1.2\n\n' +
                '{"look":"an-object","with":"properties"}\0';

            expect(message1).toEqual(expectedMessage1);
            expect(message2).toEqual(expectedMessage2);
            expect(message3).toEqual(expectedMessage3);
        }
    );

    it('We should be able to ensure trimming works on the body',
        () => {
            expect(StompParser.trim('  lots of space   ')).toEqual('lots of space');
            expect(StompParser.trim('lots of space   ')).toEqual('lots of space');
            expect(StompParser.trim('\t\t\ttabs?')).toEqual('tabs?');
        }
    );

    it('We should be able to unmarshal a STOMP message.',
        () => {

            let stompMessage1 = 'CONNECT\n' +
                'test-header:hello\n' +
                'some-value:1234\n\n' +
                'stompy is a friend of stampy the elephant\0';

            let stompMessage2 = 'MESSAGE\n' +
                'test-header:welcome\n' +
                'some-value:nnn678\n\n' +
                'hey hey hey!\0';


            let stompMessage3 = 'MESSAGE\n' +
                'test-header:something\n' +
                'some-value:000abc\n\n' +
                '{"look":"an-object","with":"properties"}\0';

            let stompObject1 = StompParser.unmarshal(stompMessage1);
            let stompObject2 = StompParser.unmarshal(stompMessage2);
            let stompObject3 = StompParser.unmarshal(stompMessage3);

            expect(stompObject1.headers['test-header']).toEqual('hello');
            expect(stompObject1.headers['some-value']).toEqual('1234');
            expect(stompObject1.command).toEqual(StompClient.STOMP_CONNECT);
            expect(stompObject1.body).toEqual('stompy is a friend of stampy the elephant');

            expect(stompObject2.headers['test-header']).toEqual('welcome');
            expect(stompObject2.headers['some-value']).toEqual('nnn678');
            expect(stompObject2.command).toEqual(StompClient.STOMP_MESSAGE);
            expect(stompObject2.body).toEqual('hey hey hey!');

            expect(stompObject3.headers['test-header']).toEqual('something');
            expect(stompObject3.headers['some-value']).toEqual('000abc');
            expect(stompObject3.command).toEqual(StompClient.STOMP_MESSAGE);

            let bodyObject = JSON.parse(stompObject3.body);
            expect(bodyObject).toBeDefined();
            expect(bodyObject).not.toBeNull();
            expect(bodyObject.look).toBeDefined();
            expect(bodyObject.look).toEqual('an-object');
            expect(bodyObject.with).toBeDefined();
            expect(bodyObject.with).toEqual('properties');
        }
    );

    it('We should be able to extract bus commands from a bus message',
        () => {

            let id = GeneralUtil.genUUID();
            let busCommand =
                StompParser.generateStompBusCommand(StompClient.STOMP_CONNECT, id);

            let message = new Message().request(busCommand);
            let extracted = StompParser.extractStompBusCommandFromMessage(message);

            expect(extracted).not.toBeNull();
            expect(extracted.command).toEqual(StompClient.STOMP_CONNECT);
            expect(extracted.session).toEqual(id);
            expect(StompParser.extractStompBusCommandFromMessage(null)).toBeNull();

        }
    );

    it('We should be able to extract a stomp message from a bus command message',
        () => {

            let id = GeneralUtil.genUUID();

            let stompMessage = StompParser.frame(StompClient.STOMP_CONNECT, {}, 'two big dogs with a ball');

            let busCommand =
                StompParser.generateStompBusCommand(
                    StompClient.STOMP_CONNECT,
                    id,
                    'somewhere',
                    stompMessage
                );

            let extracted = StompParser.extractStompMessageFromBusCommand(busCommand);

            expect(extracted).not.toBeNull();
            expect(extracted.command).toEqual(StompClient.STOMP_CONNECT);
            expect(extracted.body).toEqual('two big dogs with a ball');
            expect(StompParser.extractStompMessageFromBusCommand(null)).toBeNull();
        }
    );

    it('We should be able to extract a stomp message from a bus message',
        () => {

            let id = GeneralUtil.genUUID();

            let stompMessage = StompParser.frame(StompClient.STOMP_CONNECT, {}, 'two big dogs with a ball');

            let busCommand =
                StompParser.generateStompBusCommand(
                    StompClient.STOMP_CONNECT,
                    id,
                    'somewhere',
                    stompMessage
                );

            let message = new Message().request(busCommand);

            let extracted = StompParser.extractStompMessageFromBusMessage(message);

            expect(extracted).not.toBeNull();
            expect(extracted.command).toEqual(StompClient.STOMP_CONNECT);
            expect(extracted.body).toEqual('two big dogs with a ball');
            expect(StompParser.extractStompMessageFromBusMessage(null)).toBeNull();
            
        }
    );

    it('We should be able to check supplied headers can be framed correctly.',
        () => {

            let msg = StompParser.frame('TEST', { potato: 'tasty'}, 'tasty potato?');
            expect(msg.toString()).toEqual('TEST\npotato:tasty\naccept-version:1.2\n\ntasty potato?');

            msg = StompParser.frame('TEST', null, 'tasty potato?');
            expect(msg.toString()).toEqual('TEST\naccept-version:1.2\n\ntasty potato?');
            
        }
    );

    it('Check a subscription can be converted to a channel',
        () => {

            // public channel
            const subA = StompParser.convertSubscriptionToChannel(
                'puppykitty/', 'kitty');
            expect(subA).toEqual('puppy');

            // private channel
            const subB = StompParser.convertSubscriptionToChannel(
                'puppy/kitty', 'puppy');
            expect(subB).toEqual('kitty');

        }
    );

    
});

