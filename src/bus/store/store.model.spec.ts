/**
 * Copyright(c) VMware Inc. 2017
 */

import { BifrostEventBus } from '../index';
import { StoreStateChange } from './store.model';
import { EventBus } from '../../bus.api';
import { LogLevel } from '../../log/index';


describe('BusStore Model [store/store.model]', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = BifrostEventBus.rebootWithOptions(LogLevel.Error, true);
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
    });

    it('Check model .', () => {
        const ss = new StoreStateChange('123', 'a', 'b');
        expect(ss.id).toEqual('123');
    });

});