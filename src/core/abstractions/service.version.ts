// This is the service version object that is returned by all services.
// It is constructed by servgen from a service's request/response

export class ServiceVersion {
    constructor(public readonly name: string, public readonly version: string) {
    }

    public get isValid(): boolean {
        return this.name !== undefined && this.version !== undefined;
    }
}
