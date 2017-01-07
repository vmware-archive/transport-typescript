/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Type} from '@angular/core';
import {MessagebusService} from './messagebus.service';

export * from './messagebus.service';
export * from './message.model'
export * from './message.schema'
export * from './monitor.model'


export const BIFROST_BUS_DIRECTIVES: Type<any>[] = [
    MessagebusService
];
