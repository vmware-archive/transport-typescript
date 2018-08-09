import { MessageArgs, MessageFunction } from '../../bus.api';
import { AbstractBase } from './abstract.base';
import { HttpRequest, RestError } from '../services/rest/rest.model';
import { APIRequest } from '../model/request.model';
import { APIResponse } from '../model/response.model';
import { UUID } from '../../bus';
import { GeneralUtil } from '../../util/util';
import { GeneralError } from '../model/error.model';

export const SERVICE_ERROR = 505;
export type RequestorArguments = MessageArgs;

const HTTP_REQUEST_MAP: Array<[string, HttpRequest]> = [
    ['GET', HttpRequest.Get],
    ['POST', HttpRequest.Post],
    ['PATCH', HttpRequest.Patch],
    ['PUT', HttpRequest.Put],
    ['DELETE', HttpRequest.Delete]
];

/**
 * This is an abstract service that encapsulates messagebus handling and implements some
 * of the more commonly used methods by the derived services. The derived classes provide
 * handlers for when a all is received or when there is a response from a ReST all.
 * The error handler can be overridden in the derived class.
 *
 * ReqT is the type of the all payload to the service (e.g. RolesRequestObject)
 * RespT is the type of the response payload from the service (e.g. RolesResponseObject)
 */
export abstract class AbstractService<ReqT, RespT> extends AbstractBase {
    protected serviceError: RestError;

    private requestConverterMap: Map<string, HttpRequest>;

    /**
     * super()
     *
     * @param name - name of the derived service (e.g. 'task.service'
     * @param bus - reference to the messagebus service instance
     * @param requestChannel - channel on which to listen for requests for the derived service
     */
    protected constructor(name: string, requestChannel: string) {

        super(name);
        this.serviceError = new RestError('Invalid Service APIRequest!', SERVICE_ERROR, '');
        this.requestConverterMap = new Map<string, HttpRequest>(HTTP_REQUEST_MAP);

        this.bus.listenRequestStream(requestChannel, this.getName())
            .handle((requestObject: ReqT, args: RequestorArguments) => {
                    this.handleServiceRequest(requestObject, args);
                });
    }

    // Required method in the derived service
    protected abstract handleServiceRequest(requestObject: ReqT, requestArgs?: MessageArgs): void;

    /**
     * RestError to use for invalid requests
     *
     * @returns {RestError}
     */
    protected get serviceRequestError(): RestError {
        return this.serviceError;
    }

    /**
     *  Method to send a response object to the client of the service
     * @param {string} channel to respond to
     * @param {RespT} responseObject response object to send
     * @param {MessageArgs} args optional arguments to pass.
     */
    protected postResponse(channel: string, responseObject: RespT, args?: MessageArgs): void {
        if (args) {
            this.bus.sendResponseMessageWithIdAndVersion(channel, responseObject, args.uuid, args.version, args.from);
        } else {
            this.bus.sendResponseMessage(channel, responseObject, this.getName());
        }
    }

    /**
     * Method to send a RestError to the client of the service
     * @param {string} channel channel to sent error to.
     * @param {RestError} err returned from rest service.
     * @param {MessageArgs} args optional arguments to pass.
     */
    protected postError(channel: string, err: GeneralError, args?: MessageArgs): void {
        if (args) {
            this.bus.sendErrorMessageWithIdAndVersion(channel, err, args.uuid, args.version, args.from);
        } else {
            this.bus.sendErrorMessage(channel, err, this.getName());
        }
    }

    /**
     * Make a galactic command to any services operating on the extended bus
     *
     * @param {APIRequest<GReqT>} request
     * @param {string} channel
     * @param {MessageFunction<GRespT>} handler
     */
    protected makeGalacticRequest<GReqT, GRespT>(request: APIRequest<GReqT>,
                                                 channel: string,
                                                 handler: MessageFunction<GRespT>) {

        this.bus.requestGalactic(channel, request,
            (response: APIResponse<GRespT>, args: MessageArgs) => {
                if (handler) {
                    handler(response.payload, args);
                }
            }
        );
    }

    /**
     * Build a API request command object
     *
     * @param {string} requestType
     * @param {T} payload
     * @param {UUID} uuid
     * @param {number} version
     * @returns {APIRequest<T>}
     */
    protected buildAPIRequest<T>(requestType: string, payload: T,
                                 uuid: UUID = GeneralUtil.genUUID(),
                                 version: number = 1): APIRequest<T> {

        return new APIRequest(requestType, payload, uuid, version);
    }
}
