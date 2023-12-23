import {UserRepository} from "../repository/UserRepository";

export class SignUpUseCase {
    constructor(
        private userRepository: UserRepository
    ) {
    }

    async execute(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput> {
        return await this.userRepository.saveUser(signUpDtoInput)
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
