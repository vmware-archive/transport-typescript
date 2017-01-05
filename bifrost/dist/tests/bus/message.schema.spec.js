"use strict";
var message_schema_1 = require('bifrost/bus/message.schema');
var testing_1 = require('@angular/core/testing');
/**
 * This is the unit test for the Stream model.
 */
describe('Schema Model [stream]', function () {
    var schema;
    var schemaName = 'test-schema';
    beforeEach(testing_1.inject([], function () {
        schema = new message_schema_1.MessageSchema(schemaName);
    }));
});
