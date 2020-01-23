import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';

export class APIResponse<PayloadT> extends AbstractFrame {

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
