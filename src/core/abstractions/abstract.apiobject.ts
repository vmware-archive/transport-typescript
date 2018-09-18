import { AbstractMessageObject } from './abstract.messageobject';

export class ApiObject<TRequestObject, TResponseObject> {
    public readonly requestObject: AbstractMessageObject<any, any>;
    public readonly responseObject: AbstractMessageObject<any, any>;
    public readonly orgId: string;
    public readonly token: string;

    /**
     * The ApiObject is used to pass API call context between the service layer and the API layer via "Apigen"
     * orgId and token are placeholders for now.
     *
     * @param {string} orgId - placeholder for the org of the caller - needed by VMC APIs and others
     * @param {string} token - placeholder for the session token - not needed until the service layer is detached
     * @param {AbstractMessageObject<any, any>} requestObject
     * @param {AbstractMessageObject<any, any>} responseObject
     */
    constructor(orgId: string,
                token: string,
                requestObject: AbstractMessageObject<any, any>,
                responseObject: AbstractMessageObject<any, any>) {
        this.requestObject = requestObject;
        this.responseObject = responseObject;
        this.orgId = orgId;
        this.token = token;
    }
}
