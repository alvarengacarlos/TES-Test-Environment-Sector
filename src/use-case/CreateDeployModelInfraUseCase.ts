import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {AwsCredentialsConfigurationMissingException} from "../exception/AwsCredentialsConfigurationMissingException";

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

        if (deployModel.awsCredentialsPath == "") {
            throw new AwsCredentialsConfigurationMissingException()
        }

        await this.deployModelRepository.createDeployModelInfra({
            deployModelId: createDeployModelInfraDtoInput.deployModelId,
            awsCredentialsPath: deployModel.awsCredentialsPath
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