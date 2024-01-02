import {describe, expect, jest, test} from "@jest/globals"
import {faker} from "@faker-js/faker";
import {mockClient} from "aws-sdk-client-mock";

import {randomUUID} from "crypto";

import {prismaClient} from "../../../src/infra/primaClient"
import {DeployModelRepositoryImpl} from "../../../src/repository/DeployModelRepositoryImpl";
import {DeployModelEntity} from "../../../src/entity/DeployModelEntity";
import {s3Client} from "../../../src/infra/s3Client";
import {secretsManagerClient} from "../../../src/infra/secretsManagerClient";
import {cloudFormationClient} from "../../../src/infra/cloudFormationClient";
import {CreateBucketCommand, GetObjectCommand, ListBucketsCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {CreateSecretCommand, GetSecretValueCommand} from "@aws-sdk/client-secrets-manager";
import {CreateStackCommand, DescribeStacksCommand} from "@aws-sdk/client-cloudformation";
import {DeployModelInfraEntity} from "../../../src/entity/DeployModelInfraEntity";

describe("DeployModelRepositoryImpl", () => {
    const secretsManagerClientMocked = mockClient(secretsManagerClient)
    const s3ClientMocked = mockClient(s3Client)
    const getS3ClientWithCredentialsMock = jest.fn(() => {
        return s3Client
    })
    const cloudFormationClientMocked = mockClient(cloudFormationClient)
    const getCloudFormationClientWithCredentialsMock = jest.fn(() => {
        return cloudFormationClient
    })
    const deployModelRepository = new DeployModelRepositoryImpl(prismaClient, s3Client, secretsManagerClient, getS3ClientWithCredentialsMock, getCloudFormationClientWithCredentialsMock)
    jest.spyOn(prismaClient, "$connect").mockResolvedValue()
    jest.spyOn(prismaClient, "$disconnect").mockResolvedValue()

    const ownerEmail = faker.internet.email()

    const deployModelId = randomUUID().toString()
    const awsCredentialsPath = `${ownerEmail}-${deployModelId}-awsCredentials`
    const deployModelEntity = new DeployModelEntity(
        deployModelId,
        faker.internet.domainName(),
        ownerEmail,
        "",
        awsCredentialsPath,
        ""
    )

    const awsCredentials = {
        accessKeyId: "00000000000000000000",
        secretAccessKey: "0000000000000000000000000000000000000000"
    }

    const sourceCodePath = `${ownerEmail}-${deployModelId}-sourceCode.zip`

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
            ownerEmail: ownerEmail,
            deployModelId: deployModelId,
            bufferedSourceCodeFile: Buffer.from(""),
            awsCredentialsPath: awsCredentialsPath
        }

        test("should create a bucket and save source code", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).resolves({SecretString: JSON.stringify(awsCredentials)})
            s3ClientMocked.on(ListBucketsCommand).resolves({Buckets: [{Name: ""}]})
                .on(CreateBucketCommand).resolves({})
                .on(PutObjectCommand).resolves({})
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveSourceCode(saveSourceCodeInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveSourceCodeInput.deployModelId},
                data: {
                    sourceCodePath: sourceCodePath
                }
            })
            expect(output).toEqual(deployModelEntity)
        })

        test("should save source code", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).resolves({SecretString: JSON.stringify(awsCredentials)})
            s3ClientMocked.on(ListBucketsCommand).resolves({Buckets: [{Name: "source-code-s3-bucket"}]})
                .on(PutObjectCommand).resolves({})
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveSourceCode(saveSourceCodeInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveSourceCodeInput.deployModelId},
                data: {
                    sourceCodePath: `${saveSourceCodeInput.ownerEmail}-${saveSourceCodeInput.deployModelId}-sourceCode.zip`
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("saveAwsCredentials", () => {
        const saveAwsCredentialsInput = {
            ownerEmail: ownerEmail,
            deployModelId: deployModelId,
            accessKeyId: "00000000000000000000",
            secretAccessKey: "0000000000000000000000000000000000000000"
        }

        test("should save aws credentials", async () => {
            secretsManagerClientMocked.on(CreateSecretCommand).resolves({})
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            const output = await deployModelRepository.saveAwsCredentials(saveAwsCredentialsInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: saveAwsCredentialsInput.deployModelId},
                data: {
                    awsCredentialsPath: awsCredentialsPath,
                }
            })
            expect(output).toEqual(deployModelEntity)
        })
    })

    describe("createDeployModelInfra", () => {
        const createDeployModelInfraInput = {
            deployModelId: deployModelId,
            awsCredentialsPath: awsCredentialsPath,
            ownerEmail: ownerEmail
        }

        const cloudFormationStackName = `container-model-${deployModelId}`
        const deployModelEntity = new DeployModelEntity(
            deployModelId,
            faker.internet.domainName(),
            ownerEmail,
            "",
            awsCredentialsPath,
            cloudFormationStackName
        )

        test("should create a deploy model infra", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).resolves({SecretString: JSON.stringify(awsCredentials)})
            s3ClientMocked.on(GetObjectCommand).callsFake(() => Object.create({
                Body: {
                    transformToString: async () => "template body"
                }
            }))
            cloudFormationClientMocked.on(CreateStackCommand).resolves({})
            jest.spyOn(prismaClient.deployModel, "update").mockResolvedValue(deployModelEntity)

            await deployModelRepository.createDeployModelInfra(createDeployModelInfraInput)

            expect(prismaClient.deployModel.update).toBeCalledWith({
                where: {id: deployModelId},
                data: {
                    cloudFormationStackName: cloudFormationStackName
                }
            })
            expect(getCloudFormationClientWithCredentialsMock).toBeCalledWith(awsCredentials.accessKeyId, awsCredentials.secretAccessKey)
        })
    })

    describe("findDeployModelInfraStatus", () => {
        const cloudFormationStackName = `container-model-${deployModelId}`
        const findDeployModelInfraStatusInput = {
            cloudFormationStackName: cloudFormationStackName,
            awsCredentialsPath: awsCredentialsPath
        }

        const stackId = randomUUID().toString()
        const stackStatus = "CREATE_COMPLETE"

        test("should return a deploy model entity", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).resolves({SecretString: JSON.stringify(awsCredentials)})
            cloudFormationClientMocked.on(DescribeStacksCommand).resolves({
                Stacks: [
                    {
                        StackId: stackId,
                        StackName: cloudFormationStackName,
                        StackStatus: stackStatus,
                        CreationTime: new Date()
                    }
                ]
            })

            const output = await deployModelRepository.findDeployModelInfraStatus(findDeployModelInfraStatusInput)

            expect(getCloudFormationClientWithCredentialsMock).toBeCalledWith(awsCredentials.accessKeyId, awsCredentials.secretAccessKey)
            expect(output).toEqual(new DeployModelInfraEntity(
                stackId,
                cloudFormationStackName,
                stackStatus
            ))
        })
    })
})