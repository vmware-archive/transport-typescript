/**
 * Copyright(c) VMware Inc. 2018
 */
import { ChannelName, EventBus, MessageType } from '../bus.api';
import { ProxyControlImpl } from './proxy.control';

export const GLOBAL = window;

export interface IFrameProxyControl {

    /**
     * Returns the mode in which the proxy is operating, Parent, Child or Hybrid (not implemented yet)
     */
    listeningAs(): ProxyType;

    /**
     * Returns true if the proxy is active.
     */
    isListening(): boolean;

    /**
     * Start the proxy listening to distributed bus broadcasts (if it's not listening)
     */
    listen(): void;

    /**
     * Stop the proxy from listening to distributed bus broadcasts (if it's currently active)
     */
    stopListening(): void;

    /**
     * Add a new authorized origin that is allowed to talk on the bus.
     * @param origin
     */
    addAllowedTargetOrigin(origin: string): void;

    /**
     * Remove an authorized origin that is allowed to talk on the distributed bus.
     * @param origin
     */
    removeAllowedTargetOrigin(origin: string): void;

    /**
     * Returns array of the currently authorized origins that are allowed to talk on the distributed bus
     */
    getAllowedOrigins(): string[];

    /**
     * Add a targeted frame to receive distributed bus events.
     * This is only applicable to a proxy running in Parent mode or Hybrid mode (not yet implemented)
     * @param frameId
     */
    addTargetedFrame(frameId: string): void;

    /**
     * Remove a targeted frame from receiving distributed bus events.
     * This is only applicable to a proxy running in Parent mode or Hybrid mode (not yet implemented)
     * @param frameId
     */
    removeTargetedFrame(frameId: string): void;

    /**
     * Retuns an array of all the frames currently being targeted by the proxy (must be running as parent or hybrid)
     */
    getTargetedFrames(): string[];

    /**
     * Ignore individual frames and target all the frames running in the DOM. Multipass!
     * @param allFrames
     */
    targetAllFrames(allFrames: boolean): void;

    /**
     * Is the proxy targeting all frames? Or is it targeting specific frames. Ring this bell to find out!
     */
    isTargetingAllFrames(): boolean;

    /**
     * List of all the currently authorized channels that are allowed to talk across the distributed bus.
     */
    getAuthorizedChannels(): ChannelName[];

    /**
     * Add a new authorized channel that is allowed to be re-broadcast across the distributed bus
     * @param channel
     */
    addAuthorizedChannel(channel: ChannelName): void;

    /**
     * Remove an authorized channel, it will no longer be able to talk across the distubuted bus and will
     * only operate on the local bus.
     * @param channel
     */
    removeAuthorizedChannel(channel: ChannelName): void;

    /**
     * Get the parent origin of the parent event bus
     */
    getParentOrigin(): string;

    /**
     * Change the parent origin, be careful with this, it could blow things up.
     * @param origin
     */
    setParentOrigin(origin: string): void;

    /**
     * Every time a child eventbus registers it's self with a parent, this list grows. Use it to find out who's talking.
     */
    getKnownBusInstances(): Map<string, ProxyState>;

    /**
     * Don't touch this unless you're building tests. It bypasses origin and self reference checks.
     */
    setDevMode(): void; // switch off super strict validation for tests.

    /**
     * Checks if the proxy is operating in dev/test mode. Should not be required ever in prod code.
     */
    inDevMode(): boolean; // check if proxy is in dev mode.
}

export type ProxyControl = IFrameProxyControl;

/**
 * Proxy Controls are special messages that facilitate bus operations for the proxy.
 */
export enum ProxyControlType {
    RegisterEventBus = 'Registration',
    BusStopListening = 'Stop Listening',
    BusStartListening = 'Start Listening'
}

/**
 * State management for the proxy. Esenttially who am I and am I listning?
 */
export interface ProxyState {
    type: ProxyType;
    active: boolean;
}

/**
 * Wrapper for ProxyControlType
 */
export interface ProxyControlPayload {
    proxyType: ProxyType;
    command: ProxyControlType;
    body: string;
}

/**
 * DTO for transporting messages between distributed event bus instances.
 */
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

/**
 * ProxyType defines which mode the proxy is operating in.
 * Parent = master bus
 * Child = bus running in an iFrame
 * Hybrid = not yet implemented.
 */
export enum ProxyType {
    Parent = 'parent',
    Child = 'child',
    Hybrid = 'hybrid'
}

/**
 * Configuration object supplied when creating a new proxy.
 */
export interface MessageProxyConfig {
    parentOrigin: string;
    acceptedOrigins: string[];
    targetAllFrames: boolean;
    targetSpecificFrames: string[];
    protectedChannels: string[];
    proxyType: ProxyType;
}

/**
 * MessageProxy transparently connects up event bus instances across the main application
 * and across child applications, running inside iframes. ShadowDOM support will make it in as an optional
 * variant, once we have WebComponent Support universally in browsers.
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