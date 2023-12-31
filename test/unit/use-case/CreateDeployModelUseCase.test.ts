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
import {randomUUID} from "crypto";

describe("CreateDeployModelUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const createDeployModelUseCase = new CreateDeployModelUseCase(deployModelRepository)


    const deployModelName = faker.internet.domainName()
    const ownerEmail = faker.internet.email()
    const createDeployModelDtoInput = new CreateDeployModelDtoInput(
        deployModelName,
        ownerEmail
    )

    const deployModelEntity = new DeployModelEntity(
        randomUUID().toString(),
        deployModelName,
        ownerEmail,
        "",
        "",
    )

    const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
        deployModelEntity.id,
        deployModelEntity.deployModelName,
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