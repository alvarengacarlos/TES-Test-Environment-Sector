export class DeployModelEntity {
    constructor(
        public readonly id: string,
        public readonly deployModelName: string,
        public readonly deployModelType: string,
        public readonly databaseType: string,
        public readonly executionEnvironment: string,
        public readonly ownerEmail: string,
        public readonly frontendSourceCodePath: string,
        public readonly backendSourceCodePath: string,
        public readonly accessKeyIdPath: string,
        public readonly secretAccessKeyPath: string
    ) {
    }
}
