import express, { NextFunction, Request, Response } from "express"

import { HttpRequest } from "../util/HttpRequest"
import {
    DeleteSourceCodeDtoInput,
    FindSourceCodesDtoInput,
    SourceCodeService,
    UploadSourceCodeDtoInput,
} from "../service/SourceCodeService"
import { setTokenInformations } from "../middleware/setTokenInformations"
import { SourceCodeController } from "../controller/SourceCodeController"
import { SourceCodeRepositoryImpl } from "../repository/SourceCodeRepositoryImpl"
import { AwsCredentialsRepositoryImpl } from "../repository/AwsCredentialsRepositoryImpl"
import { secretsManagerClient } from "../infra/secretsManagerClient"
import { AwsCredentialsService } from "../service/AwsCredentialsService"
import { SourceCodeValidator } from "../middleware/SourceCodeValidator"

const sourceCodeValidator = new SourceCodeValidator()
const awsCredentialsRepository = new AwsCredentialsRepositoryImpl(
    secretsManagerClient,
)
const awsCredentialsService = new AwsCredentialsService(
    awsCredentialsRepository,
)
const sourceCodeRepository = new SourceCodeRepositoryImpl()
const sourceCodeService = new SourceCodeService(
    sourceCodeRepository,
    awsCredentialsService,
)
const sourceCodeController = new SourceCodeController(sourceCodeService)

export const sourceCodeRoute = express.Router()

sourceCodeRoute.post(
    "/source-codes",
    setTokenInformations,
    sourceCodeValidator.uploadSourceCodeValidator,
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const httpRequest = new HttpRequest<UploadSourceCodeDtoInput>({
                appName: request.body.appName,
                ownerEmail: String(request.headers.requesterEmail),
                bufferedSourceCode: request.file?.buffer || Buffer.from(""),
            })

            const httpResponse =
                await sourceCodeController.uploadSourceCode(httpRequest)
            response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        } catch (error: any) {
            next(error)
        }
    },
)

sourceCodeRoute.get(
    "/source-codes",
    setTokenInformations,
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const httpRequest = new HttpRequest<FindSourceCodesDtoInput>({
                ownerEmail: String(request.headers.requesterEmail),
            })

            const httpResponse =
                await sourceCodeController.findSourceCodes(httpRequest)
            response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        } catch (error: any) {
            next(error)
        }
    },
)

sourceCodeRoute.delete(
    "/source-codes/:sourceCodePath",
    setTokenInformations,
    sourceCodeValidator.deleteSourceCodeValidator,
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const httpRequest = new HttpRequest<DeleteSourceCodeDtoInput>({
                ownerEmail: String(request.headers.requesterEmail),
                sourceCodePath: request.params.sourceCodePath,
            })

            const httpResponse =
                await sourceCodeController.deleteSourceCode(httpRequest)
            response.status(httpResponse.httpStatusCode).json(httpResponse.body)
        } catch (error: any) {
            next(error)
        }
    },
)
