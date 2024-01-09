export class InfraStackEntity {
    constructor(
        public readonly stackId: string,
        public readonly stackName: string,
        public readonly stackStatus: string,
    ) {}
}
