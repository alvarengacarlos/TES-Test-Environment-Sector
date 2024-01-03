import {AwsCredentialsEntity} from "../entity/AwsCredentialsEntity";
import {SourceCodeEntity} from "../entity/SourceCodeEntity";

export interface SourceCodeRepository {
    uploadSourceCode(uploadSourceCodeInput: UploadSourceCodeInput): Promise<void>
    findSourceCodes(findSourceCodesInput: FindSourceCodesInput): Promise<Array<SourceCodeEntity | null>>
    deleteSourceCode(deleteSourceCodeInput: DeleteSourceCodeInput): Promise<void>
}

export type UploadSourceCodeInput = {
    appName: string,
    awsCredentials: AwsCredentialsEntity,
    ownerEmail: string,
    bufferedSourceCode: Buffer
}

export type FindSourceCodesInput = {
    awsCredentials: AwsCredentialsEntity,
}

export type DeleteSourceCodeInput = {
    awsCredentials: AwsCredentialsEntity,
    sourceCodePath: string
}