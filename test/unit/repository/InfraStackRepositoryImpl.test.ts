import { describe, expect, test } from "@jest/globals"
import { faker } from "@faker-js/faker"
import {
    CreateStackCommand,
    DeleteStackCommand,
    DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation"
import { mockClient } from "aws-sdk-client-mock"

import { randomUUID } from "crypto"

import { InfraStackRepositoryImpl } from "../../../src/repository/InfraStackRepositoryImpl"
import { cloudFormationClient } from "../../../src/infra/cloudFormationClient"
import { AwsCredentialsEntity } from "../../../src/entity/AwsCredentialsEntity"
import { CloudFormationException } from "../../../src/exception/CloudFormationException"

describe("InfraStackRepositoryImpl", () => {
    const cloudFormationClientMocked = mockClient(cloudFormationClient)
    function getCloudFormationClientWithCredenialsMock() {
        return cloudFormationClient
    }
    const infraStackRepository = new InfraStackRepositoryImpl(
        getCloudFormationClientWithCredenialsMock,
    )

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("createInfraStack", () => {
        const createInfraStackInput = {
            appName: faker.animal.cat(),
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
            templateBody: 'AWSTemplateFormatVersion: "2010-09-09"...',
            sourceCodePath: `${email}-${faker.animal.cat()}-sourceCode.zip`,
        }

        test("should throw CloudFormationException", async () => {
            cloudFormationClientMocked
                .on(CreateStackCommand)
                .rejects(new Error())

            await expect(
                infraStackRepository.createInfraStack(createInfraStackInput),
            ).rejects.toThrow(CloudFormationException)
        })

        test("should create infra stack", async () => {
            cloudFormationClientMocked.on(CreateStackCommand).resolves({})

            await expect(
                infraStackRepository.createInfraStack(createInfraStackInput),
            ).resolves.not.toThrow(CloudFormationException)
        })
    })

    describe("findInfraStacks", () => {
        const findInfraStacksInput = {
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
        }

        test("should throw CloudFormationException", async () => {
            cloudFormationClientMocked
                .on(DescribeStacksCommand)
                .rejects(new Error())

            await expect(
                infraStackRepository.findInfraStacks(findInfraStacksInput),
            ).rejects.toThrow(CloudFormationException)
        })

        test("should find infra stacks", async () => {
            cloudFormationClientMocked.on(DescribeStacksCommand).resolves({
                Stacks: [
                    {
                        StackId: `arn:aws:cloudformatiton:us-east-1:000000000000:stack/tes-cloudformation-stack-${randomUUID().toString()}`,
                        StackName: `tes-cloudformation-stack-${faker.animal.cat()}`,
                        StackStatus: "CREATE_IN_PROGRESS",
                        CreationTime: new Date(),
                    },
                ],
            })

            await expect(
                infraStackRepository.findInfraStacks(findInfraStacksInput),
            ).resolves.not.toThrow(CloudFormationException)
        })
    })

    describe("deleteInfraStack", () => {
        const deleteInfraStackInput = {
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
            stackName: `tes-cloudformation-stack-${faker.animal.cat()}`,
        }

        test("should throw CloudFormationException", async () => {
            cloudFormationClientMocked
                .on(DeleteStackCommand)
                .rejects(new Error())

            await expect(
                infraStackRepository.deleteInfraStack(deleteInfraStackInput),
            ).rejects.toThrow(CloudFormationException)
        })

        test("should delete infra stack", async () => {
            cloudFormationClientMocked.on(DeleteStackCommand).resolves({})

            await expect(
                infraStackRepository.deleteInfraStack(deleteInfraStackInput),
            ).resolves.not.toThrow(CloudFormationException)
        })
    })
})
