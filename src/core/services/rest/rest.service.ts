import { AbstractBase } from '../../abstractions/abstract.base';
import { EventBusEnabled } from '../../../bus.api';

/**
 * REST Service that operates standard functions on behald of consumers and services.
 */
export class RestService extends AbstractBase implements EventBusEnabled {

    private static _instance: RestService;

    /**
     * Destroy the service completely.
     */
    public static destroy(): void {
        this._instance = null;
    }

    /**
     * Get reference to singleton RestService instance.
     * @returns {ApiOperations}
     */
    public static getInstance(): RestService {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        super('Rest Service');
    }
    //
    // constructor(private http: HttpClient) {
    //     super('rest.service');
    //
    //     this.headers = new HttpHeaders();
    //     // Those headers don't seem necessary
    //     this.headers.append('Content-Type', 'application/json; charset=utf-8');
    //     this.headers.append('Accept', 'application/json');
    //
    //     this.listenForRequests();
    // }
    // //
    // getName() {
    //     return 'RestService';
    // }
    //
    // private updateDevModeHeaders(): void {
    //     // if (this.devModeManager.isDevMode() && this.devModeManager.getH5cXsrfToken()) {
    //     //     // For accessing Live virgo data
    //     //     this.headers = new HttpHeaders({ 'X-VSPHERE-UI-XSRF-TOKEN': this.devModeManager.getH5cXsrfToken() });
    //     // }
    // }
    //
    // /**
    //  * stubbed implementation task preloader from interface
    //  * @returns {Observable<boolean>}
    //  */
    // onPreloadApplicationTask$(appEnvironment: any): Observable<boolean> {
    //     return of(true);
    // }
    //
    // private listenForRequests() {
    //     this.bus.listenRequestStream(RestChannel.all).handle((restObject: RestObject, args: MessageArgs) => {
    //         restObject.refreshRetries = 0;
    //         this.doHttpRequest(restObject, args);
    //     });
    // }
    //
    // private doHttpRequest(restObject: RestObject, args: MessageArgs) {
    //     let observer: Observable<HttpResponse<any>>; // todo: type the generic, any is not right
    //     this.updateDevModeHeaders();
    //
    //     switch (restObject.request) {
    //         case HttpRequest.Get:
    //             observer = this.http.get(restObject.uri, {
    //                 observe: 'response',
    //                 headers: this.headers,
    //                 params: restObject.params
    //             });
    //             break;
    //
    //         case HttpRequest.Post:
    //             observer = this.http.post(restObject.uri, restObject.body, {
    //                 observe: 'response',
    //                 headers: this.headers,
    //                 params: restObject.params
    //             });
    //             break;
    //
    //         case HttpRequest.Patch:
    //             observer = this.http.patch(restObject.uri, restObject.body, {
    //                 observe: 'response',
    //                 headers: this.headers,
    //                 params: restObject.params
    //             });
    //             break;
    //
    //         case HttpRequest.Put:
    //             observer = this.http.put(restObject.uri, restObject.body, {
    //                 observe: 'response',
    //                 headers: this.headers,
    //                 params: restObject.params
    //             });
    //             break;
    //
    //         case HttpRequest.Delete:
    //             observer = this.http.delete(restObject.uri, {
    //                 observe: 'response',
    //                 headers: this.headers,
    //                 params: restObject.params
    //             });
    //             break;
    //
    //         default:
    //             this.log.error('Bad ReST all: ' + restObject, this.getName());
    //             this.handleError(new RestError('Invalid HTTP
    // all.', RestErrorType.UnknownMethod, restObject.uri), restObject, args);
    //             return;
    //     }
    //
    //     // ---------------  hardcode network rules from server codes ----------------
    //     // this is a observable that completes
    //     observer.subscribe(
    //         (networkEnvelope: HttpResponse<any>) => {
    //             // if we get a No Content response, the payload is just empty
    //             if (networkEnvelope.status === 204) {
    //                 this.handleData({}, restObject, args);
    //                 return;
    //             }
    //
    //             try {
    //                 const payload = networkEnvelope.body; // raw or JSON
    //                 this.handleData(payload, restObject, args);
    //             } catch (e) {
    //                 // Handle invalid payloads as errors
    //                 const msg = networkEnvelope.body;
    //
    //                 // dont understand this, hence commenting
    //
    //                 // if (msg.length === 0) {
    //                 //    msg = networkEnvelope.toString();
    //                 // }
    //
    //                 const error = new RestError(msg, networkEnvelope.status, restObject.uri);
    //                 this.handleError(error, restObject, args);
    //             }
    //         },
    //         (r: HttpErrorResponse) => {
    //             let restError;
    //             try {
    //                 const code = r.status;
    //                 const errorMessage = r.error instanceof Error ? r.error.message : r.message;
    //                 restError = new RestError(errorMessage, code, restObject.uri);
    //             } catch (e) {
    //                 let msg = r.message;
    //
    //                 // usually 504 comes in as a huge HTML block from the load balancer,
    //                 // we don't want to show this to the user, so replace it with a short string.
    //                 const troublesomeErrorCodeList = [502, 504];
    //
    //                 if (troublesomeErrorCodeList.indexOf(r.status) >= 0) {
    //                     msg = 'Request timed out';
    //                 }
    //
    //                 // fall back to the content of the response as a last resort
    //                 if (msg.length === 0) {
    //                     msg = r.toString();
    //                 }
    //
    //                 restError = new RestError(msg, r.status, restObject.uri);
    //             }
    //
    //             this.handleError(restError, restObject, args);
    //         }
    //     );
    // }
    //
    // private handleData(data: any, restObject: RestObject, args: MessageArgs) {
    //     this.log.group(LogLevel.Debug, 'Http ' + HttpRequest[restObject.request] + ' ' + restObject.uri);
    //     this.log.debug('** Received response: ' + data, this.getName());
    //     this.log.debug('** Request was: ' + restObject, this.getName());
    //     this.log.debug('** Headers were: ' + this.headers, this.getName());
    //     this.log.groupEnd(LogLevel.Debug);
    //
    //     restObject.response = data;
    //     this.bus.sendResponseMessageWithId(restObject.responseChannel, restObject, args.uuid, this.getName());
    // }
    //
    // private handleError(error: RestError, restObject: RestObject, args: MessageArgs) {
    //     this.log.group(LogLevel.Error, 'Http Error: ' + HttpRequest[restObject.request] + ' ' +
    // restObject.uri + ' -' + ' ' + error.status);
    //     this.log.error(error, this.getName());
    //     this.log.error('** Request was: ' + restObject.body, this.getName());
    //     this.log.error('** Headers were: ' + this.headers, this.getName());
    //     this.log.groupEnd(LogLevel.Error);
    //
    //     switch (error.status) {
    //         case 401:
    //             // Retry the all to give the backend time to refresh the expired token
    //             if (restObject.refreshRetries++ < REFRESH_RETRIES) {
    //                 setTimeout(() => this.doHttpRequest(restObject, args));
    //             } else {
    //                 this.bus.sendErrorMessage(restObject.responseChannel, error, this.getName());
    //             }
    //             break;
    //
    //         default:
    //             this.bus.sendErrorMessage(restObject.responseChannel, error, this.getName());
    //     }
    // }
}
