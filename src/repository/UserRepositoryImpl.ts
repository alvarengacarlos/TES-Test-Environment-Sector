import {
    CodeMismatchException,
    ConfirmSignUpCommand,
    ExpiredCodeException,
    AdminInitiateAuthCommand,
    CognitoIdentityProviderClient,
    NotAuthorizedException,
    SignUpCommand,
    UsernameExistsException, UserNotConfirmedException, UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";

import {createCognitoSecretHash} from "../util/createCognitoSecretHash";
import {Logger} from "../util/Logger";
import {AuthenticateUserInput, SaveUserInput, UpdateUserEmailToVerifiedInput, UserRepository} from "./UserRepository";
import {IncorrectEmailOrPasswordException} from "../exception/IncorrectEmailOrPasswordException";
import {EmailNotConfirmedException} from "../exception/EmailNotConfirmedException";
import {InvalidConfirmationCodeException} from "../exception/InvalidConfirmationCodeException";
import {ExpiredConfirmationCodeException} from "../exception/ExpiredConfirmationCodeException";
import {EmailExistsException} from "../exception/EmailExistsException";
import {UserEntity} from "../entity/UserEntity";
import {AuthenticationTokenEntity} from "../entity/AuthenticationTokenEntity";
import {CognitoException} from "../exception/CognitoException";

export class UserRepositoryImpl implements UserRepository {
    constructor(
        private readonly cognitoClient: CognitoIdentityProviderClient
    ) {
    }

    async saveUser(saveUserInput: SaveUserInput): Promise<UserEntity> {
        try {
            const signUpCommand = new SignUpCommand({
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                SecretHash: await createCognitoSecretHash(saveUserInput.email),
                Username: saveUserInput.email,
                Password: saveUserInput.password
            })

            Logger.info(this.constructor.name, this.saveUser.name, "executing sign up command")
            await this.cognitoClient.send(signUpCommand)

            Logger.info(this.constructor.name, this.saveUser.name, "sign up command executed with success")
            return new UserEntity(
                saveUserInput.email,
                saveUserInput.password
            )

        } catch (error: any) {
            if (error instanceof UsernameExistsException) {
                Logger.warn(this.constructor.name, this.saveUser.name, "sign up command throw username exists")
                throw new EmailExistsException()
            }

            Logger.error(this.constructor.name, this.saveUser.name, `sign up command throw unhandled error: ${error.message}`)
            throw new CognitoException()
        }
    }

    async updateUserEmailToVerified(updateUserEmailToVerifiedInput: UpdateUserEmailToVerifiedInput): Promise<UserEntity> {
        try {
            const confirmSignUpCommand = new ConfirmSignUpCommand({
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                SecretHash: await createCognitoSecretHash(updateUserEmailToVerifiedInput.email),
                Username: updateUserEmailToVerifiedInput.email,
                ConfirmationCode: updateUserEmailToVerifiedInput.confirmationCode
            })

            Logger.info(this.constructor.name, this.updateUserEmailToVerified.name, "executing confirm sign up command")
            await this.cognitoClient.send(confirmSignUpCommand)

            Logger.info(this.constructor.name, this.updateUserEmailToVerified.name, "confirm sign up command executed with success")
            return new UserEntity(
                updateUserEmailToVerifiedInput.email,
                ""
            )

        } catch (error: any) {
            if (error instanceof ExpiredCodeException) {
                Logger.warn(this.constructor.name, this.updateUserEmailToVerified.name, "confirm sign up command throw expired code")
                throw new ExpiredConfirmationCodeException()
            }

            if (error instanceof CodeMismatchException) {
                Logger.warn(this.constructor.name, this.updateUserEmailToVerified.name, "confirm sign up command throw code mismatch")
                throw new InvalidConfirmationCodeException()
            }

            if (error instanceof NotAuthorizedException) {
                Logger.warn(this.constructor.name, this.updateUserEmailToVerified.name, "confirm sign up command throw not authorized")
                throw new InvalidConfirmationCodeException()
            }

            Logger.error(this.constructor.name, this.updateUserEmailToVerified.name, `confirm sign up command throw unhandled error: ${error.message}`)
            throw new CognitoException()
        }
    }

    async authenticateUser(authenticateUserInput: AuthenticateUserInput): Promise<AuthenticationTokenEntity> {
        try {
            const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
                UserPoolId: String(process.env.COGNITO_USER_POOL_ID),
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
                AuthParameters: {
                    USERNAME: authenticateUserInput.email,
                    PASSWORD: authenticateUserInput.password,
                    SECRET_HASH: await createCognitoSecretHash(authenticateUserInput.email)
                }
            })

            const response = await this.cognitoClient.send(adminInitiateAuthCommand)
            return new AuthenticationTokenEntity(
                String(response.AuthenticationResult?.IdToken),
                String(response.AuthenticationResult?.TokenType),
                String(response.AuthenticationResult?.RefreshToken),
            )

        } catch (error: any) {
            if (error instanceof UserNotFoundException) {
                Logger.warn(this.constructor.name, this.authenticateUser.name, "sign in command throw user not found")
                throw new IncorrectEmailOrPasswordException()
            }

            if (error instanceof NotAuthorizedException) {
                Logger.warn(this.constructor.name, this.authenticateUser.name, "sign in command throw not authorized")
                throw new IncorrectEmailOrPasswordException()
            }

            if (error instanceof UserNotConfirmedException) {
                Logger.warn(this.constructor.name, this.authenticateUser.name, "sign in command throw user not confirmed")
                throw new EmailNotConfirmedException()
            }

            Logger.error(this.constructor.name, this.authenticateUser.name, `sign in command throw unhandled error: ${error.message}`)
            throw new CognitoException()
        }
    }
}
