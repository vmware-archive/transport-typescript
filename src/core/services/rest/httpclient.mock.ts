// This is a mock of the httpClient

export class MockHttpClient {
    public mustFail = false;
    public errCode = 200;

    constructor() {
    }

    public get(uri: string, pathParams: any, queryParams: any, requestHeaders: any,
               successHandler: Function, failureHandler: Function) {
        this.respond('GET called', successHandler, failureHandler);

    }

    public post(uri: string, pathParams: any, queryParams: any, requestHeaders: any, body: any,
                successHandler: Function, failureHandler: Function) {
        this.respond('POST called', successHandler, failureHandler);
    }

    public put(uri: string, pathParams: any, queryParams: any, requestHeaders: any, body: any,
               successHandler: Function, failureHandler: Function) {
        this.respond('PUT called', successHandler, failureHandler);
    }

    public patch(uri: string, pathParams: any, queryParams: any, requestHeaders: any, body: any,
                 successHandler: Function, failureHandler: Function) {
        this.respond('PATCH called', successHandler, failureHandler);
    }

    public delete(uri: string, pathParams: any, queryParams: any, requestHeaders: any, body: any,
                  successHandler: Function, failureHandler: Function) {
        this.respond('DELETE called', successHandler, failureHandler);
    }

    private respond(payload: string, successHandler: Function, failureHandler: Function) {
        if (this.mustFail) {
            if (this.errCode !== 401) {     // to simulate unknown error
                failureHandler(null);
                return;
            }

            const err: any = {};
            err['status'] = this.errCode;
            err['message'] = 'Fake Error';
            failureHandler(err);
        } else {
            successHandler(payload);
        }
    }
}
