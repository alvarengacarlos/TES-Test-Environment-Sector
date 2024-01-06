import { TemplateRepository } from "./TemplateRepository"
import { Logger } from "../util/Logger"
import {
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client,
} from "@aws-sdk/client-s3"
import { S3Exception } from "../exception/S3Exception"

export class TemplateRepositoryImpl implements TemplateRepository {
    constructor(private readonly s3Client: S3Client) {}

    async getContainerModelTemplate(): Promise<string> {
        try {
            Logger.info(
                this.constructor.name,
                this.getContainerModelTemplate.name,
                "executing get object command",
            )
            const getObjectCommand = new GetObjectCommand({
                Bucket: String(process.env.TES_S3_BUCKET_NAME),
                Key: "ContainerModel.yaml",
            })

            const output: GetObjectCommandOutput =
                await this.s3Client.send(getObjectCommand)
            Logger.info(
                this.constructor.name,
                this.getContainerModelTemplate.name,
                "get object command executed with success",
            )
            return String(await output.Body?.transformToString())
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.getContainerModelTemplate.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }
}
