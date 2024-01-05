import { describe, expect, jest, test } from "@jest/globals"
import { mockDeep } from "jest-mock-extended"
import { faker } from "@faker-js/faker"

import { InfraStackController } from "../../../src/controller/InfraStackController"
import {
    CreateInfraStackDtoInput,
    CreateInfraStackDtoOutput,
    DeleteInfraStackDtoInput,
    DeleteInfraStackDtoOutput,
    FindInfraStacksDtoInput,
    FindInfraStacksDtoOutput,
    InfraStackService,
} from "../../../src/service/InfraStackService"
import { TemplateModel } from "../../../src/util/TemplateModel"
import { HttpRequest } from "../../../src/util/HttpRequest"
import { HttpResponse } from "../../../src/util/HttpResponse"

describe("InfraStackController", () => {
    const infraStackService = mockDeep<InfraStackService>()
    const infraStackController = new InfraStackController(infraStackService)

    const email = faker.internet.email()

    describe("createInfraStack", () => {
        const createInfraStackDtoInput = new CreateInfraStackDtoInput(
            faker.animal.cat(),
            TemplateModel.CONTAINER_MODEL,
            email,
            `${email}-${faker.animal.cat()}-sourceCode.zip`,
        )
        const httpRequest = new HttpRequest(createInfraStackDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(infraStackService, "createInfraStack").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await infraStackController.createInfraStack(httpRequest)

            expect(infraStackService.createInfraStack).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const createInfraStackDtoOutput = new CreateInfraStackDtoOutput()
            jest.spyOn(infraStackService, "createInfraStack").mockResolvedValue(
                createInfraStackDtoOutput,
            )

            const httpResponse =
                await infraStackController.createInfraStack(httpRequest)

            expect(infraStackService.createInfraStack).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.created(
                    "Infra stack created with success",
                    createInfraStackDtoOutput,
                ),
            )
        })
    })

    describe("findInfraStacks", () => {
        const findInfraStacksDtoInput = new FindInfraStacksDtoInput(email)
        const httpRequest = new HttpRequest(findInfraStacksDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(infraStackService, "findInfraStacks").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await infraStackController.findInfraStacks(httpRequest)

            expect(infraStackService.findInfraStacks).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const findInfraStacksDtoOutput = new FindInfraStacksDtoOutput([])
            jest.spyOn(infraStackService, "findInfraStacks").mockResolvedValue(
                findInfraStacksDtoOutput,
            )

            const httpResponse =
                await infraStackController.findInfraStacks(httpRequest)

            expect(infraStackService.findInfraStacks).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.ok(
                    "Infra stacks got with success",
                    findInfraStacksDtoOutput,
                ),
            )
        })
    })

    describe("deleteInfraStacks", () => {
        const deleteInfraStackDtoInput = new DeleteInfraStackDtoInput(
            `tes-cloudformation-stack-${faker.animal.cat()}`,
            email,
        )
        const httpRequest = new HttpRequest(deleteInfraStackDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(infraStackService, "deleteInfraStack").mockRejectedValue(
                new Error(),
            )

            const httpResponse =
                await infraStackController.deleteInfraStack(httpRequest)

            expect(infraStackService.deleteInfraStack).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            const deleteInfraStackDtoOutput = new DeleteInfraStackDtoOutput()
            jest.spyOn(infraStackService, "deleteInfraStack").mockResolvedValue(
                deleteInfraStackDtoOutput,
            )

            const httpResponse =
                await infraStackController.deleteInfraStack(httpRequest)

            expect(infraStackService.deleteInfraStack).toBeCalledWith(
                httpRequest.data,
            )
            expect(httpResponse).toEqual(
                HttpResponse.ok(
                    "Infra stack deleted with success",
                    deleteInfraStackDtoOutput,
                ),
            )
        })
    })
})
