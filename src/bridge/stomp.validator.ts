import {StompParser} from './stomp.parser';
import {StompClient} from './stomp.client';
import {StompMessage} from './stomp.model';
import {MonitorObject} from '../bus/monitor.model';
import {Message} from '../bus/message.model';

export class StompValidator {

    public static validateMonitorMessage(msg: Message): boolean {
        let mo = msg.payload as MonitorObject;
        if (mo && mo.channel) {
            return true;
        }
        return false;
    }

    public static validateConnectionMessage(msg: Message): boolean {

        // TODO: validate command schema
        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
        switch (busCommand.command) {
            case StompClient.STOMP_CONNECT:
                if (busCommand.payload !== null) {
                    return true;
                }
                break;

            case StompClient.STOMP_DISCONNECT:
                if (busCommand.session !== null) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }

    public static validateSubscriptionMessage(msg: Message): boolean {

        // TODO: validate command schema
        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
        switch (busCommand.command) {
            case StompClient.STOMP_SUBSCRIBE:
                if (busCommand.payload !== null && busCommand.destination !== null) {
                    return true;
                }
                break;

            case StompClient.STOMP_UNSUBSCRIBE:
                if (busCommand.payload !== null && busCommand.destination !== null) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    }

    public static validateInboundMessage(msg: Message): boolean {

        // TODO: validate command schema
        let busCommand = StompParser.extractStompBusCommandFromMessage(msg);
        switch (busCommand.command) {
            case StompClient.STOMP_SEND:
                if (busCommand.destination !== null && busCommand.session !== null) {
                    let message: StompMessage = busCommand.payload as StompMessage;
                    if (message && message.command === StompClient.STOMP_SEND
                        && message.body !== null) {
                        return true;
                    }
                }
                break;

            default:
                break;
        }
        return false;
    }
}
