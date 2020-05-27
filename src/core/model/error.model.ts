/*
 * Copyright 2018 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export class GeneralError {
    public errorObject: any;
    public errorCode: any;

    constructor(public message: string, public status?: any) {

    }
}
