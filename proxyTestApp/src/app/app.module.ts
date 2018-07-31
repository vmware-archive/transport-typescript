import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ChildFrameAComponent } from './child-frame-a/child-frame-a.component';
import { ChildFrameBComponent } from './child-frame-b/child-frame-b.component';
import { ChildFrameCComponent } from './child-frame-c/child-frame-c.component';

const appRoutes: Routes = [
    { path: 'frameA', component: ChildFrameAComponent },
    { path: 'frameB', component: ChildFrameBComponent },
    { path: 'frameC', component: ChildFrameCComponent },

];


@NgModule({
    declarations: [
        AppComponent,
        ChildFrameAComponent,
        ChildFrameBComponent,
        ChildFrameCComponent
    ],
    imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
