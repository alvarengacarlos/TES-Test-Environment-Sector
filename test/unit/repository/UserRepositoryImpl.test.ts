import {describe, expect, jest, test} from "@jest/globals";
import {faker} from "@faker-js/faker";

import {UserRepositoryImpl} from "../../../src/repository/UserRepositoryImpl";
import {cognitoClient} from "../../../src/infra/cognitoClient";
import {UserEntity} from "../../../src/entity/UserEntity";
import {AuthenticationTokenEntity} from "../../../src/entity/AuthenticationTokenEntity";
import {
    CodeMismatchException,
    ExpiredCodeException,
    NotAuthorizedException, UsernameExistsException,
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
    const userRepository = new UserRepositoryImpl(cognitoClient)

    const email = faker.internet.email()
    const password = faker.internet.password()

    describe("saveUser", () => {
        const saveUserInput = {
            email: email,
            password: password
        }
        const userEntity = new UserEntity(email, password)

        test("should throw EmailExistsException", async () => {
            cognitoClient.send = async function() {
                throw new UsernameExistsException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.saveUser(saveUserInput)).rejects.toThrow(EmailExistsException)
        })

        test("should throw CognitoException", async () => {
            cognitoClient.send = async function() {
                throw new Error()
            }

            await expect(userRepository.saveUser(saveUserInput)).rejects.toThrow(CognitoException)
        })

        test("should save a user", async () => {
            cognitoClient.send = async function() {}

            const output = await userRepository.saveUser(saveUserInput)

            expect(output).toEqual(userEntity)
        })
    })

    describe("updateUserEmailToVerified", () => {
        const updateUserEmailToVerifiedInput = {
            email: email,
            confirmationCode: "000000"
        }
        const userEntity = new UserEntity(email, "")


        test("should throw ExpiredConfirmationCodeException", async () => {
            cognitoClient.send = async function () {
                throw new ExpiredCodeException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(ExpiredConfirmationCodeException)
        })

        test("should throw InvalidConfirmationCodeException", async () => {
            cognitoClient.send = async function () {
                throw new CodeMismatchException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(InvalidConfirmationCodeException)

            cognitoClient.send = async function () {
                throw new NotAuthorizedException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(InvalidConfirmationCodeException)
        })

        test("should throw CognitoException", async () => {
            cognitoClient.send = async function () {
                throw new Error()
            }

            await expect(userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)).rejects.toThrow(CognitoException)
        })

        test("should update a user email to verified", async () => {
            cognitoClient.send = async function () {}

            const output = await userRepository.updateUserEmailToVerified(updateUserEmailToVerifiedInput)

            expect(output).toEqual(userEntity)
        })
    })

    describe("authenticateUser", () => {
        const authenticateUserInput = {
            email: email,
            password: password
        }

        const authenticationTokenEntity = new AuthenticationTokenEntity(
            "identity-token",
            "Bearer",
            "refresh-token"
        )

        const adminInitiateAuthCommandOutput = {
            AuthenticationResult: {
                IdToken: authenticationTokenEntity.identityToken,
                TokenType: authenticationTokenEntity.identityTokenType,
                RefreshToken: authenticationTokenEntity.refreshToken
            }
        }

        test("should throw IncorrectEmailOrPasswordException", async () => {
            cognitoClient.send = async function() {
                throw new UserNotFoundException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(IncorrectEmailOrPasswordException)

            cognitoClient.send = async function() {
                throw new NotAuthorizedException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(IncorrectEmailOrPasswordException)
        })

        test("should throw EmailNotConfirmedException", async () => {
            cognitoClient.send = async function() {
                throw new UserNotConfirmedException({
                    message: "",
                    $metadata: {}
                })
            }

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(EmailNotConfirmedException)
        })

        test("should throw CognitoException", async () => {
            cognitoClient.send = async function() {
                throw new Error()
            }

            await expect(userRepository.authenticateUser(authenticateUserInput)).rejects.toThrow(CognitoException)
        })

        test("should authenticate a user", async () => {
            cognitoClient.send = async function() {
                return adminInitiateAuthCommandOutput
            }

            const output = await userRepository.authenticateUser(authenticateUserInput)

            expect(output).toEqual(authenticationTokenEntity)
        })
    })
})