import {SourceCodeRepository} from "../repository/SourceCodeRepository";
import {AwsCredentialsService} from "./AwsCredentialsService";
import {AwsCredentialsEntity} from "../entity/AwsCredentialsEntity";
import {SourceCodeEntity} from "../entity/SourceCodeEntity";

export class SourceCodeService {
    constructor(
        private readonly sourceCodeRepository: SourceCodeRepository,
        private readonly awsCredentialsService: AwsCredentialsService
    ) {
    }

    async uploadSourceCode(uploadSourceCodeDtoInput: UploadSourceCodeDtoInput): Promise<UploadSourceCodeDtoOutput> {
        const findAwsCredentialsDtoOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: uploadSourceCodeDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsDtoOutput.accessKeyId, findAwsCredentialsDtoOutput.secretAccessKey)

        await this.sourceCodeRepository.uploadSourceCode({
            appName: uploadSourceCodeDtoInput.appName,
            ownerEmail: uploadSourceCodeDtoInput.ownerEmail,
            bufferedSourceCode: uploadSourceCodeDtoInput.bufferedSourceCode,
            awsCredentials: awsCredentials
        })

        return new UploadSourceCodeDtoOutput()
    }

    async findSourceCodes(findSourceCodesDtoInput: FindSourceCodesDtoInput): Promise<FindSourceCodesDtoOutput> {
        const findAwsCredentialsDtoOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: findSourceCodesDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsDtoOutput.accessKeyId, findAwsCredentialsDtoOutput.secretAccessKey)

        const sourceCodeEntities = await this.sourceCodeRepository.findSourceCodes({
            awsCredentials: awsCredentials
        })

        return new FindSourceCodesDtoOutput(sourceCodeEntities)
    }

    async deleteSourceCode(deleteSourceCodeDtoInput: DeleteSourceCodeDtoInput): Promise<DeleteSourceCodeDtoOutput> {
        const findAwsCredentialsDtoOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: deleteSourceCodeDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsDtoOutput.accessKeyId, findAwsCredentialsDtoOutput.secretAccessKey)

        await this.sourceCodeRepository.deleteSourceCode({
            awsCredentials: awsCredentials,
            sourceCodePath: deleteSourceCodeDtoInput.sourceCodePath
        })

        return new DeleteSourceCodeDtoOutput()
    }
}

export class UploadSourceCodeDtoInput {
    constructor(
        public readonly appName: string,
        public readonly ownerEmail: string,
        public readonly bufferedSourceCode: Buffer
    ) {
    }
}

export class UploadSourceCodeDtoOutput {
    constructor(
    ) {
    }
}

export class FindSourceCodesDtoInput {
    constructor(
        public readonly ownerEmail: string
    ) {
    }
}

export class FindSourceCodesDtoOutput {
    constructor(
        public readonly sourceCodeEntities: Array<SourceCodeEntity | null>
    ) {
    }
}

export class DeleteSourceCodeDtoInput {
    constructor(
        public readonly ownerEmail: string,
        public readonly sourceCodePath: string
    ) {
    }
}

export class DeleteSourceCodeDtoOutput {
    constructor() {
    }
}