/**
 * Copyright(c) VMware Inc. 2018
 */
import { BusProxyMessage, GLOBAL, MessageProxyConfig, IFrameProxyControl, ProxyType } from './message.proxy';
import { LogLevel } from '../log/logger.model';
import { LogUtil } from '../log/util';
import { ChannelName, EventBus } from '../bus.api';

export class ProxyControlImpl implements IFrameProxyControl {

    /**
     * Handle inbound postMessage events.
     */
    private parentEventHandlerBinding: EventListenerObject;


    /**
     * Track is proxy is operating.
     * @type {boolean}
     */
    private enabled: boolean = true;

    /**
     * Definition of the target origin(s) to be acceptable, for security purposes.
     */
    private targetOrigin: string[];

    /**
     * Target all frames? The proxy will broadcast to everyone listening. Defaults to true
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

    /**
     * Type of proxy operating.
     */
    private proxyType: ProxyType;

    private listening: boolean = false;

    /**
     * Default proxy type is parent.
     * @param {ProxyType} proxyType
     */
    constructor(private bus: EventBus, private config: MessageProxyConfig) {
        // do something
        this.listen();
        this.targetOrigin = ['*']; // default, which is wide open, so this should be set!
        if (config) {
            if (config.targetOrigin) {
                this.targetOrigin = config.targetOrigin;
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
                this.authorizedChannels = config.protectedChannels;
            } else {
                this.authorizedChannels = []; // don't want this empty either.
            }

            // configure listening type.
            if (config.proxyType) {
                this.proxyType = config.proxyType;
            }
        }

    }


    listen(): void {
        if (this.enabled && !this.listening) {
            this.listening = true;
            switch (this.config.proxyType) {
                case ProxyType.Parent:
                    this.parentEventHandlerBinding = this.parentEventHandler.bind(this);
                    GLOBAL.addEventListener('message', this.parentEventHandlerBinding, {capture: true});
                    break;

                case ProxyType.Child:
                    // do something
                    break;

                case ProxyType.Hybrid:
                    break;

                default:
                    break;
            }
        }
    }

    private parentEventHandler(event: MessageEvent): void {

        // check origin
        let originOk;
        for (let origin of this.targetOrigin) {
            originOk = origin === '*'; // if this is in place, we don't care.
            if (!originOk && origin === event.origin) {
                originOk = true;
            }
        }

        if (!originOk) {
            this.bus.logger.warn(
                'Message refused, origin not registered: ' + event.origin, 'MessageProxy');
            return;
        }

        // check if the message contains a payload, and check if it is a serialized bus message.
        if (event.data && event.data !== '') {
            const data: any = event.data;
            if (data instanceof BusProxyMessage) {

                // validate proxy message
                if (!data.channel) {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. No channel supplied', 'MessageProxy');
                    return;
                }
                if (!data.type) {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. No message type supplied', 'MessageProxy');
                    return;
                }
                if (!data.payload) {
                    this.bus.logger.warn(
                        'Proxy Message invalid - ignored. Payload is empty', 'MessageProxy');
                    return;
                }

                console.log('looks good!', data);


            } else {
                this.bus.logger.debug(
                    'Message Ignored, not intended for the bus.', 'MessageProxy');
                this.bus.logger.group(LogLevel.Info, '📦 Message Payload (Ignored)');
                this.bus.logger.debug(LogUtil.pretty(data));
                this.bus.logger.groupEnd(LogLevel.Info);
                return;
            }
        } else {

            this.bus.logger.debug(
                'Message Ignored, it contained no payload', 'MessageProxy');
            return;

        }
    }

    listeningAs(): ProxyType {
        return this.proxyType;
    }



    stopListening(): void {
        this.listening = false;
    }

    targetAllFrames(allFrames: boolean): void {

        // can only be applied if there are no target frames registered;
        if (!this.targetedFrames || this.targetedFrames.length <=0) {
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
        return this.authorizedChannels;
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


}