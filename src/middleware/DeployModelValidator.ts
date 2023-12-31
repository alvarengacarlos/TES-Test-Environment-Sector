import {NextFunction, Request, Response} from "express"
import Joi, {ValidationErrorItem} from "joi"

import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";

export class DeployModelValidator {
    createDeployModelValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            deployModelName: Joi.string()
                .trim()
                .min(1)
                .max(100)
                .required(),
        })

        const result = schema.validate(request.body)

        if (result.error) {
            const httpResponse = HttpResponse.badRequest<Array<ValidationErrorItem>>(ApiStatusCode.INVALID_INPUT, result.error.message, result.error.details)
            return response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        }

        request.body = result.value
        next()
    }

    uploadSourceCodeValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            deployModelId: Joi.string()
                .uuid()
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

    saveAwsCredentialsValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            deployModelId: Joi.string()
                .uuid()
                .required(),
            accessKeyId: Joi.string()
                .trim()
                .min(20)
                .max(20)
                .required(),
            secretAccessKey: Joi.string()
                .trim()
                .min(40)
                .max(40)
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