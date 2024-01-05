import { describe, expect, jest, test } from "@jest/globals"
import { faker } from "@faker-js/faker"
import { mockDeep } from "jest-mock-extended"

import { SourceCodeController } from "../../../src/controller/SourceCodeController"
import {
    DeleteSourceCodeDtoInput,
    DeleteSourceCodeDtoOutput,
    FindSourceCodesDtoInput,
    FindSourceCodesDtoOutput,
    SourceCodeService,
    UploadSourceCodeDtoInput,
    UploadSourceCodeDtoOutput,
} from "../../../src/service/SourceCodeService"
import { HttpRequest } from "../../../src/util/HttpRequest"
import { HttpResponse } from "../../../src/util/HttpResponse"

describe("SourceCodeController", () => {
    const sourceCodeService = mockDeep<SourceCodeService>()
    const sourceCodeController = new SourceCodeController(sourceCodeService)

    const email = faker.internet.email()

    describe("uploadSourceCode", () => {
        const uploadSourceCodeDtoInput = new UploadSourceCodeDtoInput(
            faker.animal.cat(),
            email,
            Buffer.from(""),
        )
        const httpRequest = new HttpRequest(uploadSourceCodeDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(sourceCodeService, "uploadSourceCode").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await sourceCodeController.uploadSourceCode(httpRequest)

            expect(sourceCodeService.uploadSourceCode).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const uploadSourceCodeDtoOutput = new UploadSourceCodeDtoOutput()
            jest.spyOn(sourceCodeService, "uploadSourceCode").mockResolvedValue(
                uploadSourceCodeDtoOutput,
            )

            const httpResponse =
                await sourceCodeController.uploadSourceCode(httpRequest)

            expect(sourceCodeService.uploadSourceCode).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.ok(
                    "Source code upload with success",
                    uploadSourceCodeDtoOutput,
                ),
            )
        })
    })

    describe("findSourceCode", () => {
        const findSourceCodesDtoInput = new FindSourceCodesDtoInput(email)
        const httpRequest = new HttpRequest(findSourceCodesDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(sourceCodeService, "findSourceCodes").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await sourceCodeController.findSourceCodes(httpRequest)

            expect(sourceCodeService.findSourceCodes).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const findSourceCodesDtoOutput = new FindSourceCodesDtoOutput([])
            jest.spyOn(sourceCodeService, "findSourceCodes").mockResolvedValue(
                findSourceCodesDtoOutput,
            )

            const httpResponse =
                await sourceCodeController.findSourceCodes(httpRequest)

            expect(sourceCodeService.findSourceCodes).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.ok(
                    "Source codes got with success",
                    findSourceCodesDtoOutput,
                ),
            )
        })
    })

    describe("deleteSourceCode", () => {
        const deleteSourceCodeDtoInput = new DeleteSourceCodeDtoInput(
            email,
            `${email}-${faker.animal.cat()}-sourceCode.zip`,
        )
        const httpRequest = new HttpRequest(deleteSourceCodeDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(sourceCodeService, "deleteSourceCode").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await sourceCodeController.deleteSourceCode(httpRequest)

            expect(sourceCodeService.deleteSourceCode).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const deleteSourceCodeDtoOutput = new DeleteSourceCodeDtoOutput()
            jest.spyOn(sourceCodeService, "deleteSourceCode").mockResolvedValue(
                deleteSourceCodeDtoOutput,
            )

            const httpResponse =
                await sourceCodeController.deleteSourceCode(httpRequest)

            expect(sourceCodeService.deleteSourceCode).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.ok(
                    "Source code deleted with success",
                    deleteSourceCodeDtoOutput,
                ),
            )
        })
    })
})
