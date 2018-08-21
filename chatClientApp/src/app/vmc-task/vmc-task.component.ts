import { Component, Input, OnInit } from '@angular/core';
import { BaseTask } from '../../vmc-models/api/vmc-api';

@Component({
    selector: 'vmc-task',
    templateUrl: './vmc-task.component.html',
    styleUrls: ['./vmc-task.component.css']
})
export class VmcTaskComponent implements OnInit {

    @Input() task: BaseTask;

    ngOnInit(): void {
    }

}
