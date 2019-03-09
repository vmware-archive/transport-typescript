import { UUID } from '../store/store.model';
import { StompParser } from '../../bridge/stomp.parser';
import { GeneralUtil } from '../../util/util';

export abstract class AbstractFrame {
    public id: UUID;
    public created: number;
    public version: number;
    
    constructor(id: UUID = GeneralUtil.genUUIDShort(), version: number = 1) {
        this.id = id;
        this.version = version;
        this.created = Date.now();
    }
}
