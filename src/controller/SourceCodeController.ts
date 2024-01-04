import {
    DeleteSourceCodeDtoInput, DeleteSourceCodeDtoOutput,
    FindSourceCodesDtoInput, FindSourceCodesDtoOutput,
    SourceCodeService,
    UploadSourceCodeDtoInput,
    UploadSourceCodeDtoOutput
} from "../service/SourceCodeService";
import {HttpRequest} from "../util/HttpRequest";
import {HttpResponse} from "../util/HttpResponse";

export class SourceCodeController {
    constructor(
        private readonly sourceCodeService: SourceCodeService
    ) {
    }

    async uploadSourceCode(httpRequest: HttpRequest<UploadSourceCodeDtoInput>): Promise<HttpResponse<UploadSourceCodeDtoOutput | null>> {
        try {
            const uploadSourceCodeDtoOutput = await this.sourceCodeService.uploadSourceCode(httpRequest.data)
            return HttpResponse.ok("Source code upload with success", uploadSourceCodeDtoOutput)

        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async findSourceCodes(httpRequest: HttpRequest<FindSourceCodesDtoInput>): Promise<HttpResponse<FindSourceCodesDtoOutput | null>> {
        try {
            const findSourceCodesDtoOutput = await this.sourceCodeService.findSourceCodes(httpRequest.data)
            return HttpResponse.ok("Source codes got with success", findSourceCodesDtoOutput)

        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async deleteSourceCode(httpRequest: HttpRequest<DeleteSourceCodeDtoInput>): Promise<HttpResponse<DeleteSourceCodeDtoOutput | null>> {
        try {
            const deleteSourceCodeDtoOutput = await this.sourceCodeService.deleteSourceCode(httpRequest.data)
            return HttpResponse.ok("Source code deleted with success", deleteSourceCodeDtoOutput)

        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }
}