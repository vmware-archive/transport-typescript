
export class ServiceLoader {

    private static serviceCollection: Set<any> = new Set();

    public static addService(service: any) {
        ServiceLoader.serviceCollection.add(new service());
    }

}