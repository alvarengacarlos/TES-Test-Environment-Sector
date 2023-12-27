import {UserRepository} from "../repository/UserRepository";

export class SignInUseCase {
    constructor(
        private userRepository: UserRepository
    ) {
    }

    async execute(signInDtoInput: SignInDtoInput): Promise<SignInDtoOutput> {
        return await this.userRepository.authenticateUser(signInDtoInput)
    }
}

export class SignInDtoInput {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {
    }
}

export class SignInDtoOutput {
    constructor(
        public readonly identityToken: string,
        public readonly identityTokenType: string,
        public readonly refreshToken: string,
    ) {
    }
}
