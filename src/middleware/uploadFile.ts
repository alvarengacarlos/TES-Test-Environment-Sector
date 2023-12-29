import multer from "multer";
import {NextFunction, Request, Response} from "express";
import {ApiStatusCode, HttpResponse} from "../util/HttpResponse";

const storage = multer.memoryStorage()
const twoHundredInBytes = 200_000_000

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: twoHundredInBytes,
        files: 1
    }
})


export function uploadSourceCodeValidator(request: Request, response: Response, next: NextFunction) {
    const uploadErrorHandler = uploadFile.single("sourceCodeFile")
    uploadErrorHandler(request, response, function error (error) {
        if (request.file?.mimetype !== "application/zip") {
            const httpResponse = HttpResponse.badRequest(ApiStatusCode.INVALID_INPUT, "The field sourceCodeFile must be a zip file", null)
            return response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        }

        if (!request.file?.buffer) {
            const httpResponse = HttpResponse.badRequest(ApiStatusCode.INVALID_INPUT, "Impossible convert file to buffer", null)
            return response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        }

        if (error instanceof multer.MulterError) {
            const httpResponse = HttpResponse.badRequest(ApiStatusCode.INVALID_INPUT, error.message, null)
            response.status(httpResponse.httpStatusCode).json(httpResponse.body)

        } else if (error) {
            next(error)

        } else {
            next()
        }
    })
}