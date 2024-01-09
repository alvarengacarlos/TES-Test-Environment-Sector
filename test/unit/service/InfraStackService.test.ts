import { describe, expect, jest, test } from "@jest/globals"
import { mockDeep } from "jest-mock-extended"
import { faker } from "@faker-js/faker"

import { InfraStackRepository } from "../../../src/repository/InfraStackRepository"
import {
    AwsCredentialsService,
    FindAwsCredentialsDtoOutput,
} from "../../../src/service/AwsCredentialsService"
import {
    GetContainerModelTemplateDtoOutput,
    TemplateService,
} from "../../../src/service/TemplateService"
import {
    CreateInfraStackDtoInput,
    CreateInfraStackDtoOutput,
    DeleteInfraStackDtoInput,
    FindInfraStacksDtoInput,
    FindInfraStacksDtoOutput,
    InfraStackService,
} from "../../../src/service/InfraStackService"
import { TemplateModel } from "../../../src/util/TemplateModel"
import { randomUUID } from "crypto"
import { AwsCredentialsEntity } from "../../../src/entity/AwsCredentialsEntity"
import { InfraStackEntity } from "../../../src/entity/InfraStackEntity"

describe("InfraStackService", () => {
    const infraStackRepository = mockDeep<InfraStackRepository>()
    const awsCredentialsService = mockDeep<AwsCredentialsService>()
    const templateService = mockDeep<TemplateService>()
    const infraStackService = new InfraStackService(
        infraStackRepository,
        awsCredentialsService,
        templateService,
    )

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("createInfraStack", () => {
        const appName = faker.animal.cat()
        const sourceCodePath = `${email}-${appName}-sourceCode.zip`
        const createInfraStackDtoInput = new CreateInfraStackDtoInput(
            appName,
            TemplateModel.CONTAINER_MODEL,
            email,
            sourceCodePath,
        )

        test("should create infra stack", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(
                accessKeyId,
                secretAccessKey,
            )
            jest.spyOn(
                awsCredentialsService,
                "findAwsCredentials",
            ).mockResolvedValue(findAwsCredentialsDtoOutput)
            const templateBody = 'AWSTemplateFormatVersion: "2010-09-09"...'
            const getContainerModelTemplateDtoOutput =
                new GetContainerModelTemplateDtoOutput(templateBody)
            jest.spyOn(
                templateService,
                "getContainerModelTemplate",
            ).mockResolvedValue(getContainerModelTemplateDtoOutput)
            jest.spyOn(
                infraStackRepository,
                "createInfraStack",
            ).mockResolvedValue()

            const output = await infraStackService.createInfraStack(
                createInfraStackDtoInput,
            )

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email,
            })
            expect(templateService.getContainerModelTemplate).toBeCalledWith()
            expect(infraStackRepository.createInfraStack).toBeCalledWith({
                appName: appName,
                awsCredentials: new AwsCredentialsEntity(
                    accessKeyId,
                    secretAccessKey,
                ),
                templateBody: templateBody,
                sourceCodePath: sourceCodePath,
            })
            expect(output).toEqual(new CreateInfraStackDtoOutput())
        })
    })

    describe("findInfraStacks", () => {
        const findInfraStacksDtoInput = new FindInfraStacksDtoInput(email)

        test("should find infra stacks", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(
                accessKeyId,
                secretAccessKey,
            )
            jest.spyOn(
                awsCredentialsService,
                "findAwsCredentials",
            ).mockResolvedValue(findAwsCredentialsDtoOutput)
            const infraStackEntity = new InfraStackEntity(
                `arn:aws:cloudformatiton:us-east-1:000000000000:stack/tes-cloudformation-stack-${randomUUID().toString()}`,
                `tes-cloudformation-stack-${faker.animal.cat()}`,
                "CREATE_IN_PROGRESS",
            )
            jest.spyOn(
                infraStackRepository,
                "findInfraStacks",
            ).mockResolvedValue([infraStackEntity])

            const output = await infraStackService.findInfraStacks(
                findInfraStacksDtoInput,
            )

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email,
            })
            expect(infraStackRepository.findInfraStacks).toBeCalledWith({
                awsCredentials: new AwsCredentialsEntity(
                    accessKeyId,
                    secretAccessKey,
                ),
            })
            expect(output).toEqual(
                new FindInfraStacksDtoOutput([infraStackEntity]),
            )
        })
    })

    describe("deleteInfraStack", () => {
        const stackName = `tes-cloudformation-stack-${faker.animal.cat()}`
        const deleteInfraStackDtoInput = new DeleteInfraStackDtoInput(
            stackName,
            email,
        )

        test("should delete infra stack", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(
                accessKeyId,
                secretAccessKey,
            )
            jest.spyOn(
                awsCredentialsService,
                "findAwsCredentials",
            ).mockResolvedValue(findAwsCredentialsDtoOutput)
            jest.spyOn(
                infraStackRepository,
                "deleteInfraStack",
            ).mockResolvedValue()

            await infraStackService.deleteInfraStack(deleteInfraStackDtoInput)

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email,
            })
            expect(infraStackRepository.deleteInfraStack).toBeCalledWith({
                awsCredentials: new AwsCredentialsEntity(
                    accessKeyId,
                    secretAccessKey,
                ),
                stackName: stackName,
            })
        })
    })
})
