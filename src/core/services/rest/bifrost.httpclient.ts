/**
 * Copyright(c) VMware Inc. 2018
 */
import { HttpClient } from './http.client';
import { GeneralError } from '../../model/error.model';

export class BifrostHttpclient implements HttpClient {

    delete(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    get(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    patch(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    post(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    put(request: Request, successHandler: Function, failureHandler: Function): void {
        this.httpOperation(request, successHandler, failureHandler);
    }

    private httpOperation(
        request: Request,
        successHandler: Function,
        errorHandler: Function
    ) {

        // use magic fetch!
        fetch(
            request
        ).then(
            (response: Response) => {
                if (response.ok) {
                   return response.text();
                }
                throw response;
            }
        ).then(
            (response) => {
                try {
                    successHandler(JSON.parse(response));
                } catch (e) {
                    successHandler(response);
                }
            }
        ).catch(
             (error: Response) => {
                 try {
                     error.text().then(
                         resp => {
                             const errorObject = JSON.parse(resp);
                             let message = `HTTP Error ${error.status}: ${error.statusText}`;
                             if (errorObject.hasOwnProperty('message')) {
                                 message += ` -  ${errorObject.message}`;
                             }
                             errorHandler(new GeneralError(message));
                         }
                     );
                 } catch (e) {
                     errorHandler(new GeneralError(`Fatal HTTP Error: ${e}`));
                 }
            }
        );
    }
}