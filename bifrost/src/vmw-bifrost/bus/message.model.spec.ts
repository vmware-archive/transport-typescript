import {Message, MessageType} from './message.model';
import {BifrostModule} from '../bifrost.module';
import {TestBed} from '@angular/core/testing';


/**
 * This is the unit test for the Stream model.
 */



beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [BifrostModule.forRoot()]
    });
});

describe('Stream Model [stream]', () => {

    let message: Message;

    let testError = {
        error: 'fake error'
    };

    let testData = {
        data: 'fake data'
    };

    beforeEach(function () {
        message = new Message();
    });

    it('Should check instantiation and getters/setters',
        () => {
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
                .toBe(MessageType.MessageTypeRequest);
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
        }
    );
});

