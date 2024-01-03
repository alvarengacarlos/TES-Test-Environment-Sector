import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {InfrastructureNotProvisionedException} from "../exception/InfrastructureNotProvisionedException";

export class DeleteDeployModelInfraUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(deleteDeployModelInfraDtoInput: DeleteDeployModelInfraDtoInput): Promise<DeleteDeployModelInfraDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: deleteDeployModelInfraDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        if (deployModel.cloudFormationStackName == "") {
            throw new InfrastructureNotProvisionedException()
        }

        await this.deployModelRepository.deleteDeployModelInfra({
            deployModelId: deleteDeployModelInfraDtoInput.deployModelId,
            awsCredentialsPath: deployModel.awsCredentialsPath
        })

        return new DeleteDeployModelInfraDtoOutput(deployModel.id)
    }
}

export class DeleteDeployModelInfraDtoInput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}

export class DeleteDeployModelInfraDtoOutput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}