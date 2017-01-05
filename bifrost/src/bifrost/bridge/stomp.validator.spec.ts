import {StompParser} from './stomp.parser';
import {StompClient} from './stomp.client';
import {StompMessage, StompBusCommand} from './stomp.model';
import {StompCommandSchema} from './stomp.schema';
import {StompValidator} from './stomp.validator';
import {MonitorObject, MonitorType} from '../bus/monitor.model';
import {Message} from '../bus/message.model';

export function main() {

    describe('Stomp Validator [stomp.validator]', () => {

        it('Check that connection messages can be validated',
            () => {

                let id = StompParser.genUUID();

                //missing payload.
                let stompMessage = StompParser.frame(StompClient.STOMP_CONNECT);
                let message = packageStompMessage(StompClient.STOMP_CONNECT, id, null);

                expect(StompValidator.validateConnectionMessage(message)).toBeFalsy();

                // missing session id.
                stompMessage = StompParser.frame(StompClient.STOMP_DISCONNECT);
                message = packageStompMessage(StompClient.STOMP_DISCONNECT, null, stompMessage);

                expect(StompValidator.validateConnectionMessage(message)).toBeFalsy();

                // valid
                stompMessage = StompParser.frame(StompClient.STOMP_CONNECT);
                message = packageStompMessage(StompClient.STOMP_CONNECT, id, stompMessage);

                expect(StompValidator.validateConnectionMessage(message)).toBeTruthy();
            }
        );

        it('Check that subscription messages can be validated',
            () => {

                let id = StompParser.genUUID();

                //missing payload.
                let message = packageStompMessage(StompClient.STOMP_SUBSCRIBE, id, null);

                expect(StompValidator.validateSubscriptionMessage(message)).toBeFalsy();

                //missing payload.
                message = packageStompMessage(StompClient.STOMP_UNSUBSCRIBE, id, null);
                expect(StompValidator.validateSubscriptionMessage(message)).toBeFalsy();

                // valid
                let stompMessage = StompParser.frame(StompClient.STOMP_SUBSCRIBE);
                message = packageStompMessage(StompClient.STOMP_SUBSCRIBE, id, stompMessage);

                expect(StompValidator.validateSubscriptionMessage(message)).toBeTruthy();
            }
        );

        it('Check that monitor messages can be validated',
            () => {

                let mo: MonitorObject = new MonitorObject().build(
                    MonitorType.MonitorNewChannel,
                    '#bleep-blip-bloop',
                    'somewhereOuthere'
                );

                expect(StompValidator.validateMonitorMessage(new Message().request(mo))).toBeTruthy();

                mo.channel = null;
                expect(StompValidator.validateMonitorMessage(new Message().request(mo))).toBeFalsy();
                expect(StompValidator.validateMonitorMessage(new Message().request(null))).toBeFalsy();
            }
        );

        it('Check that inbound messages (outbound requests) can be validated',
            () => {

                let id = StompParser.genUUID();


                //missing session.
                let message = packageStompMessage(StompClient.STOMP_SEND, null, null);

                expect(StompValidator.validateInboundMessage(message)).toBeFalsy();

                // wrong command
                message = packageStompMessage(StompClient.STOMP_DISCONNECT, null, null);

                expect(StompValidator.validateInboundMessage(message)).toBeFalsy();


                // wrong message command
                let stompMessage = StompParser.frame(StompClient.STOMP_COMMIT, {}, 'hiya georgie!');
                message = packageStompMessage(StompClient.STOMP_SEND, id, stompMessage);

                expect(StompValidator.validateInboundMessage(message)).toBeFalsy();

                // missing body
                stompMessage = StompParser.frame(StompClient.STOMP_SEND, {}, null);
                message = packageStompMessage(StompClient.STOMP_SEND, id, stompMessage);

                expect(StompValidator.validateInboundMessage(message)).toBeFalsy();


                // valid
                stompMessage = StompParser.frame(StompClient.STOMP_SEND, {}, 'hiya georgie');
                message = packageStompMessage(StompClient.STOMP_SEND, id, stompMessage);

                expect(StompValidator.validateInboundMessage(message)).toBeTruthy();
            }
        );

    });
}

function generateBusCommand(cmd: string,
                            id: string,
                            msg: StompMessage,
                            destination: string = 'somewhere'): StompBusCommand {

    return StompParser.generateStompBusCommand(
        cmd,
        id,
        destination,
        msg
    );
}

function packageStompMessage(cmd: string, id: string, msg: StompMessage): Message {
    return new Message().request(generateBusCommand(cmd, id, msg), new StompCommandSchema());
}
