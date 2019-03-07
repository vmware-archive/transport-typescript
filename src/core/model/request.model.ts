import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';
import { GeneralUtil } from '../../util/util';

export class APIRequest<PayloadT> extends AbstractFrame {

    public static build<ReqP>(request: string,
                              payload?: ReqP, id: UUID = GeneralUtil.genUUIDShort(),
                              version: number = 1): APIRequest<ReqP> {
        return new APIRequest<ReqP>(request, payload, id, version);
    }

    public payload: PayloadT;
    public request: string;

    constructor(request: string, payload: PayloadT, id: UUID, version: number) {
        super(id, version);
        this.request = request;
        this.payload = payload;
    }
}