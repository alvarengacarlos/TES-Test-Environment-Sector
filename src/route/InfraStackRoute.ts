import express, {NextFunction, Request, Response} from "express";

import {setTokenInformations} from "../middleware/setTokenInformations";
import {HttpRequest} from "../util/HttpRequest";
import {InfraStackValidator} from "../middleware/InfraStackValidator";
import {InfraStackRepositoryImpl} from "../repository/InfraStackRepositoryImpl";
import {
    CreateInfraStackDtoInput,
    DeleteInfraStackDtoInput,
    FindInfraStacksDtoInput,
    InfraStackService
} from "../service/InfraStackService";
import {InfraStackController} from "../controller/InfraStackController";
import {AwsCredentialsService} from "../service/AwsCredentialsService";
import {AwsCredentialsRepositoryImpl} from "../repository/AwsCredentialsRepositoryImpl";
import {secretsManagerClient} from "../infra/secretsManagerClient";
import {TemplateRepositoryImpl} from "../repository/TemplateRepositoryImpl";
import {s3Client} from "../infra/s3Client";
import {TemplateService} from "../service/TemplateService";

const infraStackValidator = new InfraStackValidator()
const awsCredentialsRepository = new AwsCredentialsRepositoryImpl(secretsManagerClient)
const awsCredentialsService = new AwsCredentialsService(awsCredentialsRepository)
const templateRepository = new TemplateRepositoryImpl(s3Client)
const templateService = new TemplateService(templateRepository)

const infraStackRepository = new InfraStackRepositoryImpl()
const infraStackService = new InfraStackService(infraStackRepository, awsCredentialsService, templateService)
const infraStackController = new InfraStackController(infraStackService)

export const infraStackRouter = express.Router()

infraStackRouter.post("/infra-stacks", setTokenInformations, infraStackValidator.createInfraStackValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<CreateInfraStackDtoInput>({
            appName: request.body.appName,
            ownerEmail: String(request.headers.requesterEmail),
            templateType: request.body.templateType,
            sourceCodePath: request.body.sourceCodePath
        })
        const httpResponse = await infraStackController.createInfraStack(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

infraStackRouter.get("/infra-stacks", setTokenInformations, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<FindInfraStacksDtoInput>({
            ownerEmail: String(request.headers.requesterEmail),
        })
        const httpResponse = await infraStackController.findInfraStacks(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})

infraStackRouter.delete("/infra-stacks/:stackName", setTokenInformations, infraStackValidator.deleteInfraStackNameValidator, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const httpRequest = new HttpRequest<DeleteInfraStackDtoInput>({
            stackName: request.params.stackName,
            ownerEmail: String(request.headers.requesterEmail)
        })
        const httpResponse = await infraStackController.deleteInfraStack(httpRequest)
        return response.status(httpResponse.httpStatusCode).json(httpResponse.body)

    } catch (error: any) {
        next(error)
    }
})