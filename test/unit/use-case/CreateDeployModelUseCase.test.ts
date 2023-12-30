import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase
} from "../../../src/use-case/CreateDeployModelUseCase";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";
import {randomUUID} from "crypto";

describe("CreateDeployModelUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const createDeployModelUseCase = new CreateDeployModelUseCase(deployModelRepository)


    const deployModelName = faker.internet.domainName()
    const ownerEmail = faker.internet.email()
    const createDeployModelDtoInput = new CreateDeployModelDtoInput(
        deployModelName,
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail
    )

    const deployModelEntity = new DeployModelEntity(
        randomUUID().toString(),
        deployModelName,
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail,
        "",
        "",
        ""
    )

    const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
        deployModelEntity.id,
        deployModelEntity.deployModelName,
        deployModelEntity.deployModelType,
        deployModelEntity.databaseType,
        deployModelEntity.executionEnvironment,
        deployModelEntity.ownerEmail
    )


    describe("execute", () => {
        test("should create a deploy model", async () => {
            jest.spyOn(deployModelRepository, "saveDeployModel").mockResolvedValue(deployModelEntity)

            const output = await createDeployModelUseCase.execute(createDeployModelDtoInput)

            expect(deployModelRepository.saveDeployModel).toBeCalledWith(createDeployModelDtoInput)
            expect(output).toEqual(createDeployModelDtoOutput)
        })
    })
})