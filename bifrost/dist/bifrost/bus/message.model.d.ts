import { MessageSchema } from './message.schema';
/**
 * A Message object represents a single message on the message bus.
 * Messages can contain either a data payload or an error payload.
 * Messages can be a request, or a response. An error notification is always a response.
 * The content of the payload is opaque and its format is only decodable by the sender(s) and the receiver(s)
 * At present, there is only a placeholder for the Message Schema. This is expected to be replaced with JSON-schema
 */
export declare enum MessageType {
    MessageTypeRequest = 0,
    MessageTypeResponse = 1,
    MessageTypeError = 2,
}
export declare class Message {
    private _type;
    private _payload;
    private _isError;
    private _messageSchema;
    constructor(messageSchema?: MessageSchema);
    private build(type?, payload?, messageSchema?, error?);
    request(payload: any, messageSchema?: MessageSchema): this;
    response(payload: any, messageSchema?: MessageSchema): this;
    error(error: any, messageSchema?: MessageSchema): this;
    isRequest(): boolean;
    isResponse(): boolean;
    isError(): boolean;
    payload: any;
    readonly type: MessageType;
    readonly messageSchema: MessageSchema;
}
