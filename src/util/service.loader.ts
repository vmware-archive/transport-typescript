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
            ServiceLoader.serviceCollection.add(new service(args[0])); // hard wire for now.
        }
    }

}