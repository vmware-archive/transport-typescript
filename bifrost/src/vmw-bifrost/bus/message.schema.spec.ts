import {MessageSchema} from './message.schema';
import {inject} from '@angular/core/testing';

/**
 * This is the unit test for the Stream model.
 */


describe('Schema Model [stream]', () => {

    let schema: MessageSchema;
    let schemaName = 'test-schema';

    beforeEach(inject([], () => {
        schema = new MessageSchema(schemaName);
    }));
});

