import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {SignInDtoInput, SignInDtoOutput, SignInUseCase} from "../../../src/use-case/SignInUseCase";
import {UserRepository} from "../../../src/repository/UserRepository";

describe("SignInUseCase", () => {
    const userRepository = mockDeep<UserRepository>()
    const signInUseCase = new SignInUseCase(userRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()
    const signInDtoInput = new SignInDtoInput(
        email,
        password
    )
    const signInDtoOutput = new SignInDtoOutput(
        "identity-token",
        "Bearer",
        "refresh-token"
    )

    describe("execute", () => {
        test("should sign in a user", async () => {
            jest.spyOn(userRepository, "authenticateUser").mockReturnValue(Promise.resolve(signInDtoOutput))

            const output = await signInUseCase.execute(signInDtoInput)

            expect(output).toEqual(signInDtoOutput)
        })
    })
})