import { AbstractBase } from '@vmw/bifrost/core/abstractions/abstract.base';

export class ServbotService extends AbstractBase{

    private static _instance: ServbotService;

    /**
     * Destroy the manager completely.
     */
    public static destroy(): void {
        this._instance = null;
    }

    /**
     * Get reference to singleton ApiOperations instance.
     * @returns {ApiOperations}
     */
    public static getInstance(): ServbotService {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        super('servbot');
    }

}