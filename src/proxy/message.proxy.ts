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
    getKnownBusInstances(): Map<string, ProxyState>;
    setDevMode(): void; // switch off super strict validation for tests.
}

export type ProxyControl = IFrameProxyControl;


export enum ProxyControlType {
    RegisterEventBus = 'Registration',
    BusStopListening = 'Stop Listening',
    BusStartListening = 'Start Listening'
}



export interface ProxyState {
    type: ProxyType;
    active: boolean;
}

export interface ProxyControlPayload {
    proxyType: ProxyType;
    command: ProxyControlType;
    body: string;
}


export class BusProxyMessage {
    public from: string;
    public payload: any;
    public channel: ChannelName;
    public type: MessageType;
    public control: ProxyControlType = null;

    constructor(
        payload: any,
        channel: ChannelName,
        type: MessageType,
        from?: string) {

        this.payload = payload;
        this.channel = channel;
        this.type = type;
        this.from = from;
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

    public setDevMode(): void {

        if (this.proxyControl) {
            this.proxyControl.setDevMode();
        }
    }

}