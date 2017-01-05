"use strict";
var channel_model_1 = require('bifrost/bus/channel.model');
var syslog_1 = require('bifrost/log/syslog');
var util_1 = require('bifrost/log/util');
var message_model_1 = require('bifrost/bus/message.model');
var bifrost_module_1 = require('bifrost/bifrost.module');
var testing_1 = require('@angular/core/testing');
/**
 * This is the unit test for the Stream model.
 */
describe('Stream Model [stream]', function () {
    var channel;
    var testObject = {
        name: 'test'
    };
    var testError = {
        error: 'fake error'
    };
    beforeEach(function () {
        channel = new channel_model_1.Channel('test-stream');
        testing_1.TestBed.configureTestingModule({
            imports: [bifrost_module_1.BifrostModule.forRoot()]
        });
    });
    it('Should verify stream creation', function () {
        channel.decrement();
        channel.decrement();
        expect(channel.refCount)
            .toBe(0);
        expect(channel.name)
            .toBe('test-stream');
        expect(channel.stream)
            .not
            .toBeUndefined();
    });
    it('Should send and receive an object', function (done) {
        channel.stream.subscribe(function (message) {
            expect(message.payload.name)
                .toBe(testObject.name);
            done();
        }, function (error) {
            // shouldn't come here
            syslog_1.Syslog.error('Unexpected error on stream.send: ' + util_1.LogUtil.pretty(error), 'stream.spec');
        });
        channel.send(new message_model_1.Message().request(testObject));
    });
    it('Should send and receive an error', function (done) {
        channel.stream.subscribe(function (message) {
            // shouldn't come here
            syslog_1.Syslog.error('Unexpected data received: ' + util_1.LogUtil.pretty(message), 'stream.spec');
        }, function (error) {
            expect(error.error)
                .toBe(testError.error);
            done();
        });
        channel.error(testError);
    });
    it('Should send and receive a completion', function (done) {
        channel.stream.subscribe(function (message) {
            // shouldn't come here
            syslog_1.Syslog.error('Unexpected data received: ' + util_1.LogUtil.pretty(message), 'stream.spec');
        }, function (error) {
            // shouldn't come here
            syslog_1.Syslog.error('Unexpected error received: ' + util_1.LogUtil.pretty(error), 'stream.spec');
        }, function () {
            expect(channel.isClosed)
                .toBeTruthy();
            syslog_1.Syslog.debug('Completion correctly received.', 'stream.spec');
            done();
        });
        channel.complete();
    });
});
