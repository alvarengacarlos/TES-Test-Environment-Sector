import { describe, expect, jest, test } from "@jest/globals"
import { mockDeep } from "jest-mock-extended"
import { faker } from "@faker-js/faker"

import {
    ConfirmSignUpDtoInput,
    ConfirmSignUpDtoOutput,
    SignInDtoInput,
    SignInDtoOutput,
    SignUpDtoInput,
    SignUpDtoOutput,
    UserService,
} from "../../../src/service/UserService"
import { UserRepository } from "../../../src/repository/UserRepository"
import { UserEntity } from "../../../src/entity/UserEntity"
import { AuthenticationTokenEntity } from "../../../src/entity/AuthenticationTokenEntity"

describe("UserService", () => {
    const userRepository = mockDeep<UserRepository>()
    const userService = new UserService(userRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()

    describe("signUp", () => {
        const signUpDtoInput = new SignUpDtoInput(email, password)
        const signUpDtoOutput = new SignUpDtoOutput(email)

        test("should sign up a user", async () => {
            const userEntity = new UserEntity(email, password)
            jest.spyOn(userRepository, "saveUser").mockResolvedValue(userEntity)

            const output = await userService.signUp(signUpDtoInput)

            expect(output).toEqual(signUpDtoOutput)
        })
    })

    describe("confirmSignUp", () => {
        const confirmSignUpDtoInput = new ConfirmSignUpDtoInput(email, "000000")
        const confirmSignUpDtoOutput = new ConfirmSignUpDtoOutput(email)

        test("should confirm the user sign up", async () => {
            const userEntity = new UserEntity(email, "")
            jest.spyOn(
                userRepository,
                "updateUserEmailToVerified",
            ).mockResolvedValue(userEntity)

            const output = await userService.confirmSignUp(
                confirmSignUpDtoInput,
            )

            expect(output).toEqual(confirmSignUpDtoOutput)
        })
    })

    describe("signIn", () => {
        const signInDtoInput = new SignInDtoInput(email, password)
        const signInDtoOutput = new SignInDtoOutput(
            "identity-token",
            "Bearer",
            "refresh-token",
        )

        test("should sign in a user", async () => {
            const authenticationTokenEntity = new AuthenticationTokenEntity(
                "identity-token",
                "Bearer",
                "refresh-token",
            )
            jest.spyOn(userRepository, "authenticateUser").mockResolvedValue(
                authenticationTokenEntity,
            )

            const output = await userService.signIn(signInDtoInput)

            expect(output).toEqual(signInDtoOutput)
        })
    })
})
