import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {AwsCredentialsConfigurationMissingException} from "../exception/AwsCredentialsConfigurationMissingException";
import {InfrastructureAlreadyProvisioned} from "../exception/InfrastructureAlreadyProvisioned";

export class CreateDeployModelInfraUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(createDeployModelInfraDtoInput: CreateDeployModelInfraDtoInput): Promise<CreateDeployModelInfraDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: createDeployModelInfraDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        if (deployModel.cloudFormationStackName != "") {
            throw new InfrastructureAlreadyProvisioned()
        }

        if (deployModel.awsCredentialsPath == "") {
            throw new AwsCredentialsConfigurationMissingException()
        }

        await this.deployModelRepository.createDeployModelInfra({
            deployModelId: createDeployModelInfraDtoInput.deployModelId,
            awsCredentialsPath: deployModel.awsCredentialsPath,
            ownerEmail: deployModel.ownerEmail
        })

        return new CreateDeployModelInfraDtoOutput(createDeployModelInfraDtoInput.deployModelId)
    }
}

export class CreateDeployModelInfraDtoInput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}

export class CreateDeployModelInfraDtoOutput {
    constructor(
        public readonly deployModelId: string
    ) {
    }
}