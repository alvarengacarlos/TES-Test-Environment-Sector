import {UserRepository} from "../repository/UserRepository";

export class ConfirmSignUpUseCase {
    constructor(
        private userRepository: UserRepository
    ) {
    }

    async execute(confirmSignUpDtoInput: ConfirmSignUpDtoInput): Promise<ConfirmSignUpDtoOutput> {
        const user= await this.userRepository.updateUserEmailToVerified({
            email: confirmSignUpDtoInput.email,
            confirmationCode: confirmSignUpDtoInput.confirmationCode
        })

        return new ConfirmSignUpDtoOutput(
            user.email
        )
    }
}

export class ConfirmSignUpDtoInput {
    constructor(
        public readonly email: string,
        public readonly confirmationCode: string,
    ) {
    }
}

export class ConfirmSignUpDtoOutput {
    constructor(
        public readonly email: string,
    ) {
    }
}
