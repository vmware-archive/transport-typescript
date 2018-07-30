/**
 * Copyright(c) VMware Inc. 2018
 */
import { ChannelName, EventBus, MessageType } from '../bus.api';
import { BusUtil } from '../util/bus.util';
import { LogLevel } from '../log/logger.model';
import { LogUtil } from '../log/util';

const globalAccessor = window;

export class BusProxyMessage {
    payload: any;
    channel: ChannelName;
    type: MessageType;
}

export enum ProxyType {
    Parent = 'parent',
    Child = 'child'
}

export interface MessageProxyConfig {
    targetOrigin: string[];
    targetAllFrames: boolean;
    targetSpecificFrames: string[];
    protectedChannels: string[];
    proxyType: ProxyType;
}

/**
 * MessageProxy transparently handles
 */
export class MessageProxy {

    protected static _instance: MessageProxy;

    /**
     * Kill instance of service.
     */
    public static destroy(): void {
        this._instance = null;

    }

    public static getInstance(): MessageProxy {
        return this._instance || (this._instance = new MessageProxy());
    }

    private bus: EventBus;

    /**
     * Track is proxy is operating.
     * @type {boolean}
     */
    private enabled: boolean = false;

    /**
     * Definition of the target origin(s) to be acceptable, for security purposes.
     */
    private targetOrigin: string[];

    /**
     * Target all frames? The proxy will broadcast to everyone listening. Defaults to true
     * @type {boolean}
     */
    private targetAllFrames: boolean = true;

    /**
     * Target specific frames only. The proxy will only broadcast to the defined frames
     */
    private targetedFrames: string[];

    /**
     * Proxy type: Children are bus instances inside frames. Parents are master bus instances in the parent DOM.
     *
     * @type {ProxyType.Parent}
     */
    private proxyType: ProxyType = ProxyType.Parent;


    /**
     * Handle inbound postMessage events.
     */
    private parentEventHandlerBinding: EventListenerObject;

    constructor() {
        this.bus = BusUtil.getBusInstance();
        this.parentEventHandlerBinding = this.parentEventHandler.bind(this);
    }

    /**
     * Add frame to liste of targets.
     * @param {string} frameId
     */
    public addFrame(frameId: string): void {
        if (this.targetedFrames.indexOf(frameId) < 0) {
            this.targetedFrames.push(frameId);
        }
    }

    /**
     * Enable proxy, pass in a configuration to set things in motion.
     *
     * @param {MessageProxyConfig} config
     */
    public enableProxy(config: MessageProxyConfig): void {

        this.enabled = true;
        this.targetOrigin = ['*']; // default, which is wide open, so this should be set!
        if (config) {
            if (config.targetOrigin) {
                this.targetOrigin = config.targetOrigin;
            }

            if (!config.targetAllFrames) {
                this.targetAllFrames = false;
            }

            if (config.targetSpecificFrames && config.targetSpecificFrames.length > 0) {
                this.targetedFrames = config.targetSpecificFrames;
            }

            if (config.proxyType) {
                this.proxyType = config.proxyType;
            }
        }
        // based on the proxy configuration, start listening in the appropriate manner.
        if (this.proxyType === ProxyType.Parent) {
            this.listenAsParent();
        } else {
            //this.listenAsChild();
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
                //if (data.channel)




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

    private listenAsParent() {

        // listen for everything coming in, handle before event is bubbled down the stack
        globalAccessor.addEventListener('message', this.parentEventHandlerBinding, {capture: true});


    }

    // private listenAsChild() {
    //
    // }

    // public validateProxyMessage(message: BusProxyMessage): boolean {
    //     if (!message) {
    //
    //
    //     }
    // }


}