/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {MessagebusService} from './bus/messagebus.service';

@NgModule({
    imports: [
        CommonModule
    ]
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
