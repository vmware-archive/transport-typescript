/**
 * Copyright(c) VMware Inc. 2018
 */
import {
    MessageProxyConfig,
    IFrameProxyControl,
    ProxyType,
    BusProxyMessage,
    ProxyControlType, ProxyControlPayload, ProxyState
} from './message.proxy.api';
import { LogLevel } from '../log/logger.model';
import { LogUtil } from '../log/util';
import { ChannelName, EventBus, EventBusEnabled, MessageType } from '../bus.api';
import { Observable } from 'rxjs';
import { MonitorChannel, MonitorObject, MonitorType } from '../bus/model/monitor.model';
import { Message } from '../bus/model/message.model';

const domWindow: any = window;

/**
 * Implementation of ProxyControl interface.
 */
export class ProxyControlImpl implements IFrameProxyControl, EventBusEnabled {

    private readonly proxyControlChannel: string = '__proxycontrol__';
    public readonly proxyId: string = EventBus.id;
    private devMode: boolean = false;

    /**
     * Handle inbound postMessage events.
     */
    private postMessageEventHandlerBinding: EventListenerObject;

    /**
     * Track is proxy is operating.
     * @type {boolean}
     */
    private registered: boolean = false;

    /**
     * Definition of the target origin(s) to be acceptable, for security purposes.
     */
    private targetOrigin: string[];

    /**
     * Target all frames? The proxy will broadcast to everyone online. Defaults to true
     * @type {boolean}
     */
    private targetAllFramesValue: boolean = true;

    /**
     * Target specific frames only. The proxy will only broadcast to the defined frames
     */
    private targetedFrames: string[];

    /**
     * Only authorized channels will be rebroadcast and handled, prevents unwanted payloads reaching private
     * internal channels, not intended to be exposed.
     */
    private authorizedChannels: ChannelName[];

    private monitorChannel: Observable<Message>;
    private monitorSubscription: any;
    private knownBusInstances: Map<string, ProxyState>;

    /**
     * Type of proxy operating.
     */
    private proxyType: ProxyType;

    private listening: boolean = false;
    private parentOriginValue: string;

    /**
     * Default proxy type is parent.
     * @param bus bus instance
     * @param config config object
     */
    constructor(private bus: EventBus, private config: MessageProxyConfig) {
        // do something

        this.authorizedChannels = []; // don't want this empty either.
        this.authorizedChannels.push(this.proxyControlChannel);

        this.targetOrigin = ['*']; // default, which is wide open, so this should be set!
        if (config) {
            if (config.acceptedOrigins) {
                this.targetOrigin = config.acceptedOrigins;
            }

            // pull out properties from config,
            if (!config.targetAllFrames) {
                this.targetAllFrames(false);
            }

            if (config.targetSpecificFrames && config.targetSpecificFrames.length > 0) {
                this.targetedFrames = config.targetSpecificFrames;
            } else {
                this.targetedFrames = []; // don't want it to be empty.
            }

            if (config.protectedChannels && config.protectedChannels.length > 0) {
                this.authorizedChannels = this.authorizedChannels.concat(config.protectedChannels);
            }

            if (config.parentOrigin) {
                this.parentOriginValue = config.parentOrigin;
            } else {
                this.parentOriginValue = '*';
            }

            // configure online type.
            if (config.proxyType) {
                this.proxyType = config.proxyType;
            }
        } else {
            this.bus.logger.error(
                'Message Proxy cannot start. No configuration has been set.', this.getName());
            return;
        }

        // connect to monitor;
        this.monitorChannel = this.bus.api.getChannel(MonitorChannel.stream);

        // create bus instance map
        this.knownBusInstances = new Map<string, ProxyState>();

        // start online by default
        this.listen();

    }

    listen(): void {
        if (!this.listening) {
            this.listening = true;
            this.postMessageEventHandlerBinding = this.parentEventHandler.bind(this);

            switch (this.config.proxyType) {
                case ProxyType.Parent:
                    this.listenForInboundMessageEvents();
                    this.relayMessagesToChildren();
                    break;

                case ProxyType.Child:
                    this.listenForInboundMessageEvents();
                    if (this.registered) {
                        this.informParentChildBusIsListening();
                    } else {
                        this.registerChildBusWithParent();
                    }
                    this.relayMessagesToParent();
                    break;

                case ProxyType.Hybrid:
                    // TODO: Build clean chaining mechanism for handling nested operations.
                    break;

                default:
                    break;
            }
        }
    }

    private registerChildBusWithParent(): void {

        const proxyCommand: ProxyControlPayload = {
            command: ProxyControlType.RegisterEventBus,
            body: EventBus.id,
            proxyType: this.proxyType
        };
        this.sendControlToParent(proxyCommand);
        this.registered = true;
    }

    private informParentChildBusIsListening(): void {

        const proxyCommand: ProxyControlPayload = {
            command: ProxyControlType.BusStartListening,
            body: EventBus.id,
            proxyType: this.proxyType
        };
        this.sendControlToParent(proxyCommand);

    }

    private informParentChildBusStoppedListening(): void {

        const proxyCommand: ProxyControlPayload = {
            command: ProxyControlType.BusStopListening,
            body: EventBus.id,
            proxyType: this.proxyType
        };
        this.sendControlToParent(proxyCommand);

    }

    private listenForInboundMessageEvents(): void {
        if (!this.registered) {
            domWindow.addEventListener('message', this.postMessageEventHandlerBinding, true);
        }
    }

    private relayMessagesToChildren(): void {

        // use the low level bus API's for this work.
        this.monitorSubscription = this.monitorChannel.subscribe(
            (message: Message) => {

                let mo = message.payload as MonitorObject;
                switch (mo.type) {
                    case MonitorType.MonitorData:

                        // is this for an authorized channel?
                        for (let chan of this.authorizedChannels) {

                            if (mo.channel === chan) {
                                this.sendMessageToChildFrames(mo.data, chan);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        );
    }

    private relayMessagesToParent(): void {

        // use the low level bus API's for this work.
        this.monitorSubscription = this.monitorChannel.subscribe(
            (message: Message) => {

                let mo = message.payload as MonitorObject;
                switch (mo.type) {
                    case MonitorType.MonitorData:

                        // is this for an authorized channel?
                        for (let chan of this.authorizedChannels) {
                            if (mo.channel === chan && !mo.data.proxyRebroadcast) {
                                if (message.sender !== EventBus.id) {

                                    this.sendMessageToParent(mo.data, chan);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        );

    }

    private sendMessageToParent(message: Message, chan: ChannelName): void {
        this.bus.logger.debug(
            `Authorized message received on: [${chan}], sending to parent frame`, this.getName());

        const proxyMessage: BusProxyMessage = new BusProxyMessage(JSON.stringify(message),
            chan, message.type, EventBus.id);

        parent.window.postMessage(proxyMessage, '*');

    }

    private sendControlToParent(control: ProxyControlPayload): void {
        this.bus.logger.debug(
            `Authorized control message command: '${control.command}' ` +
            `received, sending to parent frame`,
            this.getName());

        const proxyMessage: BusProxyMessage =
            new BusProxyMessage(JSON.stringify(control), this.proxyControlChannel,
                MessageType.MessageTypeControl, EventBus.id);
        proxyMessage.control = control.command;
        parent.window.postMessage(proxyMessage, '*');

    }

    private sendMessageToChildFrames(message: Message, chan: ChannelName): void {
        this.bus.logger.debug(
            `Authorized message received on: [${chan}], from ${message.sender}, sending to children`, this.getName());


        const proxyMessage: BusProxyMessage =
            new BusProxyMessage(JSON.stringify(message), chan, message.type, message.sender);

        // if targeting all frames, extract all frames on the page and post messages to them.
        if (this.targetAllFramesValue) {
            const frames: any = domWindow.frames;
            const frameCount = domWindow.frames.length;
            if (frameCount > 0) {
                for (let i = 0; i < frameCount; i++) {
                    frames[i].postMessage(proxyMessage, '*');
                }
            }
        }

        if (this.targetedFrames.length > 0) {
            for (let frameId of this.targetedFrames) {
                const frame = domWindow.document.getElementById(frameId).contentWindow;
                if (frame) {
                    frame.postMessage(proxyMessage, '*');
                }
            }
        }
    }


    private parentEventHandler(event: MessageEvent): void {
        if (!this.listening) {
            return; // ignore everything, not interested.
        }

        // drop the message if it originated from this bus, otherwise we will see duplicates.
        // dev mode skips this check.
        if (!this.devMode && event.data && event.data.from) {
            if (event.data.from === EventBus.id) {
                return;
            }
        }

        // check origin
        let originOk = this.targetOrigin.indexOf(event.origin) >= 0;

        if (!originOk) {
            this.bus.logger.warn(
                `Event bus broadcast refused by bus ${EventBus.id}, origin not registered: ${event.origin}`, this.getName());
            return;
        }

        // check if the message contains a payload, and check if it is a serialized bus message.
        if (event.data && event.data !== '') {

            const data: any = event.data;

            if (data.hasOwnProperty('channel') && data.hasOwnProperty('type') && data.hasOwnProperty('payload')) {

                // validate proxy message
                if (data.channel === null || data.channel === '') {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. No channel supplied', this.getName());
                    return;
                }
                if (data.type === null || data.type === '') {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. No message type supplied', this.getName());
                    return;
                }
                if (data.payload === null || data.payload === '') {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. Payload is empty', this.getName());
                    return;
                }

                // looks like the message is valid, lets check the channel for authorization.
                if (!this.validateChannel(data.channel)) {
                    this.bus.logger.warn(
                        'Proxy Message valid, but channel is not authorized: [' + data.channel + ']', this.getName());
                    return;
                } else {

                    // regular messages are JSON endoded, control messages are not.
                    let payload: ProxyControlPayload;
                    try {

                        // try to parse the payload, an errors and we know it's a control message not a regular message.
                        payload = JSON.parse(data.payload) as ProxyControlPayload;
                        data.payload = payload; // copy deserialized object back in.

                    } catch (e) {
                        // control message, no need to parse.
                        payload = data.payload as ProxyControlPayload;
                    }

                    // everything checks out!
                    // determine if this event is a control event or a regular message to proxy
                    if (data.control != null) {

                        let state: ProxyState;
                        let mo: MonitorObject;

                        switch (data.control) {

                            // register bus.
                            case ProxyControlType.RegisterEventBus:

                                // only proceed if bus is a new reg.
                                if (!this.knownBusInstances.has(payload.body)) {
                                    this.knownBusInstances.set(payload.body, {type: payload.proxyType, active: true});
                                    this.bus.logger.info(
                                        `Child Event Bus Registered: ${payload.body}`, this.getName());

                                    // inform monitor
                                    mo = new MonitorObject().build(MonitorType.MonitorChildProxyRegistered,
                                        this.proxyControlChannel, payload.body, payload.body);
                                    this.bus.api.getMonitorStream().send(new Message().response(mo));
                                }

                                break;

                            // set instance to active.
                            case ProxyControlType.BusStartListening:
                                state = this.knownBusInstances.get(payload.body);
                                if (state) {
                                    state.active = true;
                                }
                                this.knownBusInstances.set(payload.body, state);

                                // inform monitor
                                mo = new MonitorObject().build(MonitorType.MonitorChildProxyListening,
                                    this.proxyControlChannel, payload.body, payload.body);
                                this.bus.api.getMonitorStream().send(new Message().response(mo));
                                break;

                            // set instance to inactive.
                            case ProxyControlType.BusStopListening:
                                state = this.knownBusInstances.get(payload.body);
                                if (state) {
                                    state.active = false;
                                }
                                this.knownBusInstances.set(payload.body, state);
                                this.listening = false; // drop everything, no-longer interested.

                                // inform monitor
                                mo = new MonitorObject().build(MonitorType.MonitorChildProxyNotListening,
                                    this.proxyControlChannel, payload.body, payload.body);
                                this.bus.api.getMonitorStream().send(new Message().response(mo));
                                break;

                            default:
                                break;
                        }

                    } else {
                        this.proxyMessage(data);
                    }
                }

            } else {
                this.bus.logger.debug(
                    'Message Ignored, not intended for the bus.', this.getName());
                this.bus.logger.group(LogLevel.Info, '📦 Message Payload (Ignored)');
                this.bus.logger.debug(LogUtil.pretty(data));
                this.bus.logger.groupEnd(LogLevel.Info);
                return;
            }
        } else {

            this.bus.logger.debug(
                'Message Ignored, it contains no payload', this.getName());
            return;
        }
    }

    private validateChannel(requestedChannel: ChannelName): boolean {
        return this.authorizedChannels.includes(requestedChannel);
    }

    // keeping this for now, may need it later.
    // private rebuildMessage(message: any, type: MessageType, sender: string): Message {
    //     let msg: Message;
    //     switch (type) {
    //         case MessageType.MessageTypeRequest:
    //             msg = new Message(message.id).request(message.payload);
    //             break;
    //
    //         case MessageType.MessageTypeResponse:
    //             msg = new Message(message.id).response(message.payload);
    //             break;
    //
    //         case MessageType.MessageTypeError:
    //             msg = new Message(message.id).error(message.payload);
    //             break;
    //
    //     }
    //     msg.sender = sender;
    //     return msg;
    // }

    private proxyMessage(message: BusProxyMessage): void {


        let msg = message.payload;
        msg.proxyRebroadcast = true;

        switch (message.type) {

            case MessageType.MessageTypeRequest:
                this.bus.sendRequestMessageWithId(message.channel, msg.payload, msg.id, message.from, true);
                break;

            case MessageType.MessageTypeResponse:
                this.bus.sendResponseMessageWithId(message.channel, msg.payload, msg.id, message.from, true);

                break;

            case MessageType.MessageTypeError:
                this.bus.sendErrorMessage(message.channel, msg.payload, message.from, true);
                break;

        }
    }

    listeningAs(): ProxyType {
        return this.proxyType;
    }


    stopListening(): void {
        if (this.listening) {
            this.monitorSubscription.unsubscribe();
            this.informParentChildBusStoppedListening();
            domWindow.removeEventListener('message', this.postMessageEventHandlerBinding, true);
        }
    }

    targetAllFrames(allFrames: boolean): void {

        // can only be applied if there are no target frames registered;
        if (!this.targetedFrames || this.targetedFrames.length <= 0) {
            this.targetAllFramesValue = allFrames;
        }
    }

    isTargetingAllFrames(): boolean {
        return this.targetAllFramesValue;
    }

    addAllowedTargetOrigin(origin: string): void {
        if (this.targetOrigin.indexOf(origin) < 0) {
            this.targetOrigin.push(origin);
        }
    }

    addTargetedFrame(frameId: string): void {
        if (this.targetedFrames.indexOf(frameId) < 0) {
            this.targetedFrames.push(frameId);
        }
    }

    addAuthorizedChannel(channel: ChannelName): void {
        if (this.authorizedChannels.indexOf(channel) < 0) {
            this.authorizedChannels.push(channel);
        }
    }

    removeAllowedTargetOrigin(origin: string): void {
        const index = this.targetOrigin.indexOf(origin);
        if (index >= 0) {
            this.targetOrigin.splice(index, 1);
        }
    }

    removeAuthorizedChannel(channel: ChannelName): void {
        const index = this.authorizedChannels.indexOf(channel);
        if (index >= 0) {
            this.authorizedChannels.splice(index, 1);
        }
    }

    removeTargetedFrame(frameId: string): void {
        const index = this.targetedFrames.indexOf(frameId);
        if (index >= 0) {
            this.targetedFrames.splice(index, 1);
        }
    }

    getAuthorizedChannels(): ChannelName[] {
        // remove proxy control channel from list.
        let chans = this.authorizedChannels;
        const index = this.authorizedChannels.indexOf(this.proxyControlChannel);
        if (index >= 0) {
            chans.splice(0, 1);
        }
        return chans;
    }

    getAllowedOrigins(): string[] {
        return this.targetOrigin;
    }

    getTargetedFrames(): string[] {
        return this.targetedFrames;
    }

    isListening(): boolean {
        return this.listening;
    }

    getParentOrigin(): string {
        return this.parentOriginValue;
    }

    setParentOrigin(origin: string): void {
        this.parentOriginValue = origin;
    }

    getKnownBusInstances(): Map<string, ProxyState> {
        return new Map(this.knownBusInstances.entries());
    }

    inDevMode(): boolean {
        return this.devMode;
    }

    getName(): string {
        return this.proxyId;
    }

    setDevMode(): void {
        this.devMode = true;
    }
}
