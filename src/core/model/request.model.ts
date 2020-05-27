/*
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { AbstractFrame } from '../../bus/model/abstractframe.model';
import { UUID } from '../../bus/store/store.model';

export class APIRequest<PayloadT> extends AbstractFrame {

    public headers: {[key: string]: any};
    public payload: PayloadT;
    public request: string;

    constructor(request: string, payload: PayloadT, id: UUID, version: number, headers?: {[key: string]: any}) {
        super(id, version);
        this.request = request;
        this.payload = payload;
        this.headers = headers;
    }
}
