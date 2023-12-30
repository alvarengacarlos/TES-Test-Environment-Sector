import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase
} from "../use-case/CreateDeployModelUseCase";
import {HttpRequest} from "../util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {
    UploadFrontendSourceCodeDtoInput,
    UploadFrontendSourceCodeDtoOutput, UploadFrontendSourceCodeUseCase
} from "../use-case/UploadFrontendSourceCodeUseCase";
import {
    TwoTiersApplicationDoesNotHaveFrontendException
} from "../exception/TwoTiersApplicationDoesNotHaveFrontendException";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {
    UploadBackendSourceCodeDtoInput, UploadBackendSourceCodeDtoOutput,
    UploadBackendSourceCodeUseCase
} from "../use-case/UploadBackendSourceCodeUseCase";
import {
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    SaveAwsCredentialsUseCase
} from "../use-case/SaveAwsCredentialsUseCase";

export class DeployModelController {
    constructor(
        private createDeployModelUseCase: CreateDeployModelUseCase,
        private uploadFrontendSourceCodeUseCase: UploadFrontendSourceCodeUseCase,
        private uploadBackendSourceCodeUseCase: UploadBackendSourceCodeUseCase,
        private saveAwsCredentialsUseCase: SaveAwsCredentialsUseCase
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

    async uploadFrontendSourceCode(httpRequest: HttpRequest<UploadFrontendSourceCodeDtoInput>): Promise<HttpResponse<UploadFrontendSourceCodeDtoOutput | null>> {
        try {
            const uploadFrontendSourceCodeDtoOutput = await this.uploadFrontendSourceCodeUseCase.execute(httpRequest.data)
            return HttpResponse.ok("upload executed with success", uploadFrontendSourceCodeDtoOutput)
        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof TwoTiersApplicationDoesNotHaveFrontendException) {
                return HttpResponse.badRequest(ApiStatusCode.TWO_TIERS_APPLICATION_DOES_NOT_HAVE_FRONTEND, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async uploadBackendSourceCode(httpRequest: HttpRequest<UploadBackendSourceCodeDtoInput>): Promise<HttpResponse<UploadBackendSourceCodeDtoOutput | null>> {
        try {
            const uploadBackendSourceCodeDtoOutput = await this.uploadBackendSourceCodeUseCase.execute(httpRequest.data)
            return HttpResponse.ok("upload executed with success", uploadBackendSourceCodeDtoOutput)
        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async saveAwsCredentials(httpRequest: HttpRequest<SaveAwsCredentialsDtoInput>): Promise<HttpResponse<SaveAwsCredentialsDtoOutput | null>> {
        try {
            const saveAwsCredentialsDtoOutput = await this.saveAwsCredentialsUseCase.execute(httpRequest.data)
            return HttpResponse.ok("aws credentials saved with success", saveAwsCredentialsDtoOutput)

        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }
}