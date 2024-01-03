import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {
    DeleteDeployModelDtoInput,
    DeleteDeployModelDtoOutput,
    DeleteDeployModelUseCase
} from "../../../src/use-case/DeleteDeployModelUseCase";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {InfrastructureProvisionedException} from "../../../src/exception/InfrastructureProvisionedException";

describe("DeleteDeployModelUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const deleteDeployModelUseCase = new DeleteDeployModelUseCase(deployModelRepository)

    const deployModelId = randomUUID().toString()
    const deleteDeployModelDtoInput = new DeleteDeployModelDtoInput(
        deployModelId
    )

    const deployModelName = faker.internet.domainName()
    const ownerEmail = faker.internet.email()
    const awsCredentialsPath = `${ownerEmail}-${deployModelId}-awsCredentials`
    const sourceCodePath = `${ownerEmail}-${deployModelId}-sourceCode.zip`
    const deployModelEntity = new DeployModelEntity(
        deployModelId,
        deployModelName,
        ownerEmail,
        sourceCodePath,
        awsCredentialsPath,
        ""
    )

    const deleteDeployModelDtoOutput = new DeleteDeployModelDtoOutput(deployModelId)

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(deleteDeployModelUseCase.execute(deleteDeployModelDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)
            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
        })

        test("should throw InfrastructureProvisionedException", async () => {
            const deployModelEntity = new DeployModelEntity(
                deployModelId,
                deployModelName,
                ownerEmail,
                "",
                awsCredentialsPath,
                `container-model-${deployModelId}`
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)

            await expect(deleteDeployModelUseCase.execute(deleteDeployModelDtoInput)).rejects.toThrow(InfrastructureProvisionedException)
            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
        })

        test("should delete deploy model", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "deleteDeployModelById").mockResolvedValue(deployModelEntity)

            const output = await deleteDeployModelUseCase.execute(deleteDeployModelDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
            expect(deployModelRepository.deleteDeployModelById).toBeCalledWith({
                deployModelId: deployModelId,
                awsCredentialsPath: awsCredentialsPath,
                sourceCodePath: sourceCodePath
            })
            expect(output).toEqual(deleteDeployModelDtoOutput)
        })
    })
})