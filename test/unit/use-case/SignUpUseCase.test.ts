import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {SignUpDtoInput, SignUpDtoOutput, SignUpUseCase} from "../../../src/use-case/SignUpUseCase";
import {UserRepository} from "../../../src/repository/UserRepository";
import {UserEntity} from "../../../src/entity/UserEntity";

describe("SignUpUseCase", () => {
    const userRepository = mockDeep<UserRepository>()
    const signUpUseCase = new SignUpUseCase(userRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()
    const signUpDtoInput = new SignUpDtoInput(
        email,
        password
    )
    const signUpDtoOutput = new SignUpDtoOutput(
        email
    )

    const userEntity = new UserEntity(email, password)

    describe("execute", () => {
        test("should sign up a user", async () => {
            jest.spyOn(userRepository, "saveUser").mockResolvedValue(userEntity)

            const output = await signUpUseCase.execute(signUpDtoInput)

            expect(output).toEqual(signUpDtoOutput)
        })
    })
})