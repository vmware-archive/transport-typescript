/**
 * Copyright(c) VMware Inc. 2019
 */

/**
 * Contains advanced options for configuring a new bridge connection.
 */
export class BridgeConnectionAdvancedConfig {

   /**
    * Optional function to be used for starting new intervals instead of
    * the standard "setInterval" function.
    *
    * For example, an Angular app can provide a function that starts intervals
    * outside of the NgZone.
    */
   public startIntervalFunction: (handler: any, timeout?: any, ...args: any[]) => number;

   /**
    * Outgoing heartbeat interval in milliseconds.
    * Specify 0 to disable outgoing heartbeat.
    */
   public heartbeatOutgoingInterval: number = 30000;

   /**
    * Incoming heartbeat interval in milliseconds.
    * Specify 0 to disable incoming heartbeat.
    */
   public heartbeatIncomingInterval: number = 0;
}
