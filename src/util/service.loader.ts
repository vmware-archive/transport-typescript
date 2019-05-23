import { RestService } from '../core/services/rest/rest.service';

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
                if (currentService.constructor.name === service.name) {
                    if (currentService.hasOwnProperty('offline')) {
                        currentService.offline();
                    }
                    ServiceLoader.serviceCollection.delete(currentService);
                }
            }
        );
    }

    public static getService(service: any): any {
        let locatedService = null;
        ServiceLoader.serviceCollection.forEach(
            (currentService: any) => {
                if (currentService.constructor.name === service.name) {
                    locatedService = currentService;
                }
            }
        );
        return locatedService;
    }

    /**
     * Get a reference directly to the local RestService
     */
    public static getRestService(): RestService {
        return ServiceLoader.getService(RestService);
    }

    public static offlineLocalRestService(): void {
        ServiceLoader.getRestService().offline();
    }

    public static onlineLocalRestService(): void {
        ServiceLoader.getRestService().online();
    }
}
