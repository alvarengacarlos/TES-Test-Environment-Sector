import {DeployModelEntity} from "../entity/DeployModelEntity";

export interface DeployModelRepository {
    saveDeployModel(saveDeployModelInput: SaveDeployModelInput): Promise<DeployModelEntity>
    findDeployModelById(findDeployModelByIdInput: FindDeployModelByIdInput): Promise<DeployModelEntity | null>
    saveFrontendSourceCode(saveFrontendSourceCodeInput: SaveFrontendSourceCodeInput): Promise<DeployModelEntity>
    saveBackendSourceCode(saveBackendSourceCodeInput: SaveBackendSourceCodeInput): Promise<DeployModelEntity>
}

export type SaveDeployModelInput = {
    deployModelName: string,
    deployModelType: string,
    databaseType: string,
    executionEnvironment: string,
    ownerEmail: string
}

export type FindDeployModelByIdInput = {
    deployModelId: string
}

export type SaveFrontendSourceCodeInput = {
    ownerEmail: string,
    deployModelId: string,
    codeType: string
    bufferedSourceCodeFile: Buffer
}

export type SaveBackendSourceCodeInput = {
    ownerEmail: string,
    deployModelId: string,
    codeType: string
    bufferedSourceCodeFile: Buffer
}
