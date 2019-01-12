import { AbstractService } from './abstract.service';
import { ChannelName } from '../../bus.api';

// This is here for name compatibility with Servgen - Everything is handled in AbstractService.
export abstract class AbstractAutoService<ReqT, RespT> extends AbstractService<ReqT, RespT> {
    protected constructor(name: string, requestChannel: ChannelName, broadcastChannel?: ChannelName) {
        super(name, requestChannel, broadcastChannel);
    }
}
