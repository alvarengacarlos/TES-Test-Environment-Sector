import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {randomUUID} from "crypto";
import {faker} from "@faker-js/faker";

import {
    UploadBackendSourceCodeDtoInput, UploadBackendSourceCodeDtoOutput,
    UploadBackendSourceCodeUseCase
} from "../../../src/use-case/UploadBackendSourceCodeUseCase";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";
import {CodeType} from "../../../src/util/CodeType";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";

describe("UploadBackendSourceCodeUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const uploadBackendSourceCodeUseCase = new UploadBackendSourceCodeUseCase(deployModelRepository)

    const uploadBackendSourceCodeDtoInput = new UploadBackendSourceCodeDtoInput(
        randomUUID().toString(),
        Buffer.from("")
    )

    const ownerEmail = faker.internet.email()
    const deployModelEntity = new DeployModelEntity(
        uploadBackendSourceCodeDtoInput.deployModelId,
        faker.internet.domainName(),
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail,
        "",
        `/${ownerEmail}/${uploadBackendSourceCodeDtoInput.deployModelId}/${CodeType.BACKEND}/${uploadBackendSourceCodeDtoInput.deployModelId}`,
        ""
    )

    const uploadBackendSourceCodeDtoOutput = new UploadBackendSourceCodeDtoOutput(
        deployModelEntity.id,
        deployModelEntity.backendSourceCodePath
    )

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(uploadBackendSourceCodeUseCase.execute(uploadBackendSourceCodeDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadBackendSourceCodeDtoInput.deployModelId
            })
        })

        test("should upload backend source code", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "saveBackendSourceCode").mockResolvedValue(deployModelEntity)

            const output = await uploadBackendSourceCodeUseCase.execute(uploadBackendSourceCodeDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadBackendSourceCodeDtoInput.deployModelId
            })
            expect(deployModelRepository.saveBackendSourceCode).toBeCalledWith({
                ownerEmail: deployModelEntity.ownerEmail,
                deployModelId: deployModelEntity.id,
                codeType: CodeType.BACKEND,
                bufferedSourceCodeFile: uploadBackendSourceCodeDtoInput.bufferedSourceCodeFile
            })
            expect(output).toEqual(uploadBackendSourceCodeDtoOutput)
        })
    })
})