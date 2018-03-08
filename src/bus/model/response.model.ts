import { AbstractFrame } from './abstractframe.model';
import { UUID } from '../store/store.model';
import { StompParser } from '../../bridge/stomp.parser';
export class GalacticResponse<PayloadT> extends AbstractFrame {

    public static build<PayloadT>(payload?: PayloadT,
                                  id: UUID = StompParser.genUUID(), 
                                  error: boolean = false,
                                  errorCode: number = 200,
                                  errorMessage: string = '',
                                  version: number = 1) {
        return new GalacticResponse(payload, error, errorCode, errorMessage, id, version);
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