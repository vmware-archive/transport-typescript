import {StompClient} from './stomp.client';
import {StompParser} from './stomp.parser';
export class MockSocket {

    public events: any = {};
    private _socketState: number = WebSocket.OPEN;
    private _binaryType: string;

    public transaction: boolean = false;
    public transactionId: string;
    public receiptId: string;

    constructor(private url?: string) {
        // fire once the mock socket has been created and returned.
        setTimeout(() => this.triggerEvent('open', [true]), 0);
    }

    set binaryType(bt: string) {
        this._binaryType = bt;
    }

    get binaryType(): string {
        return this._binaryType;
    }

    set socketState(state: number) {
        this._socketState = state;
    }

    get readyState(): number {
        return this._socketState;
    }

    send(data: any): void {
        let frame = StompParser.unmarshal(data);
        switch (frame.command) {
            case StompClient.STOMP_CONNECT:
                setTimeout(() => {
                    this._socketState = WebSocket.OPEN;
                    this.triggerEvent('message', [{
                        data: StompParser.marshal(StompClient.STOMP_CONNECTED, {}, '')
                    }]);
                }, 0);
                break;

            case StompClient.STOMP_SEND:
                if (!this.transaction) {
                    setTimeout(() => {
                        this.triggerEvent('message', [{
                            data: StompParser.marshal(StompClient.STOMP_MESSAGE, frame.headers, frame.body)
                        }]);
                    }, 0);
                }
                break;

            case StompClient.STOMP_BEGIN:
                this.transaction = true;
                this.transactionId = frame.headers.transaction;
                this.receiptId = frame.headers.receipt;
                break;

            case StompClient.STOMP_COMMIT:
                this.transaction = false;
                setTimeout(() => {
                    this.triggerEvent('message', [{
                        data: StompParser.marshal(StompClient.STOMP_RECEIPT, {'receipt-id': this.receiptId})
                    }]);
                }, 0);
                break;

            case StompClient.STOMP_ABORT:
                this.transaction = false;
                setTimeout(() => {
                    this.triggerEvent('message', [{
                        data: StompParser.marshal(StompClient.STOMP_RECEIPT, {'receipt-id': this.receiptId})
                    }]);
                }, 0);
                break;

            case StompClient.STOMP_ERROR:
                this.transaction = false;
                setTimeout(() => {
                    this.triggerEvent('message', [{
                        data: StompParser.marshal(StompClient.STOMP_ERROR, frame.headers, frame.body)
                    }]);
                }, 0);
                break;

            case StompClient.STOMP_DISCONNECT:
                setTimeout(() => {
                    this._socketState = WebSocket.CLOSED;
                    this.triggerEvent('close');
                }, 0);
                break;

            default:
                break;
        }
    }

    addEventListener(name: string, handler: any): void {
        if (this.events.hasOwnProperty(name)) {
            this.events[name].push(handler); // reassign
        } else {
            this.events[name] = [handler] as any; // assign
        }
    }

    removeEventListener(name: string): void {
        if (this.events.hasOwnProperty(name)) {
            delete this.events[name];
        }
    }

    triggerEvent(name: string, args?: Array<any>): MockSocket {
        if (!this.events.hasOwnProperty(name)) {
            return;
        }
        if (!args || !args.length) {
            args = [];
        }

        let events: any = this.events[name], l: number = events.length;
        for (let i = 0; i < l; i++) {
            events[i].apply(null, args); //fire
        }
        return this;
    }
}
