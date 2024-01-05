import { HttpRequest } from "../util/HttpRequest"
import { HttpResponse } from "../util/HttpResponse"
import {
    AwsCredentialsExistsDtoInput,
    AwsCredentialsExistsDtoOutput,
    AwsCredentialsService,
    DeleteAwsCredentialsDtoInput,
    DeleteAwsCredentialsDtoOutput,
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    UpdateAwsCredentialsDtoInput,
    UpdateAwsCredentialsDtoOutput,
} from "../service/AwsCredentialsService"

export class AwsCredentialsController {
    constructor(
        private readonly awsCredentialsService: AwsCredentialsService,
    ) {}

    async saveAwsCredentials(
        httpRequest: HttpRequest<SaveAwsCredentialsDtoInput>,
    ): Promise<HttpResponse<SaveAwsCredentialsDtoOutput | null>> {
        try {
            const saveAwsCredentialsDtoOutput =
                await this.awsCredentialsService.saveAwsCredentials(
                    httpRequest.data,
                )
            return HttpResponse.created(
                "Aws credentials saved with success",
                saveAwsCredentialsDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async awsCredentialsExists(
        httpRequest: HttpRequest<AwsCredentialsExistsDtoInput>,
    ): Promise<HttpResponse<AwsCredentialsExistsDtoOutput | null>> {
        try {
            const awsCredentialsExistsDtoOutput =
                await this.awsCredentialsService.awsCredentialsExists(
                    httpRequest.data,
                )
            return HttpResponse.ok(
                "Aws credentials got with success",
                awsCredentialsExistsDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async updateAwsCredentials(
        httpRequest: HttpRequest<UpdateAwsCredentialsDtoInput>,
    ): Promise<HttpResponse<UpdateAwsCredentialsDtoOutput | null>> {
        try {
            const updateAwsCredentialsDtoOutput =
                await this.awsCredentialsService.updateAwsCredentials(
                    httpRequest.data,
                )
            return HttpResponse.ok(
                "Aws credentials updated with success",
                updateAwsCredentialsDtoOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }

    async deleteAwsCredentials(
        httpRequest: HttpRequest<DeleteAwsCredentialsDtoInput>,
    ): Promise<HttpResponse<DeleteAwsCredentialsDtoOutput | null>> {
        try {
            const deleteAwsCredentialsOutput =
                await this.awsCredentialsService.deleteAwsCredentials(
                    httpRequest.data,
                )
            return HttpResponse.ok(
                "Aws credentials deleted with success",
                deleteAwsCredentialsOutput,
            )
        } catch (error: any) {
            return HttpResponse.internalServerError()
        }
    }
}
