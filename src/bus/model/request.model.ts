import { AbstractFrame } from './abstractframe.model';
import { UUID } from '../store/store.model';
import { GeneralUtil } from '../../util/util';
export class GalacticRequest<PayloadT> extends AbstractFrame {

    public static build<ReqP>(type: string, 
                              payload?: ReqP, id: UUID = GeneralUtil.genUUIDShort(),
                              version: number = 1): GalacticRequest<ReqP> {
        return new GalacticRequest<ReqP>(type, payload, id, version);
    }

    public payload: PayloadT;
    public type: string;

    constructor(type: string, payload: PayloadT, id: UUID, version: number) {
        super(id, version);
        this.type = type;
        this.payload = payload;
    }
}