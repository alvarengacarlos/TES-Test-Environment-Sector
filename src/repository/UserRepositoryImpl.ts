import {
    CognitoIdentityProviderClient, InvalidPasswordException,
    SignUpCommand,
    UsernameExistsException
} from "@aws-sdk/client-cognito-identity-provider";

import {UserRepository} from "./UserRepository";
import {SignUpDtoInput, SignUpDtoOutput} from "../use-case/SignUpUseCase";
import {createCognitoSecretHash} from "../util/createCognitoSecretHash";
import {Logger} from "../util/Logger";

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
}

export class EmailExistsException extends Error {
    constructor() {
        super("Email exists");
    }
}
