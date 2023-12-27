import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {UserController} from "../../../src/controller/UserController";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";
import {
    EmailExistsException,
    ExpiredConfirmationCodeException,
    InvalidConfirmationCodeException,
    EmailNotConfirmedException,
    IncorrectEmailOrPasswordException,
} from "../../../src/repository/UserRepositoryImpl";

import {SignUpDtoInput, SignUpDtoOutput, SignUpUseCase} from "../../../src/use-case/SignUpUseCase";
import {
    ConfirmSignUpDtoInput,
    ConfirmSignUpDtoOutput,
    ConfirmSignUpUseCase
} from "../../../src/use-case/ConfirmSignUpUseCase";
import {SignInDtoInput, SignInDtoOutput, SignInUseCase} from "../../../src/use-case/SignInUseCase";

describe("UserController", () => {
    const signUpUseCase = mockDeep<SignUpUseCase>()
    const confirmSignUpUseCase = mockDeep<ConfirmSignUpUseCase>()
    const signInUseCase = mockDeep<SignInUseCase>()
    const userController = new UserController(
        signUpUseCase,
        confirmSignUpUseCase,
        signInUseCase,
    )

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

    describe("confirmSignUp", () => {
        const email = faker.internet.email()
        const confirmationCode = "000000"
        const confirmSignUpDtoInput = new ConfirmSignUpDtoInput(email, confirmationCode)
        const httpRequest = new HttpRequest<ConfirmSignUpDtoInput>(confirmSignUpDtoInput)

        test("should return bad request http response with EXPIRED_CONFIRMATION_CODE api status code", async () => {
            jest.spyOn(confirmSignUpUseCase, "execute").mockRejectedValue(new ExpiredConfirmationCodeException())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(confirmSignUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.EXPIRED_CONFIRMATION_CODE, "Expired confirmation code", null))
        })

        test("should return bad request http response with INVALID_CONFIRMATION_CODE api status code", async () => {
            jest.spyOn(confirmSignUpUseCase, "execute").mockRejectedValue(new InvalidConfirmationCodeException())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(confirmSignUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.INVALID_CONFIRMATION_CODE, "Invalid confirmation code", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(confirmSignUpUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(confirmSignUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const confirmSignUpDtoOutput = new ConfirmSignUpDtoOutput(email)
            jest.spyOn(confirmSignUpUseCase, "execute").mockResolvedValue(confirmSignUpDtoOutput)
            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(confirmSignUpUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok<SignUpDtoOutput>("Confirm sign up executed with success", confirmSignUpDtoOutput))
        })
    })

    describe("signIn", () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const signInDtoInput = new SignInDtoInput(email, password)
        const httpRequest = new HttpRequest<SignInDtoInput>(signInDtoInput)

        test("should return bad request http response with INCORRECT_EMAIL_OR_PASSWORD api status code", async () => {
            jest.spyOn(signInUseCase, "execute").mockRejectedValue(new IncorrectEmailOrPasswordException())

            const httpResponse = await userController.signIn(httpRequest)

            expect(signInUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.INCORRECT_EMAIL_OR_PASSWORD, "Incorrect email or password", null))
        })

        test("should return bad request http response with EMAIL_NOT_CONFIRMED api status code", async () => {
            jest.spyOn(signInUseCase, "execute").mockRejectedValue(new EmailNotConfirmedException())

            const httpResponse = await userController.signIn(httpRequest)

            expect(signInUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.EMAIL_NOT_CONFIRMED, "Email not confirmed", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(signInUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await userController.signIn(httpRequest)

            expect(signInUseCase.execute).toBeCalledWith(httpRequest.data)
        })

        test("should return ok http response", async () => {
            const signInDtoOutput = new SignInDtoOutput(
                "identity-token",
                "Bearer",
                "refresh-token"
            )
            jest.spyOn(signInUseCase, "execute").mockResolvedValue(signInDtoOutput)

            const httpResponse = await userController.signIn(httpRequest)

            expect(signInUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("Sign in executed with success", signInDtoOutput))
        })
    })
})