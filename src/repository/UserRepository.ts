import { UserEntity } from "../entity/UserEntity"
import { AuthenticationTokenEntity } from "../entity/AuthenticationTokenEntity"

export interface UserRepository {
    saveUser(saveUserInput: SaveUserInput): Promise<UserEntity>
    updateUserEmailToVerified(
        updateUserEmailToVerifiedInput: UpdateUserEmailToVerifiedInput,
    ): Promise<UserEntity>
    authenticateUser(
        authenticateUserInput: AuthenticateUserInput,
    ): Promise<AuthenticationTokenEntity>
}

export type SaveUserInput = {
    email: string
    password: string
}

export type UpdateUserEmailToVerifiedInput = {
    email: string
    confirmationCode: string
}

export type AuthenticateUserInput = {
    email: string
    password: string
}
