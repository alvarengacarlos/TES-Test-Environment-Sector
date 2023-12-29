import {UserRepository} from "../repository/UserRepository";

export class SignUpUseCase {
    constructor(
        private userRepository: UserRepository
    ) {
    }

    async execute(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput> {
        const user = await this.userRepository.saveUser({
            email: signUpDtoInput.email,
            password: signUpDtoInput.password
        })

        return new SignUpDtoOutput(user.email)
    }
}

export class SignUpDtoInput {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {
    }
}

export class SignUpDtoOutput {
    constructor(
        public readonly email: string,
    ) {
    }
}
