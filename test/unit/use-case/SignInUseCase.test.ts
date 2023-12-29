import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {SignInDtoInput, SignInDtoOutput, SignInUseCase} from "../../../src/use-case/SignInUseCase";
import {UserRepository} from "../../../src/repository/UserRepository";
import {AuthenticationTokenEntity} from "../../../src/entity/AuthenticationTokenEntity";

describe("SignInUseCase", () => {
    const userRepository = mockDeep<UserRepository>()
    const signInUseCase = new SignInUseCase(userRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()
    const signInDtoInput = new SignInDtoInput(
        email,
        password
    )

    const authenticationTokenEntity = new AuthenticationTokenEntity(
        "identity-token",
        "Bearer",
        "refresh-token"
    )

    const signInDtoOutput = new SignInDtoOutput(
        authenticationTokenEntity.identityToken,
        authenticationTokenEntity.identityTokenType,
        authenticationTokenEntity.refreshToken
    )

    describe("execute", () => {
        test("should sign in a user", async () => {
            jest.spyOn(userRepository, "authenticateUser").mockResolvedValue(authenticationTokenEntity)

            const output = await signInUseCase.execute(signInDtoInput)

            expect(output).toEqual(signInDtoOutput)
        })
    })
})