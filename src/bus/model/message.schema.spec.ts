/**
 * Copyright(c) VMware Inc. 2016-2017
 */

import {MessageSchema} from './message.schema';



describe('MessageSchema Tests [message.schema]', () => {
        let schema: MessageSchema;
    
        beforeEach(function () {
            schema = new MessageSchema('testy', 'mctesty', 'testface', 'test payload');
        });
    
        it('Should check instantiation and getters/setters',
            () => {
                expect(schema._title).toEqual('testy');
                
                schema._title = 'new testy';
                expect(schema._title).toEqual('new testy');
                
                expect(schema._description).toEqual('mctesty');

                schema._description = 'mcdonalds';
                expect(schema._description).toEqual('mcdonalds');

                expect(schema._type).toEqual('test payload');
                
                schema._type = 'bigmac';
                expect(schema._type).toEqual('bigmac');

            }
        );
    });
    
    
