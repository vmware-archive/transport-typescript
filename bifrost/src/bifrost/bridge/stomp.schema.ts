import {MessageSchema} from '../bus/message.schema';

export const stompCommandPayload = {
    '_destination': {
        'type': 'string',
        'description': 'Destination on broker (mapped to bus channel)',
        'required': false,
    },
    '_session': {
        'type': 'string',
        'description': 'Each broker maintains its own session id and subscriptions.'
    },
    '_command': {
        'type': 'string',
        'description': 'STOMP command being issued'
    },
    '_payload': {
        'type': ['object', 'any'],
        'required': false,
    },
 };

export const stompConfigPayload = {
    '_endpoint': {
        'type': 'string',
        'description': 'Endpoint on broker to connect to (required)',
        'required': true,
    },
    '_host': {
        'type': 'string',
        'description': 'Hostname (or IP) of broker',
        'required': true,
    },
    '_port': {
        'type': 'number',
        'description': 'Port number broker is listening on',
        'required': true,
    },
    '_user': {
        'type': 'string',
        'description': 'Username for broker (should be supplied by auth system)',
        'required': false,
    },
    '_pass': {
        'type': 'string',
        'description': 'Password for broker (should be supplied by auth system)',
        'required': false,
    },
    '_userSSL': {
        'type': 'boolean',
        'description': 'Use secure sockets (wss://)',
        'required': false,
    },
    '_requreACK': {
        'type': 'boolean',
        'description': 'Require ACK?',
        'required': false,
    },
    '_hearbeatIn': {
        'type': 'number',
        'description': 'Heartbeats required from broker ever (n) ms.',
        'required': false,
    },
    '_hearbeatOut': {
        'type': 'number',
        'description': 'Heartbeat will be sent ever (n) ms by the client.',
        'required': false,
    }
};


/**
 * Schema for STOMP communications between client, service and bus
 */
export class StompConfigSchema extends MessageSchema {

    constructor () {
        super('STOMP Config Schema', 'Schema sending connection configurations', stompConfigPayload);
    }
}


export class StompCommandSchema extends MessageSchema {

    constructor () {
        super('STOMP Command Schema', 'Schema for sending commands & messages on channels', stompCommandPayload);
    }
}
