import {NextFunction, Request, Response} from "express"
import Joi, {ValidationErrorItem} from "joi"

import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";
import {DatabaseType, DeployModelType, ExecutionEnvironment} from "../use-case/CreateDeployModelUseCase";

export class DeployModelValidator {
    createDeployModelValidator(request: Request, response: Response, next: NextFunction) {
        const schema = Joi.object({
            deployModelName: Joi.string()
                .trim()
                .min(1)
                .max(100)
                .required(),
            deployModelType: Joi.string()
                .trim()
                .valid(DeployModelType.TWO_TIERS, DeployModelType.THREE_TIERS)
                .required(),
            databaseType: Joi.string()
                .trim()
                .valid(DatabaseType.POSTGRES_SQL)
                .required(),
            executionEnvironment: Joi.string()
                .trim()
                .valid(ExecutionEnvironment.NODE_JS)
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