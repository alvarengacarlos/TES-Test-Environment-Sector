import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker";

import {randomUUID} from "crypto";

import {SourceCodeRepository} from "../../../src/repository/SourceCodeRepository";
import {
    DeleteSourceCodeDtoInput, DeleteSourceCodeDtoOutput,
    FindSourceCodesDtoInput, FindSourceCodesDtoOutput,
    SourceCodeService,
    UploadSourceCodeDtoInput,
    UploadSourceCodeDtoOutput
} from "../../../src/service/SourceCodeService";
import {AwsCredentialsService, FindAwsCredentialsDtoOutput} from "../../../src/service/AwsCredentialsService";
import {AwsCredentialsEntity} from "../../../src/entity/AwsCredentialsEntity";
import {SourceCodeEntity} from "../../../src/entity/SourceCodeEntity";


describe("SourceCodeService", () => {
    const sourceCodeRepository = mockDeep<SourceCodeRepository>()
    const awsCredentialsService = mockDeep<AwsCredentialsService>()
    const sourceCodeService = new SourceCodeService(sourceCodeRepository, awsCredentialsService)

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("uploadSourceCode", () => {
        const appName = faker.animal.cat()
        const uploadSourceCodeDtoInput = new UploadSourceCodeDtoInput(
            appName,
            email,
            Buffer.from("")
        )

        test("should upload source code", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(accessKeyId, secretAccessKey)
            jest.spyOn(awsCredentialsService, "findAwsCredentials").mockResolvedValue(findAwsCredentialsDtoOutput)
            jest.spyOn(sourceCodeRepository, "uploadSourceCode").mockResolvedValue()

            const output = await sourceCodeService.uploadSourceCode(uploadSourceCodeDtoInput)

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(sourceCodeRepository.uploadSourceCode).toBeCalledWith({
                appName: appName,
                ownerEmail: email,
                bufferedSourceCode: Buffer.from(""),
                awsCredentials: new AwsCredentialsEntity(accessKeyId, secretAccessKey)
            })
            expect(output).toEqual(new UploadSourceCodeDtoOutput())
        })
    })

    describe("findSourceCodes", () => {
        const findSourceCodesDtoInput = new FindSourceCodesDtoInput(email)

        test("should find source codes", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(accessKeyId, secretAccessKey)
            jest.spyOn(awsCredentialsService, "findAwsCredentials").mockResolvedValue(findAwsCredentialsDtoOutput)
            const sourceCodeEntity = new SourceCodeEntity(`${email}-${faker.animal.cat()}-sourceCode.zip`)
            jest.spyOn(sourceCodeRepository, "findSourceCodes").mockResolvedValue([sourceCodeEntity])

            const output = await sourceCodeService.findSourceCodes(findSourceCodesDtoInput)

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(sourceCodeRepository.findSourceCodes).toBeCalledWith({
                awsCredentials: new AwsCredentialsEntity(accessKeyId, secretAccessKey)
            })
            expect(output).toEqual(new FindSourceCodesDtoOutput([sourceCodeEntity]))
        })
    })

    describe("deleteSourceCode", () => {
        const sourceCodePath = `${email}-${faker.animal.cat()}-sourceCode.zip`
        const deleteSourceCodeDtoInput = new DeleteSourceCodeDtoInput(
            email,
            sourceCodePath
        )

        test("should delete source code", async () => {
            const findAwsCredentialsDtoOutput = new FindAwsCredentialsDtoOutput(accessKeyId, secretAccessKey)
            jest.spyOn(awsCredentialsService, "findAwsCredentials").mockResolvedValue(findAwsCredentialsDtoOutput)
            jest.spyOn(sourceCodeRepository, "deleteSourceCode").mockResolvedValue()

            const output = await sourceCodeService.deleteSourceCode(deleteSourceCodeDtoInput)

            expect(awsCredentialsService.findAwsCredentials).toBeCalledWith({
                ownerEmail: email
            })
            expect(sourceCodeRepository.deleteSourceCode).toBeCalledWith({
                awsCredentials: new AwsCredentialsEntity(accessKeyId, secretAccessKey),
                sourceCodePath: sourceCodePath
            })
            expect(output).toEqual(new DeleteSourceCodeDtoOutput())
        })
    })
})