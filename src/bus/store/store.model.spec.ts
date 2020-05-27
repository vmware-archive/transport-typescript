/*
 * Copyright 2017-2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { StoreStateChange } from './store.model';
import { EventBus } from '../../bus.api';
import { LogLevel } from '../../log';
import { BusTestUtil } from '../../util/test.util';

describe('BusStore Model [store/store.model]', () => {
    let bus: EventBus;

    beforeEach(() => {
        bus = BusTestUtil.bootBusWithOptions(LogLevel.Error, true);
        bus.api.silenceLog(true);
        bus.api.suppressLog(true);
    });

    it('Check model .', () => {
        const ss = new StoreStateChange('123', 'a', 'b');
        expect(ss.id).toEqual('123');
    });

});
