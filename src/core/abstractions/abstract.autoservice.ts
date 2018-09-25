import { AbstractService } from './abstract.service';

// This is here for name compatibility with Servgen - Everything is handled in AbstractService.
export abstract class AbstractAutoService<ReqT, RespT> extends AbstractService<ReqT, RespT> {
    protected constructor(name: string, requestChannel: string) {
        super(name, requestChannel);
    }
}
