/**
 * Copyright(c) VMware Inc. 2018
 */
import { ChannelName, EventBus, MessageType } from '../bus.api';
import { BusUtil } from '../util/bus.util';
import { ProxyControlImpl } from './proxy.control';

export const GLOBAL = window;

export interface ProxyControl {
    listeningAs(): ProxyType;
    isListening(): boolean;
    listen(): void;
    stopListening(): void;
    addAllowedTargetOrigin(origin: string): void;
    removeAllowedTargetOrigin(origin: string): void;
    getAllowedOrigins(): string[];
    addTargetedFrame(frameId: string): void;
    removeTargetedFrame(frameId: string): void;
    getTargetedFrames(): string[];
    targetAllFrames(allFrames: boolean): void;
}

export class BusProxyMessage {
    payload: any;
    channel: ChannelName;
    type: MessageType;
}

export enum ProxyType {
    Parent = 'parent',
    Child = 'child',
    Hybrid = 'hybrid'
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

    private proxyControl: ProxyControl;

    constructor() {
        this.bus = BusUtil.getBusInstance();
    }


    /**
     * Enable proxy, pass in a configuration to set things in motion.
     *
     * @param {MessageProxyConfig} config
     */
    public enableProxy(config: MessageProxyConfig): ProxyControl {

        if (!this.proxyControl) {
            this.proxyControl = new ProxyControlImpl(config);
        }
        return this.proxyControl;

    }


}