import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';
import { GeneralUtil } from '../../util/util';

export class APIRequest<PayloadT> extends AbstractFrame {

    public static build<ReqP>(request: string,
                              messageHeader?: {[key: string]: any}, payload?: ReqP,
                              id: UUID = GeneralUtil.genUUID(), version: number = 1): APIRequest<ReqP> {
        return new APIRequest<ReqP>(request, payload, id, version, messageHeader);
    }

    public headers: {[key: string]: any};
    public payload: PayloadT;
    public request: string;

    constructor(request: string, payload: PayloadT, id: UUID, version: number, headers?: {[key: string]: any}) {
        super(id, version);
        this.request = request;
        this.payload = payload;
        this.headers = headers;
    }
}
