export class ServiceLoader {

    private static serviceCollection: Set<any> = new Set();

    public static addService(service: any, ...args: any[]) {

        let found;
        for (let serviceInstance of ServiceLoader.serviceCollection) {
            if (serviceInstance instanceof service) {
                found = true;
            }
        }
        if (!found) {
            ServiceLoader.serviceCollection.add(new service(...args));
        }
    }

    public static getLoadedServices(): Set<any>  {
        return new Set(ServiceLoader.serviceCollection.values());
    }

    public static destroyAllServices(): void {
        ServiceLoader.serviceCollection.forEach(
            (service: any) => {
                ServiceLoader.serviceCollection.delete(service);
            }
        )
        ServiceLoader.serviceCollection = new Set(); //  bye!
    }
}