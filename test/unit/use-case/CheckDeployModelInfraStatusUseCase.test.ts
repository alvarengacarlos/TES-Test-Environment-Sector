import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {
    CheckDeployModelInfraStatusDtoInput, CheckDeployModelInfraStatusDtoOutput,
    CheckDeployModelInfraStatusUseCase
} from "../../../src/use-case/CheckDeployModelInfraStatusUseCase";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {InfrastructureNotProvisionedException} from "../../../src/exception/InfrastructureNotProvisionedException";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelInfraEntity} from "../../../src/entity/DeployModelInfraEntity";

describe("CheckDeployModelInfraStatusUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const checkDeployModelInfraStatusUseCase = new CheckDeployModelInfraStatusUseCase(deployModelRepository)

    const deployModelId = randomUUID().toString()
    const checkDeployModelInfraStatusDtoInput = new CheckDeployModelInfraStatusDtoInput(deployModelId)

    const deployModelName = faker.internet.domainName()
    const ownerEmail = faker.internet.email()
    const cloudFormationStackName = `container-model-${deployModelId}`
    const deployModelEntity = new DeployModelEntity(
        deployModelId,
        deployModelName,
        ownerEmail,
        "",
        "",
        cloudFormationStackName
    )

    const deployModelInfraEntity = new DeployModelInfraEntity(
        randomUUID().toString(),
        cloudFormationStackName,
        "CREATE_SUCCESS"
    )

    const checkDeployModelInfraStatusDtoOutput = new CheckDeployModelInfraStatusDtoOutput(
        deployModelInfraEntity.status
    )

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(checkDeployModelInfraStatusUseCase.execute(checkDeployModelInfraStatusDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)
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
                "",
                ""
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)

            await expect(checkDeployModelInfraStatusUseCase.execute(checkDeployModelInfraStatusDtoInput)).rejects.toThrow(InfrastructureNotProvisionedException)
            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
        })

        test("should throw InfrastructureNotProvisionedException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "findDeployModelInfraStatus").mockResolvedValue(deployModelInfraEntity)

            const output = await checkDeployModelInfraStatusUseCase.execute(checkDeployModelInfraStatusDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: deployModelId
            })
            expect(deployModelRepository.findDeployModelInfraStatus).toBeCalledWith({
                cloudFormationStackName: deployModelInfraEntity.cloudFormationStackName,
                awsCredentialsPath: deployModelEntity.awsCredentialsPath
            })
            expect(output).toEqual(checkDeployModelInfraStatusDtoOutput)
        })
    })
})