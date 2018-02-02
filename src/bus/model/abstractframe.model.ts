import { UUID } from '../cache/cache.model';
import { StompParser } from '../../bridge/stomp.parser';

export abstract class AbstractFrame {
    public id: UUID;
    public created: number;
    public version: number;
    
    constructor(id: UUID = StompParser.genUUID() , version: number = 1) {
        this.id = id;
        this.version = version;
        this.created = Date.now();
    }
}