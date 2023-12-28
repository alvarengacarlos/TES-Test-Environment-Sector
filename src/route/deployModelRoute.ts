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

const deployModelRepository = new DeployModelRepositoryImpl(prismaClient)
const createDeployModelUseCase = new CreateDeployModelUseCase(deployModelRepository)
const deployModelController = new DeployModelController(createDeployModelUseCase)
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
