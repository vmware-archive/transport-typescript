import { UUID } from '../store/store.model';
import { StompParser } from '../../bridge/stomp.parser';
import { GeneralUtil } from '../../util/util';

export abstract class AbstractFrame {
    public id: UUID;
    public created: number;
    public version: number;
    public headers?: {[key: string]: any};
    
    constructor(id: UUID = GeneralUtil.genUUID(), version: number = 1, headers?: {[key: string]: any}) {
        this.id = id;
        this.version = version;
        this.created = Date.now();
        if (headers) {
            this.headers = headers;
        }
    }
}
