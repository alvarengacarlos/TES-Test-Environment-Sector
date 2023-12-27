import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {UserController} from "../../../src/controller/UserController";
import {SignUpDtoInput, SignUpDtoOutput, SignUpUseCase} from "../../../src/use-case/SignUpUseCase";
import {EmailExistsException} from "../../../src/repository/UserRepositoryImpl";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";

describe("UserController", () => {
    const signUpUseCase = mockDeep<SignUpUseCase>()
    const userController = new UserController(signUpUseCase)

    describe("signUp", () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const signUpDtoInput = new SignUpDtoInput(email, password)
        const httpRequest = new HttpRequest<SignUpDtoInput>(signUpDtoInput)

        test("should return conflict http response", async () => {
            jest.spyOn(signUpUseCase, "execute").mockRejectedValue(new EmailExistsException())

            const httpResponse = await userController.signUp(httpRequest)

            expect(signUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.conflict(ApiStatusCode.EMAIL_EXISTS, "Email exists", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(signUpUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await userController.signUp(httpRequest)

            expect(signUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const signUpDtoOutput = new SignUpDtoOutput(email)
            jest.spyOn(signUpUseCase, "execute").mockResolvedValue(signUpDtoOutput)

            const httpResponse = await userController.signUp(httpRequest)

            expect(signUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created<SignUpDtoOutput>("Sign up executed with success", signUpDtoOutput))
        })
    })
})