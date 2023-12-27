import {NextFunction, Request, Response} from "express"
import Joi, {ValidationErrorItem} from "joi"

import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";

export class UserValidator {
    signUpValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .trim()
                .required(),
            password: Joi.string()
                .trim()
                .min(8)
                .max(64)
                .pattern(/^(?=.*[a-z]).*$/)
                .message("\"password\" must have at least 1 lowercase alphabetical character")
                .pattern(/^(?=.*[A-Z]).*$/)
                .message("\"password\" must have at least 1 uppercase alphabetical character")
                .pattern(/^(?=.*\d).*$/)
                .message("\"password\" must have at least 1 numerical character")
                .pattern(/^(?=.*[@$!%*?&]).*$/)
                .message("\"password\" must have at least 1 special character (@, $, !, %, *, ?, &)")
                .required()
        })

        const result = schema.validate(request.body)

        if (result.error) {
            const httpResponse = HttpResponse.badRequest<Array<ValidationErrorItem>>(ApiStatusCode.INVALID_INPUT, result.error.message, result.error.details)
            return response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        }

        request.body = result.value
        next()
    }

    confirmSignUpValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .trim()
                .required(),
            confirmationCode: Joi.string()
                .trim()
                .min(6)
                .max(6)
                .required()
        })

        const result = schema.validate(request.body)

        if (result.error) {
            const httpResponse = HttpResponse.badRequest<Array<ValidationErrorItem>>(ApiStatusCode.INVALID_INPUT, result.error.message, result.error.details)
            return response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        }

        request.body = result.value
        next()
    }
}