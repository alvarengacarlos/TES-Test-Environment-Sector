import {DeployModelRepository} from "../repository/DeployModelRepository";

export class CreateDeployModelUseCase {
    constructor(
        private deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(createDeployModelDtoInput: CreateDeployModelDtoInput): Promise<CreateDeployModelDtoOutput> {
        return await this.deployModelRepository.saveDeployModel(createDeployModelDtoInput)
    }
}

export class CreateDeployModelDtoInput {
    constructor(
        public readonly deployModelName: string,
        public readonly deployModelType: DeployModelType,
        public readonly databaseType: DatabaseType,
        public readonly executionEnvironment: ExecutionEnvironment,
        public readonly ownerEmail: string
    ) {
    }
}

export enum DeployModelType {
    TWO_TIERS = "TWO_TIERS",
    THREE_TIERS = "THREE_TIERS",
}

export enum DatabaseType {
    POSTGRES_SQL= "POSTGRES_SQL"
}

export enum ExecutionEnvironment {
    NODE_JS = "NODE_JS"
}

export class CreateDeployModelDtoOutput {
    constructor(
        public readonly id: string,
        public readonly deployModelName: string,
        public readonly deployModelType: string,
        public readonly databaseType: string,
        public readonly executionEnvironment: string,
        public readonly ownerEmail: string
    ) {
    }
}
