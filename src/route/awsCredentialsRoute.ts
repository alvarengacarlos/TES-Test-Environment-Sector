import express, {NextFunction, Request, Response} from "express";
import {AwsCredentialsValidator} from "../middleware/AwsCredentialsValidator";
import {HttpRequest} from "../util/HttpRequest";
import {
    AwsCredentialsExistsDtoInput,
    AwsCredentialsService, DeleteAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoInput,
    UpdateAwsCredentialsDtoInput
} from "../service/AwsCredentialsService";
import {AwsCredentialsController} from "../controller/AwsCredentialsController";
import {AwsCredentialsRepositoryImpl} from "../repository/AwsCredentialsRepositoryImpl";
import {secretsManagerClient} from "../infra/secretsManagerClient";
import {setTokenInformations} from "../middleware/setTokenInformations";


const awsCredentialsValidator = new AwsCredentialsValidator()
const awsCredentialsRepository = new AwsCredentialsRepositoryImpl(secretsManagerClient)
const awsCredentialsService = new AwsCredentialsService(awsCredentialsRepository)
const awsCredentialsController = new AwsCredentialsController(awsCredentialsService)

export const awsCredentialsRouter = express.Router()

awsCredentialsRouter.post("/aws-credentials", setTokenInformations, awsCredentialsValidator.saveAwsCredentialsValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<SaveAwsCredentialsDtoInput>({
            ownerEmail: String(request.headers.requesterEmail),
            accessKeyId: request.body.accessKeyId,
            secretAccessKey: request.body.secretAccessKey
        })
        const httpResponse = await awsCredentialsController.saveAwsCredentials(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

awsCredentialsRouter.get("/aws-credentials/exists", setTokenInformations, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<AwsCredentialsExistsDtoInput>({
            ownerEmail: String(request.headers.requesterEmail),
        })
        const httpResponse = await awsCredentialsController.awsCredentialsExists(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

awsCredentialsRouter.put("/aws-credentials", setTokenInformations, awsCredentialsValidator.updateAwsCredentialsValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<UpdateAwsCredentialsDtoInput>({
            ownerEmail: String(request.headers.requesterEmail),
            accessKeyId: request.body.accessKeyId,
            secretAccessKey: request.body.secretAccessKey
        })
        const httpResponse = await awsCredentialsController.updateAwsCredentials(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

awsCredentialsRouter.delete("/aws-credentials", setTokenInformations, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<DeleteAwsCredentialsDtoInput>({
            ownerEmail: String(request.headers.requesterEmail),
        })
        const httpResponse = await awsCredentialsController.deleteAwsCredentials(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})
