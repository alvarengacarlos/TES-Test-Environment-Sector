import {SignUpDtoInput, SignUpDtoOutput} from "../use-case/SignUpUseCase";
import {ConfirmSignUpDtoInput, ConfirmSignUpDtoOutput} from "../use-case/ConfirmSignUpUseCase";
import {SignInDtoInput, SignInDtoOutput} from "../use-case/SignInUseCase";

export interface UserRepository {
    saveUser(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput>
    updateUserEmailToVerified(confirmSignUpDtoInput: ConfirmSignUpDtoInput): Promise<ConfirmSignUpDtoOutput>
    authenticateUser(signInDtoInput: SignInDtoInput): Promise<SignInDtoOutput>
}