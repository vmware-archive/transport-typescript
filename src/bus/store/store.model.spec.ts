/**
 * Copyright(c) VMware Inc. 2017
 */

import { MessagebusService } from '../index';
import { UUID, StoreStateChange } from './store.model';
import { BusStore, StoreStream, MutateStream } from '../store.api';
import { MessageFunction } from '../model/message.model';
import { EventBus } from '../bus.api';
import { LogLevel } from '../../log/index';


describe('BusStore [cache/cache]', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = new MessagebusService(LogLevel.Error);
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
        //bus.createStore('string');
    });

    afterEach(() => {
        //bus.getStore('string').reset();
    });

    it('Check model .', () => {
        const ss = new StoreStateChange('123', 'a', 'b');
        expect(ss.id).toEqual('123');

    });

});