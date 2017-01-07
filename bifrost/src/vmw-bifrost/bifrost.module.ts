/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {MessagebusService} from './bus/messagebus.service';
import {LoggerService} from './log/logger.service';

import {BIFROST_LOG_DIRECTIVES} from './log/index';
import {BIFROST_BUS_DIRECTIVES} from './bus/index';
import {BIFROST_BRIDGE_DIRECTIVES} from './bridge/index';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        //BIFROST_BUS_DIRECTIVES,
        //BIFROST_LOG_DIRECTIVES,
        //BIFROST_BRIDGE_DIRECTIVES
    ],
    exports: [
        //BIFROST_BUS_DIRECTIVES,
        //BIFROST_LOG_DIRECTIVES,
        //BIFROST_BRIDGE_DIRECTIVES
    ],
    providers: [MessagebusService]
})
export class BifrostModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BifrostModule,
            providers: [MessagebusService]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: BifrostModule,
            providers: []
        };
    }
}
