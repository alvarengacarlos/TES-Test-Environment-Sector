import { describe, expect, test } from "@jest/globals"
import { mockClient } from "aws-sdk-client-mock"
import {
    CreateBucketCommand,
    DeleteObjectCommand,
    ListBucketsCommand,
    ListObjectsCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3"
import { faker } from "@faker-js/faker"

import { SourceCodeRepositoryImpl } from "../../../src/repository/SourceCodeRepositoryImpl"
import { s3Client } from "../../../src/infra/s3Client"
import { AwsCredentialsEntity } from "../../../src/entity/AwsCredentialsEntity"
import { S3Exception } from "../../../src/exception/S3Exception"

describe("SourceCodeRepositoryImpl", () => {
    const s3ClientMocked = mockClient(s3Client)

    function getS3ClientWithCredentialsMock() {
        return s3Client
    }

    const sourceCodeRepository = new SourceCodeRepositoryImpl(
        getS3ClientWithCredentialsMock,
    )

    const accessKeyId = "00000000000000000000"
    const secretAccessKey = "0000000000000000000000000000000000000000"
    const email = faker.internet.email()

    describe("uploadSourceCode", () => {
        const uploadSourceCodeInput = {
            appName: faker.animal.cat(),
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
            ownerEmail: email,
            bufferedSourceCode: Buffer.from(""),
        }

        test("should try verify if source code storage exists and throw S3Exception", async () => {
            s3ClientMocked.on(ListBucketsCommand).rejects(new Error())

            await expect(
                sourceCodeRepository.uploadSourceCode(uploadSourceCodeInput),
            ).rejects.toThrow(S3Exception)
        })

        test("should try create source code storage and throw S3Exception", async () => {
            s3ClientMocked.on(ListBucketsCommand).resolves({
                Buckets: [],
            })
            s3ClientMocked.on(CreateBucketCommand).rejects(new Error())

            await expect(
                sourceCodeRepository.uploadSourceCode(uploadSourceCodeInput),
            ).rejects.toThrow(S3Exception)
        })

        test("should try upload source code and throw S3Exception", async () => {
            s3ClientMocked.on(ListBucketsCommand).resolves({
                Buckets: [],
            })
            s3ClientMocked.on(CreateBucketCommand).resolves({})
            s3ClientMocked.on(PutObjectCommand).rejects(new Error())

            await expect(
                sourceCodeRepository.uploadSourceCode(uploadSourceCodeInput),
            ).rejects.toThrow(S3Exception)
        })

        test("should create a source code storage and upload source code", async () => {
            s3ClientMocked.on(ListBucketsCommand).resolves({
                Buckets: [],
            })
            s3ClientMocked.on(CreateBucketCommand).resolves({})
            s3ClientMocked.on(PutObjectCommand).resolves({})

            await expect(
                sourceCodeRepository.uploadSourceCode(uploadSourceCodeInput),
            ).resolves.not.toThrow(S3Exception)
        })

        test("should upload source code", async () => {
            s3ClientMocked.on(ListBucketsCommand).resolves({
                Buckets: [
                    {
                        Name: "source-code-s3-bucket",
                    },
                ],
            })
            s3ClientMocked.on(PutObjectCommand).resolves({})

            await expect(
                sourceCodeRepository.uploadSourceCode(uploadSourceCodeInput),
            ).resolves.not.toThrow(S3Exception)
        })
    })

    describe("findSourceCodes", () => {
        const findSourceCodesInput = {
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
        }

        test("should throw S3Exception", async () => {
            s3ClientMocked.on(ListObjectsCommand).rejects(new Error())

            await expect(
                sourceCodeRepository.findSourceCodes(findSourceCodesInput),
            ).rejects.toThrow(S3Exception)
        })

        test("should find source codes", async () => {
            s3ClientMocked.on(ListObjectsCommand).resolves({
                Contents: [
                    {
                        Key: `${email}-${faker.animal.cat()}-sourceCode.zip`,
                    },
                ],
            })

            await expect(
                sourceCodeRepository.findSourceCodes(findSourceCodesInput),
            ).resolves.not.toThrow(S3Exception)
        })
    })

    describe("deleteSourceCode", () => {
        const deleteSourceCodeInput = {
            awsCredentials: new AwsCredentialsEntity(
                accessKeyId,
                secretAccessKey,
            ),
            sourceCodePath: `${email}-${faker.animal.cat()}-sourceCode.zip`,
        }

        test("should throw S3Exception", async () => {
            s3ClientMocked.on(DeleteObjectCommand).rejects(new Error())

            await expect(
                sourceCodeRepository.deleteSourceCode(deleteSourceCodeInput),
            ).rejects.toThrow(S3Exception)
        })

        test("should delete source code", async () => {
            s3ClientMocked.on(DeleteObjectCommand).resolves({})

            await expect(
                sourceCodeRepository.deleteSourceCode(deleteSourceCodeInput),
            ).resolves.not.toThrow(S3Exception)
        })
    })
})
