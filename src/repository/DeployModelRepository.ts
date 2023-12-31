import {DeployModelEntity} from "../entity/DeployModelEntity";

export interface DeployModelRepository {
    saveDeployModel(saveDeployModelInput: SaveDeployModelInput): Promise<DeployModelEntity>
    findDeployModelById(findDeployModelByIdInput: FindDeployModelByIdInput): Promise<DeployModelEntity | null>
    saveSourceCode(saveSourceCodeInput: SaveSourceCodeInput): Promise<DeployModelEntity>
    saveAwsCredentials(saveAwsCredentialsInput: SaveAwsCredentialsInput): Promise<DeployModelEntity>
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
    bufferedSourceCodeFile: Buffer
}

export type SaveAwsCredentialsInput = {
    ownerEmail: string,
    deployModelId: string,
    accessKeyId: string,
    secretAccessKey: string
}
