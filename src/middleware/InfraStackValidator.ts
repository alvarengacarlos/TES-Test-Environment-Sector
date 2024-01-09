import { NextFunction, Request, Response } from "express"
import Joi, { ValidationErrorItem } from "joi"
import { ApiStatusCode, HttpResponse } from "../util/HttpResponse"
import { TemplateModel } from "../util/TemplateModel"

export class InfraStackValidator {
    createInfraStackValidator(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const schema = Joi.object({
            appName: Joi.string()
                .trim()
                .max(10)
                .lowercase()
                .replace(" ", "")
                .required(),
            templateType: Joi.string()
                .trim()
                .valid(TemplateModel.CONTAINER_MODEL)
                .required(),
            sourceCodePath: Joi.string().trim().required(),
        })

        const result = schema.validate(request.body)

        if (result.error) {
            const httpResponse = HttpResponse.badRequest<
                Array<ValidationErrorItem>
            >(
                ApiStatusCode.INVALID_INPUT,
                result.error.message,
                result.error.details,
            )
            return response
                .status(httpResponse.httpStatusCode)
                .json(httpResponse.body)
        }

        request.body = result.value
        next()
    }

    deleteInfraStackNameValidator(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const schema = Joi.object({
            stackName: Joi.string().trim().required(),
        })

        const result = schema.validate(request.params)

        if (result.error) {
            const httpResponse = HttpResponse.badRequest<
                Array<ValidationErrorItem>
            >(
                ApiStatusCode.INVALID_INPUT,
                result.error.message,
                result.error.details,
            )
            return response
                .status(httpResponse.httpStatusCode)
                .json(httpResponse.body)
        }

        request.params = result.value
        next()
    }
}
