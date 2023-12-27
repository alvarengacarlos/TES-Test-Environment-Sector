import {SignUpDtoInput, SignUpDtoOutput, SignUpUseCase} from "../use-case/SignUpUseCase";
import {EmailExistsException} from "../repository/UserRepositoryImpl";
import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {HttpRequest} from "../util/HttpRequest";

export class UserController {
    constructor(
        private signUpUseCase: SignUpUseCase
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
}