import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {InfrastructureNotProvisionedException} from "../exception/InfrastructureNotProvisionedException";

export class CheckDeployModelInfraStatusUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(checkDeployModelInfraStatusDtoInput: CheckDeployModelInfraStatusDtoInput): Promise<CheckDeployModelInfraStatusDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: checkDeployModelInfraStatusDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        if (deployModel.cloudFormationStackName == "") {
            throw new InfrastructureNotProvisionedException()
        }

        const deployModelInfra = await this.deployModelRepository.findDeployModelInfraStatus({
            cloudFormationStackName: deployModel.cloudFormationStackName,
            awsCredentialsPath: deployModel.awsCredentialsPath
        })

        return new CheckDeployModelInfraStatusDtoOutput(
            deployModelInfra.status
        )
    }
}

export class CheckDeployModelInfraStatusDtoInput {
    constructor(
        public readonly deployModelId: string,
    ) {
    }
}

export class CheckDeployModelInfraStatusDtoOutput {
    constructor(
        public readonly status: string
    ) {
    }
}
