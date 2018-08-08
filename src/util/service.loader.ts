
export class ServiceLoader {

    private static serviceCollection: Set<any> = new Set();

    public static addService(service: any, ...args: any[]) {
        ServiceLoader.serviceCollection.add(new service(args[0])); // hard wire for now.
    }

}