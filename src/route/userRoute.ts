import express, {NextFunction, Request, Response} from "express"

import {HttpRequest} from "../util/HttpRequest";
import {SignUpDtoInput, SignUpUseCase} from "../use-case/SignUpUseCase";
import {UserRepositoryImpl} from "../repository/UserRepositoryImpl";
import {UserController} from "../controller/UserController";
import {UserValidator} from "../middleware/UserValidator";
import {ConfirmSignUpDtoInput, ConfirmSignUpUseCase} from "../use-case/ConfirmSignUpUseCase";
import {SignInUseCase} from "../use-case/SignInUseCase";

const userRepository = new UserRepositoryImpl()
const signUpUseCase = new SignUpUseCase(userRepository)
const confirmSignUpUseCase = new ConfirmSignUpUseCase(userRepository)
const signInUseCase = new SignInUseCase(userRepository)

const userController = new UserController(signUpUseCase, confirmSignUpUseCase, signInUseCase)
const userValidator = new UserValidator()

export const userRouter = express.Router()

userRouter.post("/sign-up", userValidator.signUpValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<SignUpDtoInput>({
            email: request.body.email,
            password: request.body.password
        })

        const httpResponse = await userController.signUp(httpRequest)

        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

userRouter.post("/confirm-sign-up", userValidator.confirmSignUpValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<ConfirmSignUpDtoInput>({
            email: request.body.email,
            confirmationCode: request.body.confirmationCode
        })

        const httpResponse = await userController.confirmSignUp(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

userRouter.post("/sign-in", userValidator.signInValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<SignUpDtoInput>({
            email: request.body.email,
            password: request.body.password
        })

        const httpResponse = await userController.signIn(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})
