/**
 * Copyright(c) VMware Inc. 2018
 */
import { ChannelName, EventBus, MessageType } from '../bus.api';
import { ProxyControlImpl } from './proxy.control';

export const GLOBAL = window;

export interface IFrameProxyControl {
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
    isTargetingAllFrames(): boolean;
    getAuthorizedChannels(): ChannelName[];
    addAuthorizedChannel(channel: ChannelName): void;
    removeAuthorizedChannel(channel: ChannelName): void;
    getParentOrigin(): string;
    setParentOrigin(origin: string): void;

}

export type ProxyControl = IFrameProxyControl;

export class BusProxyMessage {
    public payload: any;
    public channel: ChannelName;
    public type: MessageType;

    constructor(
        payload: any,
        channel: ChannelName,
        type: MessageType) {

        this.payload = payload;
        this.channel = channel;
        this.type = type;
    }
}

export enum ProxyType {
    Parent = 'parent',
    Child = 'child',
    Hybrid = 'hybrid'
}

export interface MessageProxyConfig {
    parentOrigin: string;
    acceptedOrigins: string[];
    targetAllFrames: boolean;
    targetSpecificFrames: string[];
    protectedChannels: string[];
    proxyType: ProxyType;
}

/**
 * MessageProxy transparently handles
 */
export class MessageProxy {

    constructor(private bus: EventBus) {
    // do something
    }

    private proxyControl: IFrameProxyControl;

    /**
     * Enable proxy, pass in a configuration to set things in motion.
     *
     * @param {MessageProxyConfig} config
     */
    public enableProxy(config: MessageProxyConfig): ProxyControl {

        if (!this.proxyControl) {
            this.proxyControl = new ProxyControlImpl(this.bus, config);
        }
        return this.proxyControl;

    }


}