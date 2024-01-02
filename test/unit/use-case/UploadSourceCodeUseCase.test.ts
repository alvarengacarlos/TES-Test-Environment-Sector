import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {randomUUID} from "crypto";
import {faker} from "@faker-js/faker";

import {
    UploadSourceCodeDtoInput, UploadSourceCodeDtoOutput,
    UploadSourceCodeUseCase
} from "../../../src/use-case/UploadSourceCodeUseCase";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {
    AwsCredentialsConfigurationMissingException
} from "../../../src/exception/AwsCredentialsConfigurationMissingException";

describe("UploadSourceCodeUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const uploadSourceCodeUseCase = new UploadSourceCodeUseCase(deployModelRepository)

    const uploadSourceCodeDtoInput = new UploadSourceCodeDtoInput(
        randomUUID().toString(),
        Buffer.from("")
    )

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(uploadSourceCodeUseCase.execute(uploadSourceCodeDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadSourceCodeDtoInput.deployModelId
            })
        })

        test("should throw AwsCredentialsConfigurationMissingException", async () => {
            const deployModelEntity = new DeployModelEntity(
                uploadSourceCodeDtoInput.deployModelId,
                faker.internet.domainName(),
                faker.internet.email(),
                "",
                "",
                ""
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)

            await expect(uploadSourceCodeUseCase.execute(uploadSourceCodeDtoInput)).rejects.toThrow(AwsCredentialsConfigurationMissingException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadSourceCodeDtoInput.deployModelId
            })
        })

        test("should upload source code", async () => {
            const ownerEmail = faker.internet.email()
            const deployModelEntity = new DeployModelEntity(
                uploadSourceCodeDtoInput.deployModelId,
                faker.internet.domainName(),
                ownerEmail,
                "",
                `${ownerEmail}-${uploadSourceCodeDtoInput.deployModelId}-${uploadSourceCodeDtoInput.deployModelId}-awsCredentials`,
                ""
            )
            const uploadSourceCodeDtoOutput = new UploadSourceCodeDtoOutput(
                deployModelEntity.id,
                deployModelEntity.sourceCodePath
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "saveSourceCode").mockResolvedValue(deployModelEntity)

            const output = await uploadSourceCodeUseCase.execute(uploadSourceCodeDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadSourceCodeDtoInput.deployModelId
            })
            expect(deployModelRepository.saveSourceCode).toBeCalledWith({
                ownerEmail: deployModelEntity.ownerEmail,
                deployModelId: deployModelEntity.id,
                bufferedSourceCodeFile: uploadSourceCodeDtoInput.bufferedSourceCodeFile,
                awsCredentialsPath: deployModelEntity.awsCredentialsPath
            })
            expect(output).toEqual(uploadSourceCodeDtoOutput)
        })
    })
})