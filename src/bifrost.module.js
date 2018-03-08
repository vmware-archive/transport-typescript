/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */

/**
 * This is a ready made module for angular applications.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessagebusService } from './bus/messagebus.service';
var BifrostModule = (function () {
    function BifrostModule() {
    }
    BifrostModule.forRoot = function () {
        return {
            ngModule: BifrostModule,
            providers: [MessagebusService]
        };
    };
    BifrostModule.forChild = function () {
        return {
            ngModule: BifrostModule,
            providers: []
        };
    };
    BifrostModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ]
                },] },
    ];
    /** @nocollapse */
    BifrostModule.ctorParameters = function () { return []; };
    return BifrostModule;
}());
export { BifrostModule };