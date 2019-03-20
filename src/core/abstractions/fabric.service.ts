/**
 * Copyright(c) VMware Inc. 2019
 */

export interface FabricService {
    online(): void;
    offline(): void;
}