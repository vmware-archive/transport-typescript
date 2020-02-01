import { AbstractMessageObject } from './abstract.messageobject';


export class ApiObject<TRequestObject, TResponseObject> {
    private apiHeaders = {};    // for API header parameters

    public readonly requestObject: AbstractMessageObject<any, any>;
    public readonly responseObject: AbstractMessageObject<any, any>;

    /**
     * The ApiObject is used to pass API call context between the service and the API handler
     *
     * @param {AbstractMessageObject<any, any>} requestObject
     * @param {AbstractMessageObject<any, any>} responseObject
     */
    constructor(requestObject: AbstractMessageObject<any, any>, responseObject: AbstractMessageObject<any, any>) {
        this.requestObject = requestObject;
        this.responseObject = responseObject;
    }

    public getHeaders(): any {
        return this.apiHeaders;
    }

    public addHeader(key: string, value: string) {
        this.getHeaders()[key] = value;
    }
}

