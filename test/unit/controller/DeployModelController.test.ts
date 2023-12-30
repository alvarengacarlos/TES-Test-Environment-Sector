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
    UploadFrontendSourceCodeDtoInput,
    UploadFrontendSourceCodeDtoOutput,
    UploadFrontendSourceCodeUseCase
} from "../../../src/use-case/UploadFrontendSourceCodeUseCase";
import {
    UploadBackendSourceCodeDtoInput,
    UploadBackendSourceCodeDtoOutput,
    UploadBackendSourceCodeUseCase
} from "../../../src/use-case/UploadBackendSourceCodeUseCase";
import {DeployModelType} from "../../../src/util/DeployModelType";
import {DatabaseType} from "../../../src/util/DatabaseType";
import {ExecutionEnvironment} from "../../../src/util/ExecutionEnvironment";
import {DeployModelDoesNotExistException} from "../../../src/exception/DeployModelDoesNotExistException";
import {
    TwoTiersApplicationDoesNotHaveFrontendException
} from "../../../src/exception/TwoTiersApplicationDoesNotHaveFrontendException";
import {CodeType} from "../../../src/util/CodeType";
import {
    SaveAwsCredentialsDtoInput,
    SaveAwsCredentialsDtoOutput,
    SaveAwsCredentialsUseCase
} from "../../../src/use-case/SaveAwsCredentialsUseCase";

describe("DeployModelController", () => {
    const createDeployModelUseCase = mockDeep<CreateDeployModelUseCase>()
    const uploadFrontendSourceCodeUseCase = mockDeep<UploadFrontendSourceCodeUseCase>()
    const uploadBackendSourceCodeUseCase = mockDeep<UploadBackendSourceCodeUseCase>()
    const saveAwsCredentialsUseCase = mockDeep<SaveAwsCredentialsUseCase>()
    const deployModelController = new DeployModelController(
        createDeployModelUseCase,
        uploadFrontendSourceCodeUseCase,
        uploadBackendSourceCodeUseCase,
        saveAwsCredentialsUseCase
    )
    const ownerEmail = faker.internet.email()

    describe("createDeployModel", () => {
        const deployModelName = faker.internet.domainName()
        const createDeployModelDtoInput = new CreateDeployModelDtoInput(
            deployModelName,
            DeployModelType.TWO_TIERS,
            DatabaseType.POSTGRES_SQL,
            ExecutionEnvironment.NODE_JS,
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
                DeployModelType.TWO_TIERS,
                DatabaseType.POSTGRES_SQL,
                ExecutionEnvironment.NODE_JS,
                ownerEmail
            )
            jest.spyOn(createDeployModelUseCase, "execute").mockResolvedValue(createDeployModelDtoOutput)

            const httpResponse = await deployModelController.createDeployModel(httpRequest)

            expect(createDeployModelUseCase.execute).toBeCalledWith(httpRequest.data)
            expect(httpResponse).toEqual(HttpResponse.created("Deploy model created with success", createDeployModelDtoOutput))
        })
    })

    describe("uploadFrontendSourceCode", () => {
        const uploadFrontendSourceCodeDtoInput = new UploadFrontendSourceCodeDtoInput(
            randomUUID().toString(),
            Buffer.from("")
        )
        const httpRequest = new HttpRequest<UploadFrontendSourceCodeDtoInput>(uploadFrontendSourceCodeDtoInput)

        const uploadFrontendSourceCodeDtoOutput = new UploadFrontendSourceCodeDtoOutput(
            uploadFrontendSourceCodeDtoInput.deployModelId,
            `/${ownerEmail}/${uploadFrontendSourceCodeDtoInput.deployModelId}/${CodeType.FRONTEND}/${uploadFrontendSourceCodeDtoInput.deployModelId}`
        )

        test("should return bad request http response with DEPLOY_MODEL_DOES_NOT_EXIST api status code", async () => {
            jest.spyOn(uploadFrontendSourceCodeUseCase, "execute").mockRejectedValue(new DeployModelDoesNotExistException())

            const httpResponse = await deployModelController.uploadFrontendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, "Deploy model does not exist", null))
        })

        test("should return bad request http response with TWO_TIERS_APPLICATION_DOES_NOT_HAVE_FRONTEND api status code", async () => {
            jest.spyOn(uploadFrontendSourceCodeUseCase, "execute").mockRejectedValue(new TwoTiersApplicationDoesNotHaveFrontendException())

            const httpResponse = await deployModelController.uploadFrontendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.TWO_TIERS_APPLICATION_DOES_NOT_HAVE_FRONTEND, "Two tiers application does not have frontend", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(uploadFrontendSourceCodeUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.uploadFrontendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            jest.spyOn(uploadFrontendSourceCodeUseCase, "execute").mockResolvedValue(uploadFrontendSourceCodeDtoOutput)

            const httpResponse = await deployModelController.uploadFrontendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.ok("upload executed with success", uploadFrontendSourceCodeDtoOutput))
        })
    })

    describe("uploadBackendSourceCode", () => {
        const uploadBackendSourceCodeDtoInput = new UploadBackendSourceCodeDtoInput(
            randomUUID().toString(),
            Buffer.from("")
        )
        const httpRequest = new HttpRequest<UploadBackendSourceCodeDtoInput>(uploadBackendSourceCodeDtoInput)

        const uploadBackendSourceCodeDtoOutput = new UploadBackendSourceCodeDtoOutput(
            uploadBackendSourceCodeDtoInput.deployModelId,
            `/${ownerEmail}/${uploadBackendSourceCodeDtoInput.deployModelId}/${CodeType.BACKEND}/${uploadBackendSourceCodeDtoInput.deployModelId}`
        )

        test("should return bad request http response with DEPLOY_MODEL_DOES_NOT_EXIST api status code", async () => {
            jest.spyOn(uploadBackendSourceCodeUseCase, "execute").mockRejectedValue(new DeployModelDoesNotExistException())

            const httpResponse = await deployModelController.uploadBackendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.badRequest(ApiStatusCode.DEPLOY_MODEL_DOES_NOT_EXIST, "Deploy model does not exist", null))
        })

        test("should return internal server error http response", async () => {
            jest.spyOn(uploadBackendSourceCodeUseCase, "execute").mockRejectedValue(new Error())

            const httpResponse = await deployModelController.uploadBackendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.internalServerError())
        })

        test("should return ok http response", async () => {
            jest.spyOn(uploadBackendSourceCodeUseCase, "execute").mockResolvedValue(uploadBackendSourceCodeDtoOutput)

            const httpResponse = await deployModelController.uploadBackendSourceCode(httpRequest)

            expect(httpResponse).toEqual(HttpResponse.ok("upload executed with success", uploadBackendSourceCodeDtoOutput))
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
})