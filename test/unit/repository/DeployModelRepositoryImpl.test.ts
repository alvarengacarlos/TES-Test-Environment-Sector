import {describe, expect, jest, test} from "@jest/globals"
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {prismaClient} from "../../../src/infra/primaClient"
import {DeployModelRepositoryImpl} from "../../../src/repository/DeployModelRepositoryImpl";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {s3Client} from "../../../src/infra/s3Client";
import {S3Exception} from "../../../src/exception/S3Exception";
import {secretsManagerClient} from "../../../src/infra/secretsManagerClient";
import {CloudFormationException} from "../../../src/exception/CloudFormationException";
import {cloudFormationClient} from "../../../src/infra/cloudFormationClient";


describe("DeployModelRepositoryImpl", () => {
    const getCloudFormationClientWithCredentialsMock = jest.fn(() => {
        return cloudFormationClient
    })
    const deployModelRepository = new DeployModelRepositoryImpl(prismaClient, s3Client, secretsManagerClient, getCloudFormationClientWithCredentialsMock)
    jest.spyOn(prismaClient, "$connect").mockResolvedValue()
    jest.spyOn(prismaClient, "$disconnect").mockResolvedValue()

    const ownerEmail = faker.internet.email()

    const deployModelEntity = new DeployModelEntity(
        randomUUID(),
        faker.internet.domainName(),
        ownerEmail,
        "",
        "",
    )

    describe("saveDeployModel", () => {
        const saveDeployModelInput = {
            deployModelName: faker.internet.domainName(),
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

    describe("saveSourceCode", () => {
        const saveSourceCodeInput = {
            ownerEmail: faker.internet.email(),
            deployModelId: randomUUID().toString(),
            bufferedSourceCodeFile: Buffer.from("")
        }

        test("should throw S3Exception", async () => {
            s3Client.send = async function () {
                throw new Error()
            }

            await expect(deployModelRepository.saveSourceCode(saveSourceCodeInput)).rejects.toThrow(S3Exception)
        })

        test("should save source code", async () => {
            s3Client.send = async function () {}
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveSourceCode(saveSourceCodeInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveSourceCodeInput.deployModelId},
                data: {
                    sourceCodePath: `sourceCode/${saveSourceCodeInput.ownerEmail}-${saveSourceCodeInput.deployModelId}-sourceCode.zip`
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("saveAwsCredentials", () => {
        const saveAwsCredentialsInput = {
            ownerEmail: ownerEmail,
            deployModelId: randomUUID().toString(),
            accessKeyId: "00000000000000000000",
            secretAccessKey: "0000000000000000000000000000000000000000"
        }

        test("should save aws credentials", async () => {
            secretsManagerClient.send = async function () {}
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveAwsCredentials(saveAwsCredentialsInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveAwsCredentialsInput.deployModelId},
                data: {
                    awsCredentialsPath: `${saveAwsCredentialsInput.ownerEmail}-${saveAwsCredentialsInput.deployModelId}-awsCredentials`,
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("createDeployModelInfra", () => {
        const deployModelId = randomUUID().toString()
        const createDeployModelInfraInput = {
            deployModelId: deployModelId,
            awsCredentialsPath: `${ownerEmail}-${deployModelId}-awsCredentials`
        }
        const awsCredentials = {
            accessKeyId: "00000000000000000000",
            secretAccessKey: "0000000000000000000000000000000000000000"
        }

        test("should throw CloudFormationException", async () => {
            secretsManagerClient.send = async function () {
                return {
                    SecretString: JSON.stringify(awsCredentials)
                }
            }
            s3Client.send = async function () {
                return {
                    Body: {transformToString: () => "template body"}
                }
            }

            cloudFormationClient.send = async function () {
                throw new Error()
            }

            await expect(deployModelRepository.createDeployModelInfra(createDeployModelInfraInput)).rejects.toThrow(CloudFormationException)
            expect(getCloudFormationClientWithCredentialsMock).toBeCalledWith(awsCredentials.accessKeyId, awsCredentials.secretAccessKey)
        })

        test("should create a deploy model infra", async () => {
            secretsManagerClient.send = async function () {
                return {
                    SecretString: JSON.stringify(awsCredentials)
                }
            }
            s3Client.send = async function () {
                return {
                    Body: {transformToString: () => "template body"}
                }
            }
            cloudFormationClient.send = async function () {}

            await deployModelRepository.createDeployModelInfra(createDeployModelInfraInput)

            expect(getCloudFormationClientWithCredentialsMock).toBeCalledWith(awsCredentials.accessKeyId, awsCredentials.secretAccessKey)
        })
    })
})