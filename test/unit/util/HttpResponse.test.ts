import {describe, expect, test} from "@jest/globals";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";

describe("HttpResponse", () => {
    describe("ok", () => {
        test("should return a formatted ok http response", () => {
            const httpResponse = HttpResponse.ok<string>("test", "test")

            expect(httpResponse).toEqual({
                httpStatusCode: 200,
                body: {
                    apiStatusCode: ApiStatusCode.SUCCESS,
                    message: "test",
                    data: "test"
                }
            })
        })
    })

    describe("created", () => {
        test("should return a formatted created http response", () => {
            const httpResponse = HttpResponse.created<string>("test", "test")

            expect(httpResponse).toEqual({
                httpStatusCode: 201,
                body: {
                    apiStatusCode: ApiStatusCode.SUCCESS,
                    message: "test",
                    data: "test"
                }
            })
        })
    })

    describe("badRequest", () => {
        test("should return a formatted bad request http response", () => {
            const httpResponse = HttpResponse.badRequest<string>(ApiStatusCode.INVALID_INPUT, "test", "test")

            expect(httpResponse).toEqual({
                httpStatusCode: 400,
                body: {
                    apiStatusCode: ApiStatusCode.INVALID_INPUT,
                    message: "test",
                    data: "test"
                }
            })
        })
    })

    describe("conflict", () => {
        test("should return a formatted conflict http response", () => {
            const httpResponse = HttpResponse.conflict<string>(ApiStatusCode.EMAIL_EXISTS, "test", "test")

            expect(httpResponse).toEqual({
                httpStatusCode: 409,
                body: {
                    apiStatusCode: ApiStatusCode.EMAIL_EXISTS,
                    message: "test",
                    data: "test"
                }
            })
        })
    })

    describe("notFound", () => {
        test("should return a formatted not found http response", () => {
            const httpResponse = HttpResponse.notFound()

            expect(httpResponse).toEqual({
                httpStatusCode: 404,
                body: {
                    apiStatusCode: ApiStatusCode.RESOURCE_NOT_FOUND,
                    message: "Resource not found",
                    data: null
                }
            })
        })
    })

    describe("internalServerError", () => {
        test("should return a formatted internal server error http response", () => {
            const httpResponse = HttpResponse.internalServerError()

            expect(httpResponse).toEqual({
                httpStatusCode: 500,
                body: {
                    apiStatusCode: ApiStatusCode.INTERNAL_ERROR,
                    message: "Internal server error",
                    data: null
                }
            })
        })
    })
})