import { Component, OnInit } from '@angular/core';
import { EventBus } from '@vmw/bifrost';

@Component({
    selector: 'app-child-frame-c',
    templateUrl: './child-frame-c.component.html',
    styleUrls: ['./child-frame-c.component.css']
})
export class ChildFrameCComponent implements OnInit {

    public id = EventBus.id;

    constructor() {
    }

    ngOnInit() {
    }

}
