import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker";

import {
    DeleteDeployModelInfraDtoInput, DeleteDeployModelInfraDtoOutput,
    DeleteDeployModelInfraUseCase
} from "../../../src/use-case/DeleteDeployModelInfraUseCase";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {randomUUID} from "crypto";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {InfrastructureNotProvisionedException} from "../../../src/exception/InfrastructureNotProvisionedException";

describe("DeleteDeployModelInfraUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const deleteDeployModelInfraUseCase = new DeleteDeployModelInfraUseCase(deployModelRepository)

    const deployModelId = randomUUID().toString()
    const deleteDeployModelInfraDtoInput = new DeleteDeployModelInfraDtoInput(deployModelId)

    const deployModelName = faker.internet.domainName()
    const ownerEmail = faker.internet.email()
    const awsCredentialsPath = `${ownerEmail}-${deployModelId}-awsCredentials`
    const deployModelEntity = new DeployModelEntity(
        deployModelId,
        deployModelName,
        ownerEmail,
        "",
        awsCredentialsPath,
        `container-model-${deployModelId}`
    )

    const deleteDeployModelInfraDtoOutput = new DeleteDeployModelInfraDtoOutput(deployModelId)

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(deleteDeployModelInfraUseCase.execute(deleteDeployModelInfraDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)
            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
        })

        test("should throw InfrastructureNotProvisionedException", async () => {
            const deployModelEntity = new DeployModelEntity(
                deployModelId,
                deployModelName,
                ownerEmail,
                "",
                awsCredentialsPath,
                ""
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)

            await expect(deleteDeployModelInfraUseCase.execute(deleteDeployModelInfraDtoInput)).rejects.toThrow(InfrastructureNotProvisionedException)
            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
        })

        test("should delete deploy model infra", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "deleteDeployModelInfra").mockResolvedValue(deployModelEntity)

            const output = await deleteDeployModelInfraUseCase.execute(deleteDeployModelInfraDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
            expect(deployModelRepository.deleteDeployModelInfra).toBeCalledWith({
                deployModelId: deployModelId,
                awsCredentialsPath: awsCredentialsPath
            })
            expect(output).toEqual(deleteDeployModelInfraDtoOutput)
        })
    })
})