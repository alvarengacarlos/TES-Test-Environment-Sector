import {
    CreateInfraStackDtoInput,
    CreateInfraStackDtoOutput,
    DeleteInfraStackDtoInput,
    DeleteInfraStackDtoOutput,
    FindInfraStacksDtoInput,
    FindInfraStacksDtoOutput,
    InfraStackService,
} from "../service/InfraStackService"
import { HttpRequest } from "../util/HttpRequest"
import { HttpResponse } from "../util/HttpResponse"

export class InfraStackController {
    constructor(private readonly infraStackService: InfraStackService) {}

    async createInfraStack(
        httpRequest: HttpRequest<CreateInfraStackDtoInput>,
    ): Promise<HttpResponse<CreateInfraStackDtoOutput | null>> {
        try {
            const createInfraStackDtoOutput =
                await this.infraStackService.createInfraStack(httpRequest.data)
            return HttpResponse.created(
                "Infra stack created with success",
                createInfraStackDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async findInfraStacks(
        httpRequest: HttpRequest<FindInfraStacksDtoInput>,
    ): Promise<HttpResponse<FindInfraStacksDtoOutput | null>> {
        try {
            const findInfraStacksDtoOutput =
                await this.infraStackService.findInfraStacks(httpRequest.data)
            return HttpResponse.ok(
                "Infra stacks got with success",
                findInfraStacksDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async deleteInfraStack(
        httpRequest: HttpRequest<DeleteInfraStackDtoInput>,
    ): Promise<HttpResponse<DeleteInfraStackDtoOutput | null>> {
        try {
            const deleteInfraStackDtoOutput =
                await this.infraStackService.deleteInfraStack(httpRequest.data)
            return HttpResponse.ok(
                "Infra stack deleted with success",
                deleteInfraStackDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }
}
