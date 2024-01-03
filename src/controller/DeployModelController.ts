import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase
} from "../use-case/CreateDeployModelUseCase";
import {HttpRequest} from "../util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {DeployModelDoesNotExistException} from "../exception/DeployModelDoesNotExistException";
import {
    UploadSourceCodeDtoInput, UploadSourceCodeDtoOutput,
    UploadSourceCodeUseCase
} from "../use-case/UploadSourceCodeUseCase";
import {
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    SaveAwsCredentialsUseCase
} from "../use-case/SaveAwsCredentialsUseCase";
import {
    CreateDeployModelInfraDtoInput,
    CreateDeployModelInfraDtoOutput,
    CreateDeployModelInfraUseCase
} from "../use-case/CreateDeployModelInfraUseCase";
import {AwsCredentialsConfigurationMissingException} from "../exception/AwsCredentialsConfigurationMissingException";
import {InfrastructureProvisionedException} from "../exception/InfrastructureProvisionedException";
import {
    CheckDeployModelInfraStatusDtoInput,
    CheckDeployModelInfraStatusDtoOutput, CheckDeployModelInfraStatusUseCase
} from "../use-case/CheckDeployModelInfraStatusUseCase";
import {InfrastructureNotProvisionedException} from "../exception/InfrastructureNotProvisionedException";
import {
    DeleteDeployModelInfraDtoInput,
    DeleteDeployModelInfraDtoOutput, DeleteDeployModelInfraUseCase
} from "../use-case/DeleteDeployModelInfraUseCase";
import {DeleteDeployModelDtoInput, DeleteDeployModelUseCase} from "../use-case/DeleteDeployModelUseCase";

export class DeployModelController {
    constructor(
        private readonly createDeployModelUseCase: CreateDeployModelUseCase,
        private readonly deleteDeployModelUseCase: DeleteDeployModelUseCase,
        private readonly uploadSourceCodeUseCase: UploadSourceCodeUseCase,
        private readonly saveAwsCredentialsUseCase: SaveAwsCredentialsUseCase,
        private readonly createDeployModelInfraUseCase: CreateDeployModelInfraUseCase,
        private readonly checkDeployModelInfraUseCase: CheckDeployModelInfraStatusUseCase,
        private readonly deleteDeployModelInfraUseCase: DeleteDeployModelInfraUseCase
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

    async deleteDeployModel(httpRequest: HttpRequest<DeleteDeployModelDtoInput>): Promise<HttpResponse<DeleteDeployModelInfraDtoOutput | null>> {
        try {
            const deleteDeployModelDtoOutput = await this.deleteDeployModelUseCase.execute(httpRequest.data)
            return HttpResponse.ok("Deploy model deleted with success", deleteDeployModelDtoOutput)
        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof InfrastructureProvisionedException) {
                return HttpResponse.badRequest(ApiStatusCode.INFRASTRUCTURE_PROVISIONED, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async uploadSourceCode(httpRequest: HttpRequest<UploadSourceCodeDtoInput>): Promise<HttpResponse<UploadSourceCodeDtoOutput | null>> {
        try {
            const uploadSourceCodeDtoOutput = await this.uploadSourceCodeUseCase.execute(httpRequest.data)
            return HttpResponse.ok("upload executed with success", uploadSourceCodeDtoOutput)
        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof AwsCredentialsConfigurationMissingException) {
                return HttpResponse.badRequest(ApiStatusCode.AWS_CREDENTIALS_CONFIGURATION_MISSING, error.message, null)
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

    async createDeployModelInfra(httpRequest: HttpRequest<CreateDeployModelInfraDtoInput>): Promise<HttpResponse<CreateDeployModelInfraDtoOutput | null>> {
        try {
            const createDeployModelInfraDtoOutput = await this.createDeployModelInfraUseCase.execute(httpRequest.data)
            return HttpResponse.ok("deploy model infra created with success", createDeployModelInfraDtoOutput)

        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof InfrastructureProvisionedException) {
                return HttpResponse.badRequest(ApiStatusCode.INFRASTRUCTURE_PROVISIONED, error.message, null)
            }

            if (error instanceof AwsCredentialsConfigurationMissingException) {
                return HttpResponse.badRequest(ApiStatusCode.AWS_CREDENTIALS_CONFIGURATION_MISSING, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async checkDeployModelInfraStatus(httpRequest: HttpRequest<CheckDeployModelInfraStatusDtoInput>): Promise<HttpResponse<CheckDeployModelInfraStatusDtoOutput | null>> {
        try {
            const checkDeployModelInfraStatus = await this.checkDeployModelInfraUseCase.execute(httpRequest.data)
            return HttpResponse.ok("deploy model infra status got with success", checkDeployModelInfraStatus)
        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof InfrastructureNotProvisionedException) {
                return HttpResponse.badRequest(ApiStatusCode.INFRASTRUCTURE_NOT_PROVISIONED, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async deleteDeployModelInfra(httpRequest: HttpRequest<DeleteDeployModelInfraDtoInput>): Promise<HttpResponse<DeleteDeployModelInfraDtoOutput | null>> {
        try {
            const deleteDeployModelInfraDtoOutput = await this.deleteDeployModelInfraUseCase.execute(httpRequest.data)
            return HttpResponse.ok("deploy model infra deleted with success", deleteDeployModelInfraDtoOutput)

        } catch (error: any) {
            if (error instanceof DeployModelDoesNotExistException) {
                return HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, error.message, null)
            }

            if (error instanceof InfrastructureNotProvisionedException) {
                return HttpResponse.badRequest(ApiStatusCode.INFRASTRUCTURE_NOT_PROVISIONED, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }
}