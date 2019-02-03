export class ServiceLoader {

    private static serviceCollection: Set<any> = new Set();

    public static addService(service: any, ...args: any[]): any {
        let foundService = null;
        for (let serviceInstance of ServiceLoader.serviceCollection) {
            if (serviceInstance instanceof service) {
                foundService = serviceInstance;
            }
        }
        if (!foundService) {
            const instance: any = new service(...args);
            ServiceLoader.serviceCollection.add(instance);
            return instance;
        } else {
            return foundService;
        }
    }

    public static getLoadedServices(): Set<any> {
        return new Set(ServiceLoader.serviceCollection.values());
    }

    public static destroyAllServices(): void {
        ServiceLoader.serviceCollection.forEach(
            (service: any) => {
                ServiceLoader.serviceCollection.delete(service);
            }
        );
        ServiceLoader.serviceCollection = new Set(); //  bye!
    }

    public static destroyService(service: any) {
        ServiceLoader.serviceCollection.forEach(
            (currentService: any) => {
                if (currentService.constructor.name === service.constructor.name) {
                    ServiceLoader.serviceCollection.delete(service);
                }
            }
        );
    }

    public static getService<T>(service: T): T {
        let locatedService: T = null;
        ServiceLoader.serviceCollection.forEach(
            (currentService: any) => {
                if (currentService.constructor.name === service.constructor.name) {
                  locatedService = currentService;
                }
            }
        );
        return locatedService;
    }
}
