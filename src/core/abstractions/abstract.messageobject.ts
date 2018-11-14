/**
 * This is the abstract class for both request and response objects passed in messages to/from services
 */

export abstract class AbstractMessageObject<TRequest, TPayload> {
    /**
     * The AbstractMessageObject is the superclass for all service request and response objects.
     * Optional parameters are necessary for creating empty Response objects in typescript with generics
     *
     * @param request - enumerated TRequest
     * @param channel - string channel for service requests
     * @param payload - request and response payloads
     */
    constructor(public readonly request?: TRequest, public readonly channel?: string | null | undefined, public payload?: TPayload) {
    }
}
