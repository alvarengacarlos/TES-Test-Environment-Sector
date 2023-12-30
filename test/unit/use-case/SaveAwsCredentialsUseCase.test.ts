import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    SaveAwsCredentialsUseCase
} from "../../../src/use-case/SaveAwsCredentialsUseCase";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";

describe("SaveAwsCredentialsUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const saveAwsCredentialsUseCase = new SaveAwsCredentialsUseCase(deployModelRepository)

    const deployModelId = randomUUID().toString()
    const saveAwsCredentialsDtoInput = new SaveAwsCredentialsDtoInput(
        deployModelId,
        "00000000000000000000",
        "0000000000000000000000000000000000000000"
    )

    const ownerEmail = faker.internet.email()
    const deployModelEntity = new DeployModelEntity(
        deployModelId,
        faker.internet.domainName(),
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail,
        "",
        "",
        `${ownerEmail}-${deployModelId}-awsCredentials`,
    )

    const saveAwsCredentialsDtoOutput = new SaveAwsCredentialsDtoOutput(
        deployModelEntity.id,
        deployModelEntity.awsCredentialsPath,
    )

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(saveAwsCredentialsUseCase.execute(saveAwsCredentialsDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: saveAwsCredentialsDtoInput.deployModelId
            })
        })

        test("should save aws credentials", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "saveAwsCredentials").mockResolvedValue(deployModelEntity)

            const output = await saveAwsCredentialsUseCase.execute(saveAwsCredentialsDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: saveAwsCredentialsDtoInput.deployModelId
            })
            expect(deployModelRepository.saveAwsCredentials).toBeCalledWith({
                ownerEmail: deployModelEntity.ownerEmail,
                deployModelId: saveAwsCredentialsDtoInput.deployModelId,
                accessKeyId: saveAwsCredentialsDtoInput.accessKeyId,
                secretAccessKey: saveAwsCredentialsDtoInput.secretAccessKey
            })
            expect(output).toEqual(saveAwsCredentialsDtoOutput)
        })
    })
})