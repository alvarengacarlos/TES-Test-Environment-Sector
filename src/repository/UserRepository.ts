import {SignUpDtoInput, SignUpDtoOutput} from "../use-case/SignUpUseCase";
import {ConfirmSignUpDtoInput, ConfirmSignUpDtoOutput} from "../use-case/ConfirmSignUpUseCase";

export interface UserRepository {
    saveUser(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput>
    updateUserEmailToVerified(confirmSignUpDtoInput: ConfirmSignUpDtoInput): Promise<ConfirmSignUpDtoOutput>
}