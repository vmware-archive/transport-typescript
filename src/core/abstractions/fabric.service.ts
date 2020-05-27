/*
 * Copyright 2019 VMware, Inc.
 * SPDX-License-Identifier: BSD-2-Clause
 */

export interface FabricService {
    online(): void;
    offline(): void;
}
