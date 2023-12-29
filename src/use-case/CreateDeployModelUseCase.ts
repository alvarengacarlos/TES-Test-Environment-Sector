import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelType} from "../util/DeployModelType";
import {DatabaseType} from "../util/DatabaseType";
import {ExecutionEnvironment} from "../util/ExecutionEnvironment";

export class CreateDeployModelUseCase {
    constructor(
        private deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(createDeployModelDtoInput: CreateDeployModelDtoInput): Promise<CreateDeployModelDtoOutput> {
        const deployModel = await this.deployModelRepository.saveDeployModel(createDeployModelDtoInput)

        return new CreateDeployModelDtoOutput(
            deployModel.id,
            deployModel.deployModelName,
            deployModel.deployModelType,
            deployModel.databaseType,
            deployModel.executionEnvironment,
            deployModel.ownerEmail
        )
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
