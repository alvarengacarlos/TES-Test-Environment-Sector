import {SignUpDtoInput, SignUpDtoOutput, SignUpUseCase} from "../use-case/SignUpUseCase";
import {
    EmailExistsException,
    ExpiredConfirmationCodeException,
    InvalidConfirmationCodeException
} from "../repository/UserRepositoryImpl";
import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {HttpRequest} from "../util/HttpRequest";
import {ConfirmSignUpDtoInput, ConfirmSignUpDtoOutput, ConfirmSignUpUseCase} from "../use-case/ConfirmSignUpUseCase";

export class UserController {
    constructor(
        private signUpUseCase: SignUpUseCase,
        private confirmSignUpUseCase: ConfirmSignUpUseCase
    ) {
    }

    async signUp(httpRequest: HttpRequest<SignUpDtoInput>): Promise<HttpResponse<SignUpDtoOutput | null>> {
        try {
            const signUpDtoOutput = await this.signUpUseCase.execute(httpRequest.data)
            return HttpResponse.created("Sign up executed with success", signUpDtoOutput)

        } catch (error: any) {
            if (error instanceof EmailExistsException) {
                return HttpResponse.conflict(ApiStatusCode.EMAIL_EXISTS, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }

    async confirmSignUp(httpRequest: HttpRequest<ConfirmSignUpDtoInput>): Promise<HttpResponse<ConfirmSignUpDtoOutput | null>> {
        try {
            const confirmSignUpDtoOutput = await this.confirmSignUpUseCase.execute(httpRequest.data)
            return HttpResponse.ok("Confirm sign up executed with success", confirmSignUpDtoOutput)

        } catch (error: any) {
            if (error instanceof ExpiredConfirmationCodeException) {
                return HttpResponse.badRequest(ApiStatusCode.EXPIRED_CONFIRMATION_CODE, error.message, null)
            }

            if (error instanceof InvalidConfirmationCodeException) {
                return HttpResponse.badRequest(ApiStatusCode.INVALID_CONFIRMATION_CODE, error.message, null)
            }

            return HttpResponse.internalServerError()
        }
    }
}