"use strict";
var message_model_1 = require('bifrost/bus/message.model');
var bifrost_module_1 = require('bifrost/bifrost.module');
var testing_1 = require('@angular/core/testing');
/**
 * This is the unit test for the Stream model.
 */
beforeEach(function () {
    testing_1.TestBed.configureTestingModule({
        imports: [bifrost_module_1.BifrostModule.forRoot()]
    });
});
describe('Stream Model [stream]', function () {
    var message;
    var testError = {
        error: 'fake error'
    };
    var testData = {
        data: 'fake data'
    };
    beforeEach(function () {
        message = new message_model_1.Message();
    });
    it('Should check instantiation and getters/setters', function () {
        expect(message.isError())
            .toBeFalsy();
        expect(message.payload)
            .toBeUndefined();
        message.request(testData);
        expect(message.payload.data)
            .toBe('fake data');
        expect(message.isRequest())
            .toBeTruthy();
        expect(message.isResponse())
            .toBeFalsy();
        expect(message.isError())
            .toBeFalsy();
        expect(message.type)
            .toBe(message_model_1.MessageType.MessageTypeRequest);
        message.payload = undefined;
        expect(message.payload)
            .toBeUndefined();
        message.response(testData);
        expect(message.payload.data)
            .toBe('fake data');
        message.error(testError);
        expect(message.isError)
            .toBeTruthy();
        expect(message.payload.error)
            .toBe('fake error');
    });
});
