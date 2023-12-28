import {describe, expect, jest, test} from "@jest/globals"
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {prismaClient} from "../../../src/infra/primaClient"
import {DeployModelRepositoryImpl} from "../../../src/repository/DeployModelRepositoryImpl";
import {
    CreateDeployModelDtoInput, CreateDeployModelDtoOutput,
    DatabaseType, DeployModelType,
    ExecutionEnvironment
} from "../../../src/use-case/CreateDeployModelUseCase";

describe("DeployModelRepositoryImpl", () => {
    const deployModelRepository = new DeployModelRepositoryImpl(prismaClient)
    jest.spyOn(prismaClient, "$connect").mockResolvedValue()
    jest.spyOn(prismaClient, "$disconnect").mockResolvedValue()

    const ownerEmail = faker.internet.email()

    describe("saveDeployModel", () => {
        const createDeployModelDtoInput = new CreateDeployModelDtoInput(
            faker.internet.domainName(),
            DeployModelType.TWO_TIERS,
            DatabaseType.POSTGRES_SQL,
            ExecutionEnvironment.NODE_JS,
            ownerEmail
        )

        test("should save a deploy model", async () => {
            const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
                randomUUID().toString(),
                createDeployModelDtoInput.deployModelName,
                createDeployModelDtoInput.deployModelType,
                createDeployModelDtoInput.databaseType,
                createDeployModelDtoInput.executionEnvironment,
                createDeployModelDtoInput.ownerEmail
            )
            jest.spyOn(prismaClient.deployModel, "create").mockResolvedValue(createDeployModelDtoOutput)

            const output = await deployModelRepository.saveDeployModel(createDeployModelDtoInput)

            expect(prismaClient.deployModel.create).toBeCalledWith({data: createDeployModelDtoInput})
            expect(output).toEqual(createDeployModelDtoOutput)
        })
    })
})