/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'taskType'})
export class TaskTitlePipe implements PipeTransform {
    transform(title: string): string {
       return title.replace(new RegExp('[-_]', 'g'), ' ');
    }
}

@Pipe({name: 'subTaskType'})
export class TaskSubTitlePipe implements PipeTransform {
    transform(title: string): string {
        return title.replace(new RegExp('_', 'g'), ' ');
    }
}
