import { NextFunction, Request, Response } from "express"
import multer from "multer"
import Joi, { ValidationErrorItem } from "joi"

import { ApiStatusCode, HttpResponse } from "../util/HttpResponse"

const storage = multer.memoryStorage()
const twoMegaBytesInBytes = 200_000_000

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: twoMegaBytesInBytes,
        files: 1,
    },
})

export class SourceCodeValidator {
    uploadSourceCodeValidator(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const uploadErrorHandler = uploadFile.single("sourceCodeFile")
        uploadErrorHandler(request, response, function error(error) {
            const schema = Joi.object({
                appName: Joi.string()
                    .trim()
                    .max(10)
                    .lowercase()
                    .replace(" ", "")
                    .required(),
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

            if (!request.file) {
                const httpResponse = HttpResponse.badRequest(
                    ApiStatusCode.INVALID_INPUT,
                    "The field sourceCodeFile is required",
                    null,
                )
                return response
                    .status(httpResponse.httpStatusCode)
                    .json(httpResponse.body)
            }

            if (request.file.mimetype !== "application/zip") {
                const httpResponse = HttpResponse.badRequest(
                    ApiStatusCode.INVALID_INPUT,
                    "The field sourceCodeFile must be a zip file",
                    null,
                )
                return response
                    .status(httpResponse.httpStatusCode)
                    .json(httpResponse.body)
            }

            if (!request.file.buffer) {
                const httpResponse = HttpResponse.badRequest(
                    ApiStatusCode.INVALID_INPUT,
                    "Impossible convert file to buffer",
                    null,
                )
                return response
                    .status(httpResponse.httpStatusCode)
                    .json(httpResponse.body)
            }

            if (error instanceof multer.MulterError) {
                const httpResponse = HttpResponse.badRequest(
                    ApiStatusCode.INVALID_INPUT,
                    error.message,
                    null,
                )
                response
                    .status(httpResponse.httpStatusCode)
                    .json(httpResponse.body)
            } else if (error) {
                next(error)
            } else {
                next()
            }
        })
    }

    deleteSourceCodeValidator(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const schema = Joi.object({
            sourceCodePath: Joi.string().trim().required(),
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
