/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component } from '@angular/core';
import { BusUtil } from '@vmw/transport/util/bus.util';
import { LogLevel } from '@vmw/transport/log';

// create bus and load services.
BusUtil.bootBusWithOptions(LogLevel.Debug, false);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatClientApp';
}
