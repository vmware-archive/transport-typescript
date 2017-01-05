/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var messagebus_service_1 = require('./bus/messagebus.service');
var logger_service_1 = require('./log/logger.service');
var index_1 = require('./log/index');
var index_2 = require('./bus/index');
var BifrostModule = (function () {
    function BifrostModule() {
    }
    BifrostModule.forRoot = function () {
        return {
            ngModule: BifrostModule,
            providers: [messagebus_service_1.MessagebusService, logger_service_1.LoggerService]
        };
    };
    BifrostModule.forChild = function () {
        return {
            ngModule: BifrostModule,
            providers: []
        };
    };
    BifrostModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
            ],
            declarations: [
                index_2.BIFROST_BUS_DIRECTIVES,
                index_1.BIFROST_LOG_DIRECTIVES
            ],
            exports: [
                index_2.BIFROST_BUS_DIRECTIVES,
                index_1.BIFROST_LOG_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], BifrostModule);
    return BifrostModule;
}());
exports.BifrostModule = BifrostModule;
