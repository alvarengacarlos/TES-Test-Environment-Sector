import {DeployModelRepository} from "../repository/DeployModelRepository";
import {CodeType} from "../util/CodeType";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {
    TwoTiersApplicationDoesNotHaveFrontendException
} from "../exception/TwoTiersApplicationDoesNotHaveFrontendException";
import {DeployModelType} from "../util/DeployModelType";

export class UploadFrontendSourceCodeUseCase {
    constructor(
        private readonly deployModelRepository: DeployModelRepository
    ) {
    }

    async execute(uploadFrontendSourceCodeDtoInput: UploadFrontendSourceCodeDtoInput): Promise<UploadFrontendSourceCodeDtoOutput> {
        const deployModel = await this.deployModelRepository.findDeployModelById({
            deployModelId: uploadFrontendSourceCodeDtoInput.deployModelId
        })

        if (!deployModel) {
            throw new DeployModelDoesNotExistException()
        }

        if (
            deployModel.deployModelType == DeployModelType.TWO_TIERS
        ) {
            throw new TwoTiersApplicationDoesNotHaveFrontendException()
        }


        const result = await this.deployModelRepository.saveFrontendSourceCode({
            ownerEmail: deployModel.ownerEmail,
            deployModelId: deployModel.id,
            codeType: CodeType.FRONTEND,
            bufferedSourceCodeFile: uploadFrontendSourceCodeDtoInput.bufferedSourceCodeFile
        })

        return new UploadFrontendSourceCodeDtoOutput(
            result.id,
            result.frontendSourceCodePath
        )
    }
}

export class UploadFrontendSourceCodeDtoInput {
    constructor(
        public readonly deployModelId: string,
        public readonly bufferedSourceCodeFile: Buffer
    ) {
    }
}

export class UploadFrontendSourceCodeDtoOutput {
    constructor(
        public readonly id: string,
        public readonly sourceCodePath: string
    ) {
    }
}
