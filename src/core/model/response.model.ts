import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';
import { GeneralUtil } from '../../util/util';

export class APIResponse<PayloadT> extends AbstractFrame {

    public static build<PayloadT>(payload?: PayloadT,
                                  id: UUID = GeneralUtil.genUUID(),
                                  error: boolean = false,
                                  errorCode: number = 200,
                                  errorMessage: string = '',
                                  version: number = 1) {
        return new APIResponse(payload, error, errorCode, errorMessage, id, version);
    }

    public payload: PayloadT;
    public error: boolean;
    public errorMessage: string;
    public errorCode: number;

    constructor(payload: PayloadT, 
                error: boolean, 
                errorCode: number, 
                errorMessage: string, 
                id: UUID, 
                version: number) {
        super(id, version);
        this.payload = payload;
        this.error = error;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode; 
    }
}