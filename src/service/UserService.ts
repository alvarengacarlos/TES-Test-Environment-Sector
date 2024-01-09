import { UserRepository } from "../repository/UserRepository"

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async signUp(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput> {
        const user = await this.userRepository.saveUser({
            email: signUpDtoInput.email,
            password: signUpDtoInput.password,
        })

        return new SignUpDtoOutput(user.email)
    }

    async confirmSignUp(
        confirmSignUpDtoInput: ConfirmSignUpDtoInput,
    ): Promise<ConfirmSignUpDtoOutput> {
        const user = await this.userRepository.updateUserEmailToVerified({
            email: confirmSignUpDtoInput.email,
            confirmationCode: confirmSignUpDtoInput.confirmationCode,
        })

        return new ConfirmSignUpDtoOutput(user.email)
    }

    async signIn(signInDtoInput: SignInDtoInput): Promise<SignInDtoOutput> {
        const authenticationToken = await this.userRepository.authenticateUser({
            email: signInDtoInput.email,
            password: signInDtoInput.password,
        })

        return new SignInDtoOutput(
            authenticationToken.identityToken,
            authenticationToken.identityTokenType,
            authenticationToken.refreshToken,
        )
    }
}

export class SignUpDtoInput {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}

export class SignUpDtoOutput {
    constructor(public readonly email: string) {}
}

export class ConfirmSignUpDtoInput {
    constructor(
        public readonly email: string,
        public readonly confirmationCode: string,
    ) {}
}

export class ConfirmSignUpDtoOutput {
    constructor(public readonly email: string) {}
}

export class SignInDtoInput {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}

export class SignInDtoOutput {
    constructor(
        public readonly identityToken: string,
        public readonly identityTokenType: string,
        public readonly refreshToken: string,
    ) {}
}
