export class DeployModelEntity {
    constructor(
        public readonly id: string,
        public readonly deployModelName: string,
        public readonly ownerEmail: string,
        public readonly sourceCodePath: string,
        public readonly awsCredentialsPath: string,
    ) {
    }
}
