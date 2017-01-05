/**
 * Copyright(c) VMware Inc., 2016
 */


import { Injectable } from '@angular/core';

@Injectable()
export class LogUtil {
    /**
     * Return a pretty printed string from JSON
     *
     * @param obj Object to format
     * @param html flag for if html should be output
     * @returns {string}
     */
    public static pretty (obj: any, html: boolean = false): string {
        let formatted = obj ? JSON.stringify(obj, undefined, 2) : '';

        if (!html) {
            return formatted;
        }

        let regex = new RegExp('(\\")(\\w+)(\\")(:)\\s+', 'gm');
        formatted = formatted.replace(regex, function replacer (match, first, second) {
            return '<span##Space##style="color:black;font-weight:bold">' + second + '</span>:&nbsp;&nbsp;';
        });

        // format for html
        return formatted
            .split('\n')
            .join('<br>')
            .split(' ')
            .join('&nbsp;&nbsp;&nbsp;&nbsp;')
            .split('##Space##')
            .join(' ');
    }
}
