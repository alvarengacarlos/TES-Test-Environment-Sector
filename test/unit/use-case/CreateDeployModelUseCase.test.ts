import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase, DatabaseType,
    DeployModelType, ExecutionEnvironment
} from "../../../src/use-case/CreateDeployModelUseCase";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {randomUUID} from "crypto";

describe("ConfirmSignUpUseCase", () => {
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
    const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
        randomUUID().toString(),
        deployModelName,
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail
    )

    describe("execute", () => {
        test("should create a deploy model", async () => {
            jest.spyOn(deployModelRepository, "saveDeployModel").mockReturnValue(Promise.resolve(createDeployModelDtoOutput))

            const output = await createDeployModelUseCase.execute(createDeployModelDtoInput)

            expect(deployModelRepository.saveDeployModel).toBeCalledWith(createDeployModelDtoInput)
            expect(output).toEqual(createDeployModelDtoOutput)
        })
    })
})