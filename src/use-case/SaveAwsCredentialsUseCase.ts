import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";

export class SaveAwsCredentialsUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(saveAwsCredentialsDtoInput: SaveAwsCredentialsDtoInput): Promise<SaveAwsCredentialsDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: saveAwsCredentialsDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        const result = await this.deployModelRepository.saveAwsCredentials({
            ownerEmail: deployModel.ownerEmail,
            deployModelId: saveAwsCredentialsDtoInput.deployModelId,
            accessKeyId: saveAwsCredentialsDtoInput.accessKeyId,
            secretAccessKey: saveAwsCredentialsDtoInput.secretAccessKey
        })

        return new SaveAwsCredentialsDtoOutput(
            result.id,
            result.awsCredentialsPath
        )
    }
}

export class SaveAwsCredentialsDtoInput {
    constructor(
        public readonly deployModelId: string,
        public readonly accessKeyId: string,
        public readonly secretAccessKey: string
    ) {
    }
}

export class SaveAwsCredentialsDtoOutput {
    constructor(
        public readonly id: string,
        public readonly awsCredentialsPath: string,
    ) {
    }
}