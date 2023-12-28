import {CreateDeployModelDtoInput, CreateDeployModelDtoOutput} from "../use-case/CreateDeployModelUseCase";

export interface DeployModelRepository {
    saveDeployModel(createDeployModelDtoInput: CreateDeployModelDtoInput): Promise<CreateDeployModelDtoOutput>
}