export class DeployModelInfraEntity {
    constructor(
        public readonly id: string,
        public readonly cloudFormationStackName: string,
        public readonly status: string
    ) {
    }
}