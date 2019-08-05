/**
 * Copyright(c) VMware Inc. 2016-2017
 */

//import { StompClient } from './stomp.client';
import { StompMessage, StompBusCommand, StompSubscription } from './stomp.model';
import { Message } from '../bus/model/message.model';
import { GeneralUtil } from '../util/util';

export class StompParser {

    // http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
    public static bufferToString(buf: ArrayBuffer): string {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    public static stringToArrayBuffer(str: string): ArrayBuffer {
        let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        let bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    public static marshal(command: string, headers?: any, body?: any): string {
        return StompParser.frame(command, headers, body).toString() + '\0';
    }

    public static unmarshal(data: any): StompMessage {
        let divider = data.search(/\n\n/);
        let headerLines = data.substring(0, divider).split('\n');
        let command = headerLines.shift();
        let headers: any = {};
        let body = '';

        // Parse headers
        let line: any, idx: number = null;
        for (let i: number = 0; i < headerLines.length; i++) {
            line = headerLines[i];
            idx = line.indexOf(':');
            headers[StompParser.trim(line.substring(0, idx))] =
                StompParser.trim(line.substring(idx + 1));
        }

        // Parse body, stopping at the first \0 found.
        let chr: string = null;
        for (let i: number = divider + 2; i < data.length; i++) {
            chr = data.charAt(i);
            if (chr === '\0') {
                break;
            }
            body += chr;
        }
        return StompParser.frame(command, headers, body);
    }

    public static byteCount(str: string): number {
        str = String(str);
        let bLen = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            bLen += c < (1 << 7) ? 1 :
                c < (1 << 11) ? 2 :
                    c < (1 << 16) ? 3 :
                        c < (1 << 21) ? 4 :
                            c < (1 << 26) ? 5 :
                                c < (1 << 31) ? 6 : Number.NaN;
        }
        return bLen;
    }

    public static frame(command: string, headers?: any, body?: any): StompMessage {
        if (body instanceof ArrayBuffer) {
            body = StompParser.bufferToString(body);
        }
        let parsedBody: string;
        if (typeof body === 'object') {
            parsedBody = JSON.stringify(body);
        } else {
            parsedBody = body;
        }
        return {
            command: command,
            headers: headers,
            body: body,
            toString: () => {
                let out = command + '\n';
                if (headers) {
                    for (let header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            out = out + header + ':' + headers[header] + '\n';
                        }
                    }
                }
                out = out + 'accept-version:1.2\n'; // hard wire this in, mandatory for spring 5.1.6+
                if (body) {
                    // build content-length not implemtened in original library
                    if (command === 'SEND') {
                        //out = out + 'content-length: ' +
                        //StompParser.byteCount(parsedBody.trim())  + '\n';
                    }
                }
                out = out + '\n';
                if (body) {
                    out = out + parsedBody.trim();
                }
                return out;
            }
        };
    }

    public static trim(str: string): string {
        return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    }

    /** 
     * @deprecated Use GeneraUtil
     */
    public static genUUID(): string {
        return GeneralUtil.genUUID();
    }

    /** 
     * @deprecated Use GeneraUtil
     */
    public static genUUIDShort(): string {
       return GeneralUtil.genUUIDShort();
    }


    // extract a bus command from a bus message.
    public static extractStompBusCommandFromMessage(msg: Message): StompBusCommand {
        if (msg !== null) {
            return msg.payload as StompBusCommand;
        }
        return null;
    }

    // extract a stomp message from a stomp command message.
    public static extractStompMessageFromBusCommand(cmd: StompBusCommand): StompMessage {
        if (cmd !== null) {
            return cmd.payload as StompMessage;
        }
        return null;
    }

    // extract a stomp message from a bus message.
    public static extractStompMessageFromBusMessage(msg: Message): StompMessage {
        if (msg !== null) {
            return StompParser.extractStompMessageFromBusCommand(StompParser
                .extractStompBusCommandFromMessage(msg));
        }
        return null;
    }

    // shortcut for creating bus commands for subscription requests
    public static generateStompBrokerSubscriptionRequest(sessionId: string,
                                                         destination: string,
                                                         subscriptionId: string,
                                                         isQueue: boolean,
                                                         brokerPrefix: string): StompSubscription {
        return {
            session: sessionId,
            destination: destination,
            id: subscriptionId,
            isQueue: isQueue,
            brokerPrefix: brokerPrefix
        };
    }

    // shortcut for creating bus commands
    public static generateStompBusCommand(command: string,
                                          sessionId?: string,
                                          destination?: string,
                                          payload?: any): StompBusCommand {

        return {
            destination: destination,
            session: sessionId,
            command: command,
            payload: payload
        };
    }

    // shortcut for generating outbound messages (messages to be sent to the broker)
    public static generateStompReadyMessage(message: string, headers?: Object): StompMessage {
        let header = headers || {};
        return StompParser.frame(
            'SEND',
            header,
            message
        );
    }

    // remove channel-hash
    public static convertChannelToSubscription(channel: string): string {
        // TODO: we need to create rules for channel creation.
        //return channel.replace("#","").toLowerCase().trim();
        return channel.trim();
    }

    // create galactic topic/queue detination
    public static generateGalacticDesintation(dest: string, channel: string, isQueue: boolean): string {
        return (isQueue ? '/user' : '') + dest + '/' + channel;
    }

    // convert destination back into a channel
    public static convertSubscriptionToChannel(subscription: string,
                                               topicOrQueueDesintation: string,
                                               isQueue: boolean): string {
        return subscription.replace(
            (isQueue ? '/user' + topicOrQueueDesintation : topicOrQueueDesintation) + '/',
            '');
    }

    // convert topic/queue back into a channel
    public static convertTopicOrQueueToChannel(subscription: string,
                                               brokerPrefix: string,
                                               isQueue: boolean): string {
        return subscription.replace(
            isQueue ? '/user' + brokerPrefix + '/' : brokerPrefix + '/', '').trim();
    }
}
