/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { VmwComponentsModule } from '@vmw/ngx-components';
import { FormsModule } from '@angular/forms';
import { ServbotComponent } from './servbot/servbot.component';
import { VMCBotComponent } from './vmcbot/vmcbot.component';
import { RestyComponent } from './resty/resty.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
    { path: '', component: MainComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        ServbotComponent,
        VMCBotComponent,
        RestyComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        ClarityModule,
        ClrFormsNextModule,
        BrowserAnimationsModule,
        HttpClientModule,
        VmwComponentsModule.forRoot(),
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false}
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
