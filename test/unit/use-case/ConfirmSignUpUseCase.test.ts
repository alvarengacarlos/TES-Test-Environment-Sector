import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {ConfirmSignUpDtoInput, ConfirmSignUpDtoOutput, ConfirmSignUpUseCase} from "../../../src/use-case/ConfirmSignUpUseCase";
import {UserRepository} from "../../../src/repository/UserRepository";

describe("ConfirmSignUpUseCase", () => {
    const userRepository = mockDeep<UserRepository>()
    const confirmSignUpUseCase = new ConfirmSignUpUseCase(userRepository)

    const email = faker.internet.email()
    const confirmationCode = "000000"
    const confirmSignUpDtoInput = new ConfirmSignUpDtoInput(
        email,
        confirmationCode
    )
    const confirmSignUpDtoOutput = new ConfirmSignUpDtoOutput(
        email
    )

    describe("execute", () => {
        test("should confirm the user sign up", async () => {
            jest.spyOn(userRepository, "updateUserEmailToVerified").mockReturnValue(Promise.resolve(confirmSignUpDtoOutput))

            const output = await confirmSignUpUseCase.execute(confirmSignUpDtoInput)

            expect(output).toEqual(confirmSignUpDtoOutput)
        })
    })
})