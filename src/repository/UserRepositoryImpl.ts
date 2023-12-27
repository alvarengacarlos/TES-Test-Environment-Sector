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
import {UserRepository} from "./UserRepository";
import {SignUpDtoInput, SignUpDtoOutput} from "../use-case/SignUpUseCase";
import {ConfirmSignUpDtoInput, ConfirmSignUpDtoOutput} from "../use-case/ConfirmSignUpUseCase";
import {SignInDtoInput, SignInDtoOutput} from "../use-case/SignInUseCase";

export class UserRepositoryImpl implements UserRepository {
    private cognitoClient = new CognitoIdentityProviderClient()

    async saveUser(signUpDtoInput: SignUpDtoInput): Promise<SignUpDtoOutput> {
        try {
            const signUpCommand = new SignUpCommand({
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                SecretHash: await createCognitoSecretHash(signUpDtoInput.email),
                Username: signUpDtoInput.email,
                Password: signUpDtoInput.password
            })

            Logger.info(this.constructor.name, this.saveUser.name, "executing sign up command")
            await this.cognitoClient.send(signUpCommand)

            Logger.info(this.constructor.name, this.saveUser.name, "sign up command executed with success")
            return new SignUpDtoOutput(signUpDtoInput.email)

        } catch (error: any) {
            if (error instanceof UsernameExistsException) {
                Logger.warn(this.constructor.name, this.saveUser.name, "sign up command throw username exists")
                throw new EmailExistsException()
            }

            Logger.error(this.constructor.name, this.saveUser.name, `sign up command throw unhandled error: ${error.message}`)
            throw new Error(error.message)
        }
    }

    async updateUserEmailToVerified(confirmSignUpDtoInput: ConfirmSignUpDtoInput): Promise<ConfirmSignUpDtoOutput> {
        try {
            const confirmSignUpCommand = new ConfirmSignUpCommand({
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                SecretHash: await createCognitoSecretHash(confirmSignUpDtoInput.email),
                Username: confirmSignUpDtoInput.email,
                ConfirmationCode: confirmSignUpDtoInput.confirmationCode
            })

            Logger.info(this.constructor.name, this.updateUserEmailToVerified.name, "executing confirm sign up command")
            await this.cognitoClient.send(confirmSignUpCommand)

            Logger.info(this.constructor.name, this.updateUserEmailToVerified.name, "confirm sign up command executed with success")
            return new ConfirmSignUpDtoOutput(confirmSignUpDtoInput.email)

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
            throw new Error(error.message)
        }
    }

    async authenticateUser(signInDtoInput: SignInDtoInput): Promise<SignInDtoOutput> {
        try {
            const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
                UserPoolId: String(process.env.COGNITO_USER_POOL_ID),
                ClientId: String(process.env.COGNITO_CLIENT_ID),
                AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
                AuthParameters: {
                    USERNAME: signInDtoInput.email,
                    PASSWORD: signInDtoInput.password,
                    SECRET_HASH: await createCognitoSecretHash(signInDtoInput.email)
                }
            })

            const response = await this.cognitoClient.send(adminInitiateAuthCommand)
            return new SignInDtoOutput(
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
            throw new Error(error.message)
        }
    }
}

export class EmailExistsException extends Error {
    constructor() {
        super("Email exists");
    }
}

export class ExpiredConfirmationCodeException extends Error {
    constructor() {
        super("Expired confirmation code");
    }
}

export class InvalidConfirmationCodeException extends Error {
    constructor() {
        super("Invalid confirmation code");
    }
}

export class EmailNotConfirmedException extends Error {
    constructor() {
        super("Email not confirmed");
    }
}

export class IncorrectEmailOrPasswordException extends Error {
    constructor() {
        super("Incorrect email or password");
    }
}
