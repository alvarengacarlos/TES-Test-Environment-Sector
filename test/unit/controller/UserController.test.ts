import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {UserController} from "../../../src/controller/UserController";
import {
    ConfirmSignUpDtoInput,
    ConfirmSignUpDtoOutput, SignInDtoInput, SignInDtoOutput,
    SignUpDtoInput,
    SignUpDtoOutput,
    UserService
} from "../../../src/service/UserService";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";
import {EmailExistsException} from "../../../src/exception/EmailExistsException";
import {ExpiredConfirmationCodeException} from "../../../src/exception/ExpiredConfirmationCodeException";
import {InvalidConfirmationCodeException} from "../../../src/exception/InvalidConfirmationCodeException";
import {IncorrectEmailOrPasswordException} from "../../../src/exception/IncorrectEmailOrPasswordException";
import {EmailNotConfirmedException} from "../../../src/exception/EmailNotConfirmedException";

describe("UserController", () => {
    const userService = mockDeep<UserService>()
    const userController = new UserController(userService)

    const email = faker.internet.email()
    const password = faker.internet.password()

    describe("signUp", () => {
        const signUpDtoInput = new SignUpDtoInput(email, password)
        const httpRequest = new HttpRequest(signUpDtoInput)

        test("should return conflict http response", async () => {
            jest.spyOn(userService, "signUp").mockRejectedValue(new EmailExistsException())

            const httpResponse = await userController.signUp(httpRequest)

            expect(userService.signUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.conflict(ApiStatusCode.EMAIL_EXISTS, "Email exists", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(userService, "signUp").mockRejectedValue(new Error())

            const httpResponse = await userController.signUp(httpRequest)

            expect(userService.signUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const signUpDtoOutput = new SignUpDtoOutput(email)
            jest.spyOn(userService, "signUp").mockResolvedValue(signUpDtoOutput)

            const httpResponse = await userController.signUp(httpRequest)

            expect(userService.signUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created<SignUpDtoOutput>("Sign up executed with success", signUpDtoOutput))
        })
    })

    describe("confirmSignUp", () => {
        const confirmSignUpDtoInput = new ConfirmSignUpDtoInput(email, "000000")
        const httpRequest = new HttpRequest<ConfirmSignUpDtoInput>(confirmSignUpDtoInput)

        test("should return bad request http response with EXPIRED_CONFIRMATION_CODE api status code", async () => {
            jest.spyOn(userService, "confirmSignUp").mockRejectedValue(new ExpiredConfirmationCodeException())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(userService.confirmSignUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.EXPIRED_CONFIRMATION_CODE, "Expired confirmation code", null))
        })

        test("should return bad request http response with INVALID_CONFIRMATION_CODE api status code", async () => {
            jest.spyOn(userService, "confirmSignUp").mockRejectedValue(new InvalidConfirmationCodeException())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(userService.confirmSignUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.INVALID_CONFIRMATION_CODE, "Invalid confirmation code", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(userService, "confirmSignUp").mockRejectedValue(new Error())

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(userService.confirmSignUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const confirmSignUpDtoOutput = new ConfirmSignUpDtoOutput(email)
            jest.spyOn(userService, "confirmSignUp").mockResolvedValue(confirmSignUpDtoOutput)

            const httpResponse = await userController.confirmSignUp(httpRequest)

            expect(userService.confirmSignUp).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok<SignUpDtoOutput>("Confirm sign up executed with success", confirmSignUpDtoOutput))
        })
    })

    describe("signIn", () => {
        const signInDtoInput = new SignInDtoInput(email, password)
        const httpRequest = new HttpRequest<SignInDtoInput>(signInDtoInput)

        test("should return bad request http response with INCORRECT_EMAIL_OR_PASSWORD api status code", async () => {
            jest.spyOn(userService, "signIn").mockRejectedValue(new IncorrectEmailOrPasswordException())

            const httpResponse = await userController.signIn(httpRequest)

            expect(userService.signIn).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.INCORRECT_EMAIL_OR_PASSWORD, "Incorrect email or password", null))
        })

        test("should return bad request http response with EMAIL_NOT_CONFIRMED api status code", async () => {
            jest.spyOn(userService, "signIn").mockRejectedValue(new EmailNotConfirmedException())

            const httpResponse = await userController.signIn(httpRequest)

            expect(userService.signIn).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.EMAIL_NOT_CONFIRMED, "Email not confirmed", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(userService, "signIn").mockRejectedValue(new Error())

            const httpResponse = await userController.signIn(httpRequest)

            expect(userService.signIn).toBeCalledWith(httpRequest.data)
        })

        test("should return ok http response", async () => {
            const signInDtoOutput = new SignInDtoOutput(
                "identity-token",
                "Bearer",
                "refresh-token"
            )
            jest.spyOn(userService, "signIn").mockResolvedValue(signInDtoOutput)

            const httpResponse = await userController.signIn(httpRequest)

            expect(userService.signIn).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("Sign in executed with success", signInDtoOutput))
        })
    })
})