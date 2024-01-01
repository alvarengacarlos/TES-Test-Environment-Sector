import {DeployModelRepository} from "../repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";

export class UploadSourceCodeUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(uploadSourceCodeDtoInput: UploadSourceCodeDtoInput): Promise<UploadSourceCodeDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: uploadSourceCodeDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        const result = await this.deployModelRepository.saveSourceCode({
            ownerEmail: deployModel.ownerEmail,
            deployModelId: deployModel.id,
            bufferedSourceCodeFile: uploadSourceCodeDtoInput.bufferedSourceCodeFile
        })

        return new UploadSourceCodeDtoOutput(
            result.id,
            result.sourceCodePath
        )
    }
}

export class UploadSourceCodeDtoInput {
    constructor(
        public readonly deployModelId: string,
        public readonly bufferedSourceCodeFile: Buffer
    ) {
    }
}

export class UploadSourceCodeDtoOutput {
    constructor(
        public readonly id: string,
        public readonly sourceCodePath: string
    ) {
    }
}




