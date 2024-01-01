import {DeployModelRepository} from "../repository/DeployModelRepository";

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
            deployModel.ownerEmail
        )
    }
}

export class CreateDeployModelDtoInput {
    constructor(
        public readonly deployModelName: string,
        public readonly ownerEmail: string
    ) {
    }
}


export class CreateDeployModelDtoOutput {
    constructor(
        public readonly id: string,
        public readonly deployModelName: string,
        public readonly ownerEmail: string
    ) {
    }
}
