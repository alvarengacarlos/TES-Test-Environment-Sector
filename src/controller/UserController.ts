import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {HttpRequest} from "../util/HttpRequest";
import {EmailExistsException} from "../exception/EmailExistsException";
import {ExpiredConfirmationCodeException} from "../exception/ExpiredConfirmationCodeException";
import {InvalidConfirmationCodeException} from "../exception/InvalidConfirmationCodeException";
import {IncorrectEmailOrPasswordException} from "../exception/IncorrectEmailOrPasswordException";
import {EmailNotConfirmedException} from "../exception/EmailNotConfirmedException";
import {
    ConfirmSignUpDtoInput,
    ConfirmSignUpDtoOutput,
    SignInDtoInput,
    SignInDtoOutput,
    SignUpDtoInput,
    SignUpDtoOutput,
    UserService
} from "../service/UserService";

export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    async signUp(httpRequest: HttpRequest<SignUpDtoInput>): Promise<HttpResponse<SignUpDtoOutput | null>> {
        try {
            const signUpDtoOutput = await this.userService.signUp(httpRequest.data)
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
            const confirmSignUpDtoOutput = await this.userService.confirmSignUp(httpRequest.data)
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

    async signIn(httpRequest: HttpRequest<SignInDtoInput>): Promise<HttpResponse<SignInDtoOutput | null>> {
        try {
            const signInDtoOutput = await this.userService.signIn(httpRequest.data)
            return HttpResponse.ok("Sign in executed with success", signInDtoOutput)

        } catch (error: any) {
            if (error instanceof IncorrectEmailOrPasswordException) {
                return HttpResponse.badRequest(ApiStatusCode.INCORRECT_EMAIL_OR_PASSWORD, "Incorrect email or password", null)
            }

            if (error instanceof EmailNotConfirmedException) {
                return HttpResponse.badRequest(ApiStatusCode.EMAIL_NOT_CONFIRMED, "Email not confirmed", null)
            }

            return HttpResponse.internalServerError()
        }
    }
}