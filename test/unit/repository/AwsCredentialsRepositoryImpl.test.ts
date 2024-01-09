import { describe, expect, test } from "@jest/globals"
import { faker } from "@faker-js/faker"
import { mockClient } from "aws-sdk-client-mock"
import {
    CreateSecretCommand,
    DeleteSecretCommand,
    GetSecretValueCommand,
    ResourceNotFoundException,
    UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager"

import { AwsCredentialsRepositoryImpl } from "../../../src/repository/AwsCredentialsRepositoryImpl"
import { secretsManagerClient } from "../../../src/infra/secretsManagerClient"
import { SecretsManagerException } from "../../../src/exception/SecretsManagerException"
import { AwsCredentialsDoesNotExistException } from "../../../src/exception/AwsCredentialsDoesNotExistException"

describe("AwsCredentialsRepositoryImpl", () => {
    const secretsManagerClientMocked = mockClient(secretsManagerClient)
    const awsCredentialsRepository = new AwsCredentialsRepositoryImpl(
        secretsManagerClient,
    )

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("saveAwsCredentials", () => {
        const saveAwsCredentialsInput = {
            ownerEmail: email,
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        }

        test("should throw SecretsManagerException", async () => {
            secretsManagerClientMocked
                .on(CreateSecretCommand)
                .rejects(new Error())

            await expect(
                awsCredentialsRepository.saveAwsCredentials(
                    saveAwsCredentialsInput,
                ),
            ).rejects.toThrow(SecretsManagerException)
        })

        test("should save aws credentials", async () => {
            secretsManagerClientMocked.on(CreateSecretCommand).resolves({})

            await expect(
                awsCredentialsRepository.saveAwsCredentials(
                    saveAwsCredentialsInput,
                ),
            ).resolves.not.toThrow(SecretsManagerException)
        })
    })

    describe("findAwsCredentials", () => {
        const findAwsCredentialsInput = {
            ownerEmail: email,
        }

        test("should throw AwsCredentialsDoesNotExistException", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).rejects(
                new ResourceNotFoundException({
                    message: "",
                    $metadata: {},
                }),
            )

            await expect(
                awsCredentialsRepository.findAwsCredentials(
                    findAwsCredentialsInput,
                ),
            ).rejects.toThrow(AwsCredentialsDoesNotExistException)
        })

        test("should throw SecretsManagerException", async () => {
            secretsManagerClientMocked
                .on(GetSecretValueCommand)
                .rejects(new Error())

            await expect(
                awsCredentialsRepository.findAwsCredentials(
                    findAwsCredentialsInput,
                ),
            ).rejects.toThrow(SecretsManagerException)
        })

        test("should find aws credentials", async () => {
            secretsManagerClientMocked.on(GetSecretValueCommand).resolves({
                SecretString: JSON.stringify({
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                }),
            })

            await expect(
                awsCredentialsRepository.findAwsCredentials(
                    findAwsCredentialsInput,
                ),
            ).resolves.not.toThrow(SecretsManagerException)
        })
    })

    describe("updateAwsCredentials", () => {
        const updateAwsCredentialsInput = {
            ownerEmail: email,
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        }

        test("should throw SecretsManagerException", async () => {
            secretsManagerClientMocked
                .on(UpdateSecretCommand)
                .rejects(new Error())

            await expect(
                awsCredentialsRepository.updateAwsCredentials(
                    updateAwsCredentialsInput,
                ),
            ).rejects.toThrow(SecretsManagerException)
        })

        test("should update aws credentials", async () => {
            secretsManagerClientMocked.on(UpdateSecretCommand).resolves({})

            await expect(
                awsCredentialsRepository.updateAwsCredentials(
                    updateAwsCredentialsInput,
                ),
            ).resolves.not.toThrow(SecretsManagerException)
        })
    })

    describe("deleteAwsCredentials", () => {
        const deleteAwsCredentialsInput = {
            ownerEmail: email,
        }

        test("should throw SecretsManagerException", async () => {
            secretsManagerClientMocked
                .on(DeleteSecretCommand)
                .rejects(new Error())

            await expect(
                awsCredentialsRepository.deleteAwsCredentials(
                    deleteAwsCredentialsInput,
                ),
            ).rejects.toThrow(SecretsManagerException)
        })

        test("should delete aws credentials", async () => {
            secretsManagerClientMocked.on(DeleteSecretCommand).resolves({})

            await expect(
                awsCredentialsRepository.deleteAwsCredentials(
                    deleteAwsCredentialsInput,
                ),
            ).resolves.not.toThrow(SecretsManagerException)
        })
    })
})
