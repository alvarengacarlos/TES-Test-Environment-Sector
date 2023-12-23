import {SignUpDtoInput, SignUpDtoOutput} from "../use-case/SignUpUseCase";

export interface UserRepository {
    saveUser(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput>
}