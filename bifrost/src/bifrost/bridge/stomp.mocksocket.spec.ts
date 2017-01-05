import {MockSocket} from './stomp.mocksocket';


let mocket: MockSocket;

beforeEach(() => {
    mocket = new MockSocket('nowhere');
});

describe('MockSocket [stomp.mocksocket]', () => {

    it('We should be able to use the getters and setters correctly', () => {

        expect(mocket.binaryType).toBeUndefined();
        expect(mocket.readyState).toEqual(WebSocket.OPEN);

        mocket.binaryType = 'arraybuffer';
        expect(mocket.binaryType).toEqual('arraybuffer');

        mocket.socketState = WebSocket.CLOSED;
        expect(mocket.readyState).toEqual(WebSocket.CLOSED);

    });

    it('We should be able to create a fake socket and register an event', () => {

        expect(mocket).not.toBeNull();

        let openListener = () => {
            return;
        };
        mocket.addEventListener('open', openListener);
        expect(mocket.events.hasOwnProperty('open')).toBeTruthy();

        mocket.addEventListener('open', openListener); // re-add should work the same
        expect(mocket.events.hasOwnProperty('open')).toBeTruthy();

    });

    it('We should be able to register an event and trigger it', () => {

        let openCalled: boolean = false;

        let openListener = (val: boolean) => {
            openCalled = val;
        };

        mocket.addEventListener('open', openListener);
        mocket.triggerEvent('open', [true]);

        expect(openCalled).toBeTruthy();

    });

    it('We should be able to register an event and trigger it with no args', () => {

        let openCalled: boolean = false;

        let openListener = () => {
            openCalled = true;
        };

        mocket.addEventListener('open', openListener);
        mocket.triggerEvent('open');

        expect(openCalled).toBeTruthy();

    });

    it('We should be able to call a non existent listener', () => {

        mocket.triggerEvent('noevent', [true]);
        expect(mocket.events.hasOwnProperty('noevent')).toBeFalsy();

    });

    it('We should be able to remove a listener', () => {

        let openListener = () => {
            return;
        };

        mocket.addEventListener('open', openListener);
        expect(mocket.events.hasOwnProperty('open')).toBeTruthy();

        mocket.removeEventListener('open');
        expect(mocket.events.hasOwnProperty('open')).toBeFalsy();

    });

    it('We should be set the state of the socket', () => {

        let openListener = () => {
            return;
        };

        mocket.addEventListener('open', openListener);
        expect(mocket.events.hasOwnProperty('open')).toBeTruthy();

        mocket.removeEventListener('open');
        expect(mocket.events.hasOwnProperty('open')).toBeFalsy();

    });
});


