import express, {NextFunction, Request, Response} from "express"

import {HttpRequest} from "../util/HttpRequest";
import {DeployModelRepositoryImpl} from "../repository/DeployModelRepositoryImpl";
import {DeployModelValidator} from "../middleware/DeployModelValidator";
import {DeployModelController} from "../controller/DeployModelController";
import {
    CreateDeployModelDtoInput,
    CreateDeployModelUseCase
} from "../use-case/CreateDeployModelUseCase";
import {prismaClient} from "../infra/primaClient";
import {setTokenInformations} from "../middleware/setTokenInformations";
import {
    UploadFrontendSourceCodeDtoInput,
    UploadFrontendSourceCodeUseCase
} from "../use-case/UploadFrontendSourceCodeUseCase";
import {
    UploadBackendSourceCodeDtoInput,
    UploadBackendSourceCodeUseCase
} from "../use-case/UploadBackendSourceCodeUseCase";
import {uploadSourceCodeValidator} from "../middleware/uploadFile";
import {s3Client} from "../infra/s3Client";
import {SaveAwsCredentialsDtoInput, SaveAwsCredentialsUseCase} from "../use-case/SaveAwsCredentialsUseCase";
import {secretsManagerClient} from "../infra/secretsManagerClient";

const deployModelRepository = new DeployModelRepositoryImpl(prismaClient, s3Client, secretsManagerClient)
const createDeployModelUseCase = new CreateDeployModelUseCase(deployModelRepository)
const uploadFrontendSourceCodeUseCase = new UploadFrontendSourceCodeUseCase(deployModelRepository)
const uploadBackendSourceCodeUseCase = new UploadBackendSourceCodeUseCase(deployModelRepository)
const saveAwsCredentialsUseCase = new SaveAwsCredentialsUseCase(deployModelRepository)
const deployModelController = new DeployModelController(createDeployModelUseCase, uploadFrontendSourceCodeUseCase, uploadBackendSourceCodeUseCase, saveAwsCredentialsUseCase)
const deployModelValidator = new DeployModelValidator()

export const deployModelRouter = express.Router()

deployModelRouter.post("/deploy-model", setTokenInformations, deployModelValidator.createDeployModelValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<CreateDeployModelDtoInput>({
            deployModelName: request.body.deployModelName,
            deployModelType: request.body.deployModelType,
            databaseType: request.body.databaseType,
            executionEnvironment: request.body.executionEnvironment,
            ownerEmail: String(request.headers.requesterEmail)
        })

        const httpResponse = await deployModelController.createDeployModel(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

deployModelRouter.post("/upload-frontend-source-code", uploadSourceCodeValidator, deployModelValidator.uploadFrontendSourceCodeValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<UploadFrontendSourceCodeDtoInput>({
            deployModelId: request.body.deployModelId,
            bufferedSourceCodeFile: request.file?.buffer || Buffer.from("")
        })

        const httpResponse = await deployModelController.uploadFrontendSourceCode(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

deployModelRouter.post("/upload-backend-source-code", uploadSourceCodeValidator, deployModelValidator.uploadBackendSourceCodeValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<UploadBackendSourceCodeDtoInput>({
            deployModelId: request.body.deployModelId,
            bufferedSourceCodeFile: request.file?.buffer || Buffer.from("")
        })

        const httpResponse = await deployModelController.uploadBackendSourceCode(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

deployModelRouter.post("/aws-credentials", deployModelValidator.saveAwsCredentialsValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<SaveAwsCredentialsDtoInput>({
            deployModelId: request.body.deployModelId,
            accessKeyId: request.body.accessKeyId,
            secretAccessKey: request.body.secretAccessKey
        })
        const httpResponse = await deployModelController.saveAwsCredentials(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})
