import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ChildFrameAComponent } from './child-frame-a/child-frame-a.component';
import { ChildFrameBComponent } from './child-frame-b/child-frame-b.component';
import { ChildFrameCComponent } from './child-frame-c/child-frame-c.component';
import { MainComponent } from './main/main.component';
import { VmwComponentsModule } from '@vmw/ngx-components';
import { FormsModule } from '@angular/forms';
import { ChatClientComponent } from './chat-client/chat-client.component';
import { ServbotComponent } from './servbot/servbot.component';
import { VMCBotComponent } from './vmcbot/vmcbot.component';
import { TaskSubTitlePipe, TaskTitlePipe } from './chat-client/task-title.pipe';
import { VmcTaskComponent } from './vmc-task/vmc-task.component';

const appRoutes: Routes = [
    { path: 'frameA', component: ChildFrameAComponent },
    { path: 'frameB', component: ChildFrameBComponent },
    { path: 'frameC', component: ChildFrameCComponent },
    { path: '', component: MainComponent },

];


@NgModule({
    declarations: [
        AppComponent,
        ChildFrameAComponent,
        ChildFrameBComponent,
        ChildFrameCComponent,
        MainComponent,
        ChatClientComponent,
        ServbotComponent,
        VMCBotComponent,
        TaskTitlePipe,
        TaskSubTitlePipe,
        VmcTaskComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        ClarityModule,
        ClrFormsNextModule,
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
