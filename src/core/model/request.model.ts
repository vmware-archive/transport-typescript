import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';
import { GeneralUtil } from '../../util/util';

export class APIRequest<PayloadT> extends AbstractFrame {

    public static build<ReqP>(command: string, 
                              payload?: ReqP, id: UUID = GeneralUtil.genUUIDShort(),
                              version: number = 1): APIRequest<ReqP> {
        return new APIRequest<ReqP>(command, payload, id, version);
    }

    public payload: PayloadT;
    public command: string;

    constructor(command: string, payload: PayloadT, id: UUID, version: number) {
        super(id, version);
        this.command = command;
        this.payload = payload;
    }
}