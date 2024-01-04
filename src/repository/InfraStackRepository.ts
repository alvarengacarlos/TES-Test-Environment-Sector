import {AwsCredentialsEntity} from "../entity/AwsCredentialsEntity";
import {InfraStackEntity} from "../entity/InfraStackEntity";

export interface InfraStackRepository {
    createInfraStack(createInfraStackInput: CreateInfraStackInput): Promise<void>
    findInfraStacks(findInfraStacksInput: FindInfraStacksInput): Promise<Array<InfraStackEntity | null>>
    deleteInfraStack(deleteInfraStackInput: DeleteInfraStackInput): Promise<void>
}

export type CreateInfraStackInput = {
    appName: string,
    awsCredentials: AwsCredentialsEntity,
    templateBody: string,
    sourceCodePath: string
}

export type FindInfraStacksInput = {
    awsCredentials: AwsCredentialsEntity,
}

export type DeleteInfraStackInput = {
    awsCredentials: AwsCredentialsEntity,
    stackName: string
}