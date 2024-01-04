import {describe, expect, test} from "@jest/globals";
import {mockClient} from "aws-sdk-client-mock";
import {GetObjectCommand} from "@aws-sdk/client-s3";

import {TemplateRepositoryImpl} from "../../../src/repository/TemplateRepositoryImpl";
import {s3Client} from "../../../src/infra/s3Client";
import {S3Exception} from "../../../src/exception/S3Exception";

describe("TemplateRepositoryImpl", () => {
    const s3ClientMock = mockClient(s3Client)
    const templateRepository = new TemplateRepositoryImpl(s3Client)

    describe("getContainerModelTemplate", () => {
        test("should throw S3Exception", async () => {
            s3ClientMock.on(GetObjectCommand).rejects(new Error())

            await expect(templateRepository.getContainerModelTemplate()).rejects.toThrow(S3Exception)
        })

        test("should get container model template", async () => {
            const template = "AWSTemplateFormatVersion: \"2010-09-09\"..."
            s3ClientMock.on(GetObjectCommand).callsFake(() => {
                return {
                    Body: {
                        transformToString: () => template
                    }
                }
            })

            const output = await templateRepository.getContainerModelTemplate()

            expect(output).toEqual(template)
        })
    })
})