import {describe, expect, jest, test} from "@jest/globals";
import {faker} from "@faker-js/faker";
import {mockClient} from "aws-sdk-client-mock";

import {UserRepositoryImpl} from "../../../src/repository/UserRepositoryImpl";
import {cognitoClient} from "../../../src/infra/cognitoClient";
import {UserEntity} from "../../../src/entity/UserEntity";
import {AuthenticationTokenEntity} from "../../../src/entity/AuthenticationTokenEntity";
import {
    AdminInitiateAuthCommand,
    CodeMismatchException, ConfirmSignUpCommand,
    ExpiredCodeException,
    NotAuthorizedException, SignUpCommand, UsernameExistsException,
    UserNotConfirmedException,
    UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";
import {IncorrectEmailOrPasswordException} from "../../../src/exception/IncorrectEmailOrPasswordException";
import {EmailNotConfirmedException} from "../../../src/exception/EmailNotConfirmedException";
import {CognitoException} from "../../../src/exception/CognitoException";
import {ExpiredConfirmationCodeException} from "../../../src/exception/ExpiredConfirmationCodeException";
import {InvalidConfirmationCodeException} from "../../../src/exception/InvalidConfirmationCodeException";
import {EmailExistsException} from "../../../src/exception/EmailExistsException";

describe("UserRepositoryImpl", () => {
    const cognitoClientMocked = mockClient(cognitoClient)
    const userRepository = new UserRepositoryImpl(cognitoClient)

    const email = faker.internet.email()
    const password = faker.internet.password()

    describe("saveUser", () => {
        const saveUserInput = {
            email: email,
            password: password
        }

        test("should throw EmailExistsException", async () => {
            cognitoClientMocked.on(SignUpCommand).rejects(new UsernameExistsException({
                    message: "",
                    $metadata: {}
            }))

            await expect(userRepository.saveUser(saveUserInput)).rejects.toThrow(EmailExistsException)
        })

        test("should throw CognitoException", async () => {
            cognitoClientMocked.on(SignUpCommand).rejects(new Error())

            await expect(userRepository.saveUser(saveUserInput)).rejects.toThrow(CognitoException)
        })

        test("should save a user", async () => {
            const userEntity = new UserEntity(email, password)
            cognitoClientMocked.on(SignUpCommand).resolves({})

            const output = await userRepository.saveUser(saveUserInput)

            expect(output).toEqual(userEntity)
        })
    })

    describe("updateUserEmailToVerified", () => {
        const updateUserEmailToVerifiedInput = {
            email: email,
            confirmationCode: "000000"
        }

        test("should throw ExpiredConfirmationCodeException", async () => {
            cognitoClientMocked.on(ConfirmSignUpCommand).rejects(new ExpiredCodeException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(ExpiredConfirmationCodeException)
        })

        test("should throw InvalidConfirmationCodeException", async () => {
            cognitoClientMocked.on(ConfirmSignUpCommand).rejects(new CodeMismatchException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(InvalidConfirmationCodeException)

            cognitoClientMocked.on(ConfirmSignUpCommand).rejects(new NotAuthorizedException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(InvalidConfirmationCodeException)
        })

        test("should throw CognitoException", async () => {
            cognitoClientMocked.on(ConfirmSignUpCommand).rejects(new Error())

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(CognitoException)
        })

        test("should update a user email to verified", async () => {
            const userEntity = new UserEntity(email, "")
            cognitoClientMocked.on(ConfirmSignUpCommand).resolves({})

            const output = await userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)

            expect(output).toEqual(userEntity)
        })
    })

    describe("authenticateUser", () => {
        const authenticateUserInput = {
            email: email,
            password: password
        }

        test("should throw IncorrectEmailOrPasswordException", async () => {
            cognitoClientMocked.on(AdminInitiateAuthCommand).rejects(new UserNotFoundException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(IncorrectEmailOrPasswordException)

            cognitoClientMocked.on(AdminInitiateAuthCommand).rejects(new NotAuthorizedException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(IncorrectEmailOrPasswordException)
        })

        test("should throw EmailNotConfirmedException", async () => {
            cognitoClientMocked.on(AdminInitiateAuthCommand).rejects(new UserNotConfirmedException({
                message: "",
                $metadata: {}
            }))

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(EmailNotConfirmedException)
        })

        test("should throw CognitoException", async () => {
            cognitoClientMocked.on(AdminInitiateAuthCommand).rejects(new Error())

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(CognitoException)
        })

        test("should authenticate a user", async () => {
            const authenticationTokenEntity = new AuthenticationTokenEntity(
                "identity-token",
                "Bearer",
                "refresh-token"
            )
            cognitoClientMocked.on(AdminInitiateAuthCommand).resolves({
                AuthenticationResult: {
                    IdToken: authenticationTokenEntity.identityToken,
                    TokenType: authenticationTokenEntity.identityTokenType,
                    RefreshToken: authenticationTokenEntity.refreshToken
                }
            })

            const output = await userRepository.authenticateUser(authenticateUserInput)

            expect(output).toEqual(authenticationTokenEntity)
        })
    })
})