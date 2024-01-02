import {DeployModelEntity} from "../entity/DeployModelEntity";

export interface DeployModelRepository {
    saveDeployModel(saveDeployModelInput: SaveDeployModelInput): Promise<DeployModelEntity>
    findDeployModelById(findDeployModelByIdInput: FindDeployModelByIdInput): Promise<DeployModelEntity | null>
    saveSourceCode(saveSourceCodeInput: SaveSourceCodeInput): Promise<DeployModelEntity>
    saveAwsCredentials(saveAwsCredentialsInput: SaveAwsCredentialsInput): Promise<DeployModelEntity>
    createDeployModelInfra(createDeployModelInfraInput: CreateDeployModelInfraInput): Promise<void>
}

export type SaveDeployModelInput = {
    deployModelName: string,
    ownerEmail: string
}

export type FindDeployModelByIdInput = {
    deployModelId: string
}

export type SaveSourceCodeInput = {
    ownerEmail: string,
    deployModelId: string,
    bufferedSourceCodeFile: Buffer,
    awsCredentialsPath: string
}

export type SaveAwsCredentialsInput = {
    ownerEmail: string,
    deployModelId: string,
    accessKeyId: string,
    secretAccessKey: string
}

export type CreateDeployModelInfraInput = {
    deployModelId: string,
    awsCredentialsPath: string,
    ownerEmail: string,
}
