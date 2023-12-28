import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {DeployModelController} from "../../../src/controller/DeployModelController";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";
import {
    CreateDeployModelDtoInput, CreateDeployModelDtoOutput,
    CreateDeployModelUseCase,
    DatabaseType,
    DeployModelType,
    ExecutionEnvironment
} from "../../../src/use-case/CreateDeployModelUseCase";
import * as crypto from "crypto";
import {randomUUID} from "crypto";

describe("DeployModelController", () => {
    const createDeployModelUseCase = mockDeep<CreateDeployModelUseCase>()
    const deployModelController = new DeployModelController(
        createDeployModelUseCase,
    )
    const ownerEmail = faker.internet.email()

    describe("createDeployModel", () => {
        const deployModelName = faker.internet.domainName()
        const createDeployModelDtoInput = new CreateDeployModelDtoInput(
            deployModelName,
            DeployModelType.TWO_TIERS,
            DatabaseType.POSTGRES_SQL,
            ExecutionEnvironment.NODE_JS,
            ownerEmail
        )
        const httpRequest = new HttpRequest<CreateDeployModelDtoInput>(createDeployModelDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(createDeployModelUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.createDeployModel(httpRequest)

            expect(createDeployModelUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
                randomUUID().toString(),
                deployModelName,
                DeployModelType.TWO_TIERS,
                DatabaseType.POSTGRES_SQL,
                ExecutionEnvironment.NODE_JS,
                ownerEmail
            )
            jest.spyOn(createDeployModelUseCase, "execute").mockResolvedValue(createDeployModelDtoOutput)

            const httpResponse = await deployModelController.createDeployModel(httpRequest)

            expect(createDeployModelUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created("Deploy model created with success", createDeployModelDtoOutput))
        })
    })
})