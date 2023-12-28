import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase
} from "../use-case/CreateDeployModelUseCase";
import {HttpRequest} from "../util/HttpRequest";
import {HttpResponse} from "../util/HttpResponse";

export class DeployModelController {
    constructor(
        private createDeployModelUseCase: CreateDeployModelUseCase
    ) {
    }

    async createDeployModel(httpRequest: HttpRequest<CreateDeployModelDtoInput>): Promise<HttpResponse<CreateDeployModelDtoOutput | null>> {
        try {
            const createDeployModelDtoOutput = await this.createDeployModelUseCase.execute(httpRequest.data)
            return HttpResponse.created("Deploy model created with success", createDeployModelDtoOutput)
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }
}