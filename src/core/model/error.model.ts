export class GeneralError {
    public errorObject: any;
    public errorCode: any;

    constructor(public message: string, public status?: any) {

    }
}
