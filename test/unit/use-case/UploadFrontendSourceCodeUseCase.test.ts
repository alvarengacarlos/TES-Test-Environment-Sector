import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {DeployModelRepository} from "../../../src/repository/DeployModelRepository";
import {randomUUID} from "crypto";
import {faker} from "@faker-js/faker";

import {
    UploadFrontendSourceCodeDtoInput, UploadFrontendSourceCodeDtoOutput,
    UploadFrontendSourceCodeUseCase
} from "../../../src/use-case/UploadFrontendSourceCodeUseCase";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";
import {CodeType} from "../../../src/util/CodeType";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {
    TwoTiersApplicationDoesNotHaveFrontendException
} from "../../../src/exception/TwoTiersApplicationDoesNotHaveFrontendException";

describe("UploadFrontendSourceCodeUseCase", () => {
    const deployModelRepository = mockDeep<DeployModelRepository>()
    const uploadFrontendSourceCodeUseCase = new UploadFrontendSourceCodeUseCase(deployModelRepository)

    const uploadFrontendSourceCodeDtoInput = new UploadFrontendSourceCodeDtoInput(
        randomUUID().toString(),
        Buffer.from("")
    )

    const ownerEmail = faker.internet.email()
    const deployModelEntity = new DeployModelEntity(
        uploadFrontendSourceCodeDtoInput.deployModelId,
        faker.internet.domainName(),
        DeployModelType.THREE_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail,
        `/${ownerEmail}/${uploadFrontendSourceCodeDtoInput.deployModelId}/${CodeType.FRONTEND}/${uploadFrontendSourceCodeDtoInput.deployModelId}`,
        "",
        ""
    )

    const uploadFrontendSourceCodeDtoOutput = new UploadFrontendSourceCodeDtoOutput(
        deployModelEntity.id,
        deployModelEntity.frontendSourceCodePath
    )

    describe("execute", () => {
        test("should throw DeployModelDoesNotExistException", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(null)

            await expect(uploadFrontendSourceCodeUseCase.execute(uploadFrontendSourceCodeDtoInput)).rejects.toThrow(DeployModelDoesNotExistException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadFrontendSourceCodeDtoInput.deployModelId
            })
        })

        test("should throw TwoTiersApplicationDoesNotHaveFrontendException", async () => {
            const deployModelEntity = new DeployModelEntity(
                uploadFrontendSourceCodeDtoInput.deployModelId,
                faker.internet.domainName(),
                DeployModelType.TWO_TIERS,
                DatabaseType.POSTGRES_SQL,
                ExecutionEnvironment.NODE_JS,
                ownerEmail,
                "",
                "",
                ""
            )
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)

            await expect(uploadFrontendSourceCodeUseCase.execute(uploadFrontendSourceCodeDtoInput)).rejects.toThrow(TwoTiersApplicationDoesNotHaveFrontendException)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadFrontendSourceCodeDtoInput.deployModelId
            })
        })

        test("should upload frontend source code", async () => {
            jest.spyOn(deployModelRepository, "findDeployModelById").mockResolvedValue(deployModelEntity)
            jest.spyOn(deployModelRepository, "saveFrontendSourceCode").mockResolvedValue(deployModelEntity)

            const output = await uploadFrontendSourceCodeUseCase.execute(uploadFrontendSourceCodeDtoInput)

            expect(deployModelRepository.findDeployModelById).toBeCalledWith({
                deployModelId: uploadFrontendSourceCodeDtoInput.deployModelId
            })
            expect(deployModelRepository.saveFrontendSourceCode).toBeCalledWith({
                ownerEmail: deployModelEntity.ownerEmail,
                deployModelId: deployModelEntity.id,
                codeType: CodeType.FRONTEND,
                bufferedSourceCodeFile: uploadFrontendSourceCodeDtoInput.bufferedSourceCodeFile
            })
            expect(output).toEqual(uploadFrontendSourceCodeDtoOutput)
        })
    })
})