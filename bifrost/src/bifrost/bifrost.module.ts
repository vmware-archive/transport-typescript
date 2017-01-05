/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {MessagebusService} from './bus/messagebus.service';
import {LoggerService} from './log/logger.service';

import {BIFROST_LOG_DIRECTIVES} from './log/index';
import {BIFROST_BUS_DIRECTIVES} from './bus/index';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        BIFROST_BUS_DIRECTIVES,
        BIFROST_LOG_DIRECTIVES
    ],
    exports: [
        BIFROST_BUS_DIRECTIVES,
        BIFROST_LOG_DIRECTIVES
    ]
    //providers: [
    //    MessagebusService,
    //    LoggerService
   // ]
})
export class BifrostModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BifrostModule,
            providers: [MessagebusService, LoggerService]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: BifrostModule,
            providers: []
        };
    }
}
