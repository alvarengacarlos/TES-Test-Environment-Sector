import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";

import {
    AwsCredentialsExistsDtoInput, AwsCredentialsExistsDtoOutput,
    AwsCredentialsService,
    DeleteAwsCredentialsDtoInput,
    DeleteAwsCredentialsDtoOutput,
    FindAwsCredentialsDtoInput,
    FindAwsCredentialsDtoOutput,
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    UpdateAwsCredentialsDtoInput,
    UpdateAwsCredentialsDtoOutput
} from "../../../src/service/AwsCredentialsService";
import {AwsCredentialsRepository} from "../../../src/repository/AwsCredentialsRepository";
import {faker} from "@faker-js/faker";
import {AwsCredentialsEntity} from "../../../src/entity/AwsCredentialsEntity";
import {AwsCredentialsDoesNotExistException} from "../../../src/exception/AwsCredentialsDoesNotExistException";

describe("AwsCredentialsService", () => {
    const awsCredentialsRepository = mockDeep<AwsCredentialsRepository>()
    const awsCredentialsService = new AwsCredentialsService(awsCredentialsRepository)

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("saveAwsCredentials", () => {
        const saveAwsCredentialsDtoInput = new SaveAwsCredentialsDtoInput(
            email,
            accessKeyId,
            secretAccessKey
        )

        test("should save aws credentials", async () => {
            jest.spyOn(awsCredentialsRepository, "saveAwsCredentials").mockResolvedValue()

            const output = await awsCredentialsService.saveAwsCredentials(saveAwsCredentialsDtoInput)

            expect(awsCredentialsRepository.saveAwsCredentials).toBeCalledWith({
                ownerEmail: email,
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            })
            expect(output).toEqual(new SaveAwsCredentialsDtoOutput())
        })
    })

    describe("findAwsCredentials", () => {
        const findAwsCredentialsDtoInput = new FindAwsCredentialsDtoInput(email)

        test("should find aws credentials", async () => {
            const awsCredentialsEntity = new AwsCredentialsEntity(accessKeyId, secretAccessKey)
            jest.spyOn(awsCredentialsRepository, "findAwsCredentials").mockResolvedValue(awsCredentialsEntity)

            const output = await awsCredentialsService.findAwsCredentials(findAwsCredentialsDtoInput)

            expect(awsCredentialsRepository.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(output).toEqual(new FindAwsCredentialsDtoOutput(accessKeyId, secretAccessKey))
        })
    })

    describe("awsCredentialsExists", () => {
        const awsCredentialsExistsDtoInput = new AwsCredentialsExistsDtoInput(email)

        test("should return aws credentials does not exist", async () => {
            jest.spyOn(awsCredentialsRepository, "findAwsCredentials").mockRejectedValue(new AwsCredentialsDoesNotExistException())

            const output = await awsCredentialsService.awsCredentialsExists(awsCredentialsExistsDtoInput)

            expect(awsCredentialsRepository.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(output).toEqual(new AwsCredentialsExistsDtoOutput(false))
        })

        test("should return aws credentials exists", async () => {
            const awsCredentialsEntity = new AwsCredentialsEntity(accessKeyId, secretAccessKey)
            jest.spyOn(awsCredentialsRepository, "findAwsCredentials").mockResolvedValue(awsCredentialsEntity)

            const output = await awsCredentialsService.awsCredentialsExists(awsCredentialsExistsDtoInput)

            expect(awsCredentialsRepository.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(output).toEqual(new AwsCredentialsExistsDtoOutput(true))
        })
    })

    describe("updateAwsCredentials", () => {
        const updateAwsCredentialsDtoInput = new UpdateAwsCredentialsDtoInput(
            email,
            accessKeyId,
            secretAccessKey
        )

        test("should update aws credentials", async () => {
            jest.spyOn(awsCredentialsRepository, "updateAwsCredentials").mockResolvedValue()

            const output = await awsCredentialsService.updateAwsCredentials(updateAwsCredentialsDtoInput)

            expect(awsCredentialsRepository.updateAwsCredentials).toBeCalledWith({
                ownerEmail: email,
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            })
            expect(output).toEqual(new UpdateAwsCredentialsDtoOutput())
        })
    })

    describe("deleteAwsCredentials", () => {
        const deleteAwsCredentialsDtoInput = new DeleteAwsCredentialsDtoInput(email)

        test("should delete aws credentials", async () => {
            jest.spyOn(awsCredentialsRepository, "deleteAwsCredentials").mockResolvedValue()

            const output = await awsCredentialsService.deleteAwsCredentials(deleteAwsCredentialsDtoInput)

            expect(awsCredentialsRepository.deleteAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(output).toEqual(new DeleteAwsCredentialsDtoOutput())
        })
    })
})