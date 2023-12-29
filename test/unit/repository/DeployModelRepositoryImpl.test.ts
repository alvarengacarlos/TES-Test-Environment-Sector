import {describe, expect, jest, test} from "@jest/globals"
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {prismaClient} from "../../../src/infra/primaClient"
import {DeployModelRepositoryImpl} from "../../../src/repository/DeployModelRepositoryImpl";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {CodeType} from "../../../src/util/CodeType";
import {s3Client} from "../../../src/infra/s3Client";
import {S3Exception} from "../../../src/exception/S3Exception";


describe("DeployModelRepositoryImpl", () => {
    const deployModelRepository = new DeployModelRepositoryImpl(prismaClient, s3Client)
    jest.spyOn(prismaClient, "$connect").mockResolvedValue()
    jest.spyOn(prismaClient, "$disconnect").mockResolvedValue()

    const ownerEmail = faker.internet.email()

    const deployModelEntity = new DeployModelEntity(
        randomUUID(),
        faker.internet.domainName(),
        DeployModelType.TWO_TIERS,
        DatabaseType.POSTGRES_SQL,
        ExecutionEnvironment.NODE_JS,
        ownerEmail,
        "",
        "",
        "",
        ""
    )

    describe("saveDeployModel", () => {
        const saveDeployModelInput = {
            deployModelName: faker.internet.domainName(),
            deployModelType: DeployModelType.TWO_TIERS,
            databaseType: DatabaseType.POSTGRES_SQL,
            executionEnvironment: ExecutionEnvironment.NODE_JS,
            ownerEmail: ownerEmail
        }

        test("should save a deploy model", async () => {
            jest.spyOn(prismaClient.deployModel, "create").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveDeployModel(saveDeployModelInput)

            expect(prismaClient.deployModel.create).toBeCalledWith({data: saveDeployModelInput})
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("findDeployModelById", () => {
        const findDeployModelByIdInput = {
            deployModelId: randomUUID().toString()
        }

        test("should find a deploy model", async () => {
            jest.spyOn(prismaClient.deployModel, "findUnique").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.findDeployModelById(findDeployModelByIdInput)

            expect(prismaClient.deployModel.findUnique).toBeCalledWith({
                where: {id: findDeployModelByIdInput.deployModelId}
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("saveFrontendSourceCode", () => {
        const saveFrontendSourceCodeInput = {
            ownerEmail: faker.internet.email(),
            deployModelId: randomUUID().toString(),
            codeType: CodeType.FRONTEND,
            bufferedSourceCodeFile: Buffer.from("")
        }

        test("should throw S3Exception", async () => {
            s3Client.send = async function () {
                throw new Error()
            }

            await expect(deployModelRepository.saveFrontendSourceCode(saveFrontendSourceCodeInput)).rejects.toThrow(S3Exception)
        })

        test("should save a frontend source code", async () => {
            s3Client.send = async function () {}
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveFrontendSourceCode(saveFrontendSourceCodeInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveFrontendSourceCodeInput.deployModelId},
                data: {
                    frontendSourceCodePath: `sourceCode/${saveFrontendSourceCodeInput.ownerEmail}-${saveFrontendSourceCodeInput.deployModelId}-${saveFrontendSourceCodeInput.codeType}-sourceCode.zip`
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("saveBackendSourceCode", () => {
        const saveBackendSourceCodeInput = {
            ownerEmail: faker.internet.email(),
            deployModelId: randomUUID().toString(),
            codeType: CodeType.BACKEND,
            bufferedSourceCodeFile: Buffer.from("")
        }

        test("should throw S3Exception", async () => {
            s3Client.send = async function () {
                throw new Error()
            }

            await expect(deployModelRepository.saveBackendSourceCode(saveBackendSourceCodeInput)).rejects.toThrow(S3Exception)
        })

        test("should save a backend source code", async () => {
            s3Client.send = async function () {}
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveBackendSourceCode(saveBackendSourceCodeInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveBackendSourceCodeInput.deployModelId},
                data: {
                    backendSourceCodePath: `sourceCode/${saveBackendSourceCodeInput.ownerEmail}-${saveBackendSourceCodeInput.deployModelId}-${saveBackendSourceCodeInput.codeType}-sourceCode.zip`
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })
})