import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";

import {AwsCredentialsController} from "../../../src/controller/AwsCredentialsController";
import {
    AwsCredentialsExistsDtoInput, AwsCredentialsExistsDtoOutput,
    AwsCredentialsService, DeleteAwsCredentialsDtoInput, DeleteAwsCredentialsDtoOutput,
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput, UpdateAwsCredentialsDtoInput, UpdateAwsCredentialsDtoOutput
} from "../../../src/service/AwsCredentialsService";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {faker} from "@faker-js/faker";
import {HttpResponse} from "../../../src/util/HttpResponse";

describe("AwsCredentialsController", () => {
    const awsCredentialsService = mockDeep<AwsCredentialsService>()
    const awsCredentialsController = new AwsCredentialsController(awsCredentialsService)

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("saveAwsCredentials", () => {
        const saveAwsCredentialsDtoInput = new SaveAwsCredentialsDtoInput(
            email,
            accessKeyId,
            secretAccessKey
        )
        const httpRequest = new HttpRequest(saveAwsCredentialsDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(awsCredentialsService, "saveAwsCredentials").mockRejectedValue(new Error())

            const httpResponse = await awsCredentialsController.saveAwsCredentials(httpRequest)

            expect(awsCredentialsService.saveAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const saveAwsCredentialsDtoOutput = new SaveAwsCredentialsDtoOutput()
            jest.spyOn(awsCredentialsService, "saveAwsCredentials").mockResolvedValue(saveAwsCredentialsDtoOutput)

            const httpResponse = await awsCredentialsController.saveAwsCredentials(httpRequest)

            expect(awsCredentialsService.saveAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created("Aws credentials saved with success", saveAwsCredentialsDtoOutput))
        })
    })

    describe("awsCredentialsExists", () => {
        const awsCredentialsExistsDtoInput = new AwsCredentialsExistsDtoInput(
            email,
        )
        const httpRequest = new HttpRequest(awsCredentialsExistsDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(awsCredentialsService, "awsCredentialsExists").mockRejectedValue(new Error())

            const httpResponse = await awsCredentialsController.awsCredentialsExists(httpRequest)

            expect(awsCredentialsService.awsCredentialsExists).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const awsCredentialsExistsDtoOutput = new AwsCredentialsExistsDtoOutput(true)
            jest.spyOn(awsCredentialsService, "awsCredentialsExists").mockResolvedValue(awsCredentialsExistsDtoOutput)

            const httpResponse = await awsCredentialsController.awsCredentialsExists(httpRequest)

            expect(awsCredentialsService.awsCredentialsExists).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("Aws credentials got with success", awsCredentialsExistsDtoOutput))
        })
    })

    describe("updateAwsCredentials", () => {
        const updateAwsCredentialsDtoInput = new UpdateAwsCredentialsDtoInput(
            email,
            accessKeyId,
            secretAccessKey
        )
        const httpRequest = new HttpRequest(updateAwsCredentialsDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(awsCredentialsService, "updateAwsCredentials").mockRejectedValue(new Error())

            const httpResponse = await awsCredentialsController.updateAwsCredentials(httpRequest)

            expect(awsCredentialsService.updateAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const updateAwsCredentialsDtoOutput = new UpdateAwsCredentialsDtoOutput()
            jest.spyOn(awsCredentialsService, "updateAwsCredentials").mockResolvedValue(updateAwsCredentialsDtoOutput)

            const httpResponse = await awsCredentialsController.updateAwsCredentials(httpRequest)

            expect(awsCredentialsService.updateAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("Aws credentials updated with success", updateAwsCredentialsDtoOutput))
        })
    })

    describe("deleteAwsCredentials", () => {
        const deleteAwsCredentialsDtoInput = new DeleteAwsCredentialsDtoInput(email)
        const httpRequest = new HttpRequest(deleteAwsCredentialsDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(awsCredentialsService, "deleteAwsCredentials").mockRejectedValue(new Error())

            const httpResponse = await awsCredentialsController.deleteAwsCredentials(httpRequest)

            expect(awsCredentialsService.deleteAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const deleteAwsCredentialsDtoOutput = new DeleteAwsCredentialsDtoOutput()
            jest.spyOn(awsCredentialsService, "deleteAwsCredentials").mockResolvedValue(deleteAwsCredentialsDtoOutput)

            const httpResponse = await awsCredentialsController.deleteAwsCredentials(httpRequest)

            expect(awsCredentialsService.deleteAwsCredentials).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("Aws credentials deleted with success", deleteAwsCredentialsDtoOutput))
        })
    })
})