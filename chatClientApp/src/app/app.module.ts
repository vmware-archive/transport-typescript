/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatClientComponent } from './chat-client/chat-client.component';
import { VmcTaskComponent } from './vmc-task/vmc-task.component';
import { FormsModule } from '@angular/forms';
import { TaskSubTitlePipe, TaskTitlePipe } from './chat-client/task-title.pipe';
import { ChildFrameAComponent } from './child-frame-a/child-frame-a.component';
import { ChildFrameBComponent } from './child-frame-b/child-frame-b.component';
import { ChildFrameCComponent } from './child-frame-c/child-frame-c.component';
import { ChildFrameDComponent } from './child-frame-d/child-frame-d.component';
import { RouterModule, Routes } from '@angular/router';
import { VmwComponentsModule } from '@vmw/ngx-components';

const appRoutes: Routes = [
    { path: 'chatA', component: ChildFrameAComponent },
    { path: 'chatB', component: ChildFrameBComponent },
    { path: 'chatC', component: ChildFrameCComponent },
    { path: 'chatD', component: ChildFrameDComponent },
    { path: '', component: AppComponent },

];

@NgModule({
    declarations: [
        AppComponent,
        ChatClientComponent,
        VmcTaskComponent,
        TaskTitlePipe,
        TaskSubTitlePipe,
        ChildFrameAComponent,
        ChildFrameBComponent,
        ChildFrameCComponent,
        ChildFrameDComponent,
    ],
    imports: [
        BrowserModule,
        ClarityModule,
        FormsModule,
        BrowserAnimationsModule,
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
