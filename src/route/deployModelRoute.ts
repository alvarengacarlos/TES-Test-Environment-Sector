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
    UploadSourceCodeDtoInput,
    UploadSourceCodeUseCase
} from "../use-case/UploadSourceCodeUseCase";
import {uploadSourceCodeValidator} from "../middleware/uploadFile";
import {s3Client} from "../infra/s3Client";
import {SaveAwsCredentialsDtoInput, SaveAwsCredentialsUseCase} from "../use-case/SaveAwsCredentialsUseCase";
import {secretsManagerClient} from "../infra/secretsManagerClient";
import {CreateDeployModelInfraDtoInput, CreateDeployModelInfraUseCase} from "../use-case/CreateDeployModelInfraUseCase";
import {
    CheckDeployModelInfraStatusDtoInput,
    CheckDeployModelInfraStatusUseCase
} from "../use-case/CheckDeployModelInfraStatusUseCase";
import {DeleteDeployModelInfraDtoInput, DeleteDeployModelInfraUseCase} from "../use-case/DeleteDeployModelInfraUseCase";

const deployModelRepository = new DeployModelRepositoryImpl(prismaClient, s3Client, secretsManagerClient)
const createDeployModelUseCase = new CreateDeployModelUseCase(deployModelRepository)
const uploadSourceCodeUseCase = new UploadSourceCodeUseCase(deployModelRepository)
const saveAwsCredentialsUseCase = new SaveAwsCredentialsUseCase(deployModelRepository)
const deployModelInfraUseCase = new CreateDeployModelInfraUseCase(deployModelRepository)
const checkDeployModelInfraStatusUseCase = new CheckDeployModelInfraStatusUseCase(deployModelRepository)
const deleteDeployModelInfraUseCase = new DeleteDeployModelInfraUseCase(deployModelRepository)
const deployModelController = new DeployModelController(
    createDeployModelUseCase,
    uploadSourceCodeUseCase,
    saveAwsCredentialsUseCase,
    deployModelInfraUseCase,
    checkDeployModelInfraStatusUseCase,
    deleteDeployModelInfraUseCase
)
const deployModelValidator = new DeployModelValidator()

export const deployModelRouter = express.Router()

deployModelRouter.post("/deploy-model", setTokenInformations, deployModelValidator.createDeployModelValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<CreateDeployModelDtoInput>({
            deployModelName: request.body.deployModelName,
            ownerEmail: String(request.headers.requesterEmail)
        })

        const httpResponse = await deployModelController.createDeployModel(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)
    } catch (error: any) {
        next(error)
    }
})

deployModelRouter.post("/upload-source-code", uploadSourceCodeValidator, deployModelValidator.uploadSourceCodeValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<UploadSourceCodeDtoInput>({
            deployModelId: request.body.deployModelId,
            bufferedSourceCodeFile: request.file?.buffer || Buffer.from("")
        })

        const httpResponse = await deployModelController.uploadSourceCode(httpRequest)
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

deployModelRouter.post("/infra", deployModelValidator.createDeployModelInfraValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<CreateDeployModelInfraDtoInput>({
            deployModelId: request.body.deployModelId,
        })
        const httpResponse = await deployModelController.createDeployModelInfra(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})


deployModelRouter.get("/infra/deploy-model/:deployModelId", deployModelValidator.checkDeployModelInfraStatusValidator, async (request: Request, response: Response, next: NextFunction)=> {
    try {
        const httpRequest = new HttpRequest<CheckDeployModelInfraStatusDtoInput>({
            deployModelId: request.params.deployModelId,
        })
        const httpResponse = await deployModelController.checkDeployModelInfraStatus(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

deployModelRouter.delete("/infra/deploy-model/:deployModelId", deployModelValidator.deleteDeployModelInfraValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<DeleteDeployModelInfraDtoInput>({
            deployModelId: request.params.deployModelId,
        })
        const httpResponse = await deployModelController.deleteDeployModelInfra(httpRequest)
        response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})