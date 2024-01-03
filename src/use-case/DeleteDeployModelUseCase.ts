import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {InfrastructureProvisionedException} from "../exception/InfrastructureProvisionedException";

export class DeleteDeployModelUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(deleteDeployModelDtoInput: DeleteDeployModelDtoInput): Promise<DeleteDeployModelDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: deleteDeployModelDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        if (deployModel.cloudFormationStackName != "") {
            throw new InfrastructureProvisionedException()
        }

        await this.deployModelRepository.deleteDeployModelById({
            deployModelId: deployModel.id,
            awsCredentialsPath: deployModel.awsCredentialsPath,
            sourceCodePath: deployModel.sourceCodePath
        })

        return new DeleteDeployModelDtoOutput(deployModel.id)
    }
}

export class DeleteDeployModelDtoInput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}

export class DeleteDeployModelDtoOutput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}