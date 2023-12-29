import {DeployModelRepository} from "../repository/DeployModelRepository";
import {CodeType} from "../util/CodeType";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";

export class UploadBackendSourceCodeUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(uploadBackendSourceCodeDtoInput: UploadBackendSourceCodeDtoInput): Promise<UploadBackendSourceCodeDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: uploadBackendSourceCodeDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        const result = await this.deployModelRepository.saveBackendSourceCode({
            ownerEmail: deployModel.ownerEmail,
            deployModelId: deployModel.id,
            codeType: CodeType.BACKEND,
            bufferedSourceCodeFile: uploadBackendSourceCodeDtoInput.bufferedSourceCodeFile
        })

        return new UploadBackendSourceCodeDtoOutput(
            result.id,
            result.backendSourceCodePath
        )
    }
}

export class UploadBackendSourceCodeDtoInput {
    constructor(
        public readonly deployModelId: string,
        public readonly bufferedSourceCodeFile: Buffer
    ) {
    }
}

export class UploadBackendSourceCodeDtoOutput {
    constructor(
        public readonly id: string,
        public readonly sourceCodePath: string
    ) {
    }
}





