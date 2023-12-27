import {UserRepository} from "../repository/UserRepository";

export class ConfirmSignUpUseCase {
    constructor(
        private userRepository: UserRepository
    ) {
    }

    async execute(confirmSignUpDtoInput: ConfirmSignUpDtoInput): Promise<ConfirmSignUpDtoOutput> {
        return await this.userRepository.updateUserEmailToVerified(confirmSignUpDtoInput)
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
