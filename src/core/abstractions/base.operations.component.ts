/**
 * Copyright(c) VMware Inc. 2018
 */
import { AbstractBase } from './abstract.base';
import { Mixin } from '../util/operation.mixin';
import { AbstractOperations } from './abstract.operations';
import { ChannelName, MessageFunction } from '../../bus.api';
import { GeneralError } from '../model/error.model';

@Mixin([AbstractOperations])
export abstract class AbstractOpsComponent extends AbstractBase implements AbstractOperations {
    callService: <RequestType, RetPayload>(
        channel: ChannelName,
        request: RequestType,
        successHandler: MessageFunction<RetPayload>,
        errorHandler?: MessageFunction<GeneralError>) => void;
}