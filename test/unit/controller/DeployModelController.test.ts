import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";
import {faker} from "@faker-js/faker"

import {randomUUID} from "crypto";

import {DeployModelController} from "../../../src/controller/DeployModelController";
import {HttpRequest} from "../../../src/util/HttpRequest";
import {ApiStatusCode, HttpResponse} from "../../../src/util/HttpResponse";
import {
    CreateDeployModelDtoInput,
    CreateDeployModelDtoOutput,
    CreateDeployModelUseCase,
} from "../../../src/use-case/CreateDeployModelUseCase";
import {
    UploadSourceCodeDtoInput,
    UploadSourceCodeDtoOutput,
    UploadSourceCodeUseCase
} from "../../../src/use-case/UploadSourceCodeUseCase";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    SaveAwsCredentialsUseCase
} from "../../../src/use-case/SaveAwsCredentialsUseCase";
import {
    CreateDeployModelInfraDtoInput, CreateDeployModelInfraDtoOutput,
    CreateDeployModelInfraUseCase
} from "../../../src/use-case/CreateDeployModelInfraUseCase";
import {
    AwsCredentialsConfigurationMissingException
} from "../../../src/exception/AwsCredentialsConfigurationMissingException";

describe("DeployModelController", () => {
    const createDeployModelUseCase = mockDeep<CreateDeployModelUseCase>()
    const uploadSourceCodeUseCase = mockDeep<UploadSourceCodeUseCase>()
    const saveAwsCredentialsUseCase = mockDeep<SaveAwsCredentialsUseCase>()
    const createDeployModelInfraUseCase = mockDeep<CreateDeployModelInfraUseCase>()
    const deployModelController = new DeployModelController(
        createDeployModelUseCase,
        uploadSourceCodeUseCase,
        saveAwsCredentialsUseCase,
        createDeployModelInfraUseCase
    )
    const ownerEmail = faker.internet.email()

    describe("createDeployModel", () => {
        const deployModelName = faker.internet.domainName()
        const createDeployModelDtoInput = new CreateDeployModelDtoInput(
            deployModelName,
            ownerEmail
        )
        const httpRequest = new HttpRequest<CreateDeployModelDtoInput>(createDeployModelDtoInput)

        test("should return internal server error http response", async () => {
            jest.spyOn(createDeployModelUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.createDeployModel(httpRequest)

            expect(createDeployModelUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return created http response", async () => {
            const createDeployModelDtoOutput = new CreateDeployModelDtoOutput(
                randomUUID().toString(),
                deployModelName,
                ownerEmail
            )
            jest.spyOn(createDeployModelUseCase, "execute").mockResolvedValue(createDeployModelDtoOutput)

            const httpResponse = await deployModelController.createDeployModel(httpRequest)

            expect(createDeployModelUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created("Deploy model created with success", createDeployModelDtoOutput))
        })
    })

    describe("uploadSourceCode", () => {
        const uploadSourceCodeDtoInput = new UploadSourceCodeDtoInput(
            randomUUID().toString(),
            Buffer.from("")
        )
        const httpRequest = new HttpRequest<UploadSourceCodeDtoInput>(uploadSourceCodeDtoInput)

        const uploadSourceCodeDtoOutput = new UploadSourceCodeDtoOutput(
            uploadSourceCodeDtoInput.deployModelId,
            `${ownerEmail}-${uploadSourceCodeDtoInput.deployModelId}-${uploadSourceCodeDtoInput.deployModelId}-sourceCode.zip`
        )

        test("should return bad request http response with DEPLOY_MODEL_DOES_NOT_EXIST api status code", async () => {
            jest.spyOn(uploadSourceCodeUseCase, "execute").mockRejectedValue(new DeployModelDoesNotExistException())

            const httpResponse = await deployModelController.uploadSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, "Deploy model does not exist", null))
        })

        test("should return bad request http response with AWS_CREDENTIALS_CONFIGURATION_MISSING api status code", async () => {
            jest.spyOn(uploadSourceCodeUseCase, "execute").mockRejectedValue(new AwsCredentialsConfigurationMissingException())

            const httpResponse = await deployModelController.uploadSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.AWS_CREDENTIALS_CONFIGURATION_MISSING, "Aws credentials configuration missing", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(uploadSourceCodeUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.uploadSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            jest.spyOn(uploadSourceCodeUseCase, "execute").mockResolvedValue(uploadSourceCodeDtoOutput)

            const httpResponse = await deployModelController.uploadSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.ok("upload executed with success", uploadSourceCodeDtoOutput))
        })
    })

    describe("saveAwsCredentials", () => {
        const deployModelId = randomUUID().toString()
        const httpRequest = new HttpRequest<SaveAwsCredentialsDtoInput>({
            deployModelId: deployModelId,
            accessKeyId: "00000000000000000000",
            secretAccessKey: "0000000000000000000000000000000000000000"
        })

        const saveAwsCredentialsDtoOutput = new SaveAwsCredentialsDtoOutput(
            deployModelId,
            `${ownerEmail}-${deployModelId}-awsCredentials`,
        )

        test("should return bad request http response", async () => {
            jest.spyOn(saveAwsCredentialsUseCase, "execute").mockRejectedValue(new DeployModelDoesNotExistException())

            const httpResponse = await deployModelController.saveAwsCredentials(httpRequest)

            expect(saveAwsCredentialsUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, "Deploy model does not exist", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(saveAwsCredentialsUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.saveAwsCredentials(httpRequest)

            expect(saveAwsCredentialsUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            jest.spyOn(saveAwsCredentialsUseCase, "execute").mockResolvedValue(saveAwsCredentialsDtoOutput)

            const httpResponse = await deployModelController.saveAwsCredentials(httpRequest)

            expect(saveAwsCredentialsUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.ok("aws credentials saved with success", saveAwsCredentialsDtoOutput))
        })
    })

    describe("createDeployModelInfra", () => {
        const createDeployModelInfraDtoInput = new CreateDeployModelInfraDtoInput(
            randomUUID().toString(),
        )
        const httpRequest = new HttpRequest<CreateDeployModelInfraDtoInput>(createDeployModelInfraDtoInput)

        const createDeployModelInfraDtoOutput = new CreateDeployModelInfraDtoOutput(
            createDeployModelInfraDtoInput.deployModelId,
        )

        test("should return bad request http response with DEPLOY_MODEL_DOES_NOT_EXIST api status code", async () => {
            jest.spyOn(createDeployModelInfraUseCase, "execute").mockRejectedValue(new DeployModelDoesNotExistException())

            const httpResponse = await deployModelController.createDeployModelInfra(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, "Deploy model does not exist", null))
        })

        test("should return bad request http response with AWS_CREDENTIALS_CONFIGURATION_MISSING api status code", async () => {
            jest.spyOn(createDeployModelInfraUseCase, "execute").mockRejectedValue(new AwsCredentialsConfigurationMissingException())

            const httpResponse = await deployModelController.createDeployModelInfra(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.AWS_CREDENTIALS_CONFIGURATION_MISSING, "Aws credentials configuration missing", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(createDeployModelInfraUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.createDeployModelInfra(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            jest.spyOn(createDeployModelInfraUseCase, "execute").mockResolvedValue(createDeployModelInfraDtoOutput)

            const httpResponse = await deployModelController.createDeployModelInfra(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.ok("deploy model infra created with success", createDeployModelInfraDtoOutput))
        })
    })
})