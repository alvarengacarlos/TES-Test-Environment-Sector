import express, {NextFunction, Request, Response} from "express"

import {HttpRequest} from "../util/HttpRequest";
import {SignUpDtoInput, SignUpUseCase} from "../use-case/SignUpUseCase";
import {UserRepositoryImpl} from "../repository/UserRepositoryImpl";
import {UserController} from "../controller/UserController";
import {UserValidator} from "../middleware/UserValidator";

const userRepository = new UserRepositoryImpl()
const signUpUseCase = new SignUpUseCase(userRepository)
const userController = new UserController(signUpUseCase)
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
