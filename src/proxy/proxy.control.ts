/**
 * Copyright(c) VMware Inc. 2018
 */
import { BusProxyMessage, GLOBAL, MessageProxyConfig, ProxyControl, ProxyType } from './message.proxy';
import { LogLevel } from '../log/logger.model';
import { LogUtil } from '../log/util';
import { EventBus } from '../bus.api';
import { BusUtil } from '../util/bus.util';

export class ProxyControlImpl implements ProxyControl {

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
     * Bus instance.
     */
    private bus: EventBus;

    /**
     * Type of proxy operating.
     */
    private proxyType: ProxyType;

    /**
     * Default proxy type is parent.
     * @param {ProxyType} proxyType
     */
    constructor(private config: MessageProxyConfig) {
        // do something
        this.listen();
        this.bus = BusUtil.getBusInstance();
        this.targetOrigin = ['*']; // default, which is wide open, so this should be set!
        if (config) {
            if (config.targetOrigin) {
                this.targetOrigin = config.targetOrigin;
            }

            if (!config.targetAllFrames) {
                this.targetAllFrames(false);
            }

            if (config.targetSpecificFrames && config.targetSpecificFrames.length > 0) {
                this.targetedFrames = config.targetSpecificFrames;
            }

            if (config.proxyType) {
                this.proxyType = config.proxyType;
            }
        }

    }

    addAllowedTargetOrigin(origin: string): void {
        // something
    }

    addTargetedFrame(frameId: string): void {
        if (this.targetedFrames.indexOf(frameId) < 0) {
            this.targetedFrames.push(frameId);
        }
    }

    getAllowedOrigins(): string[] {
        return undefined;
    }

    getTargetedFrames(): string[] {
        return undefined;
    }

    isListening(): boolean {
        return false;
    }

    listen(): void {
        if (this.enabled) {

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

    removeAllowedTargetOrigin(origin: string): void {
        // something
    }

    removeTargetedFrame(frameId: string): void {
        // something
    }

    stopListening(): void {
        // something
    }

    targetAllFrames(allFrames: boolean): void {
        this.targetAllFramesValue = allFrames;
    }

    isTargetingAllFrames(): boolean {
        return this.targetAllFramesValue;
    }


}