import {
    CreateBucketCommand,
    DeleteObjectCommand,
    ListBucketsCommand,
    ListObjectsCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"

import {
    DeleteSourceCodeInput,
    FindSourceCodesInput,
    SourceCodeRepository,
    UploadSourceCodeInput,
} from "./SourceCodeRepository"
import { getS3ClientWithCredentials } from "../infra/s3Client"
import { Logger } from "../util/Logger"
import { S3Exception } from "../exception/S3Exception"
import { SourceCodeEntity } from "../entity/SourceCodeEntity"

export class SourceCodeRepositoryImpl implements SourceCodeRepository {
    private readonly bucketName = "source-code-s3-bucket"

    constructor(private readonly getS3Client = getS3ClientWithCredentials) {}

    async uploadSourceCode(
        uploadSourceCodeInput: UploadSourceCodeInput,
    ): Promise<void> {
        const s3Client = this.getS3Client(
            uploadSourceCodeInput.awsCredentials.accessKeyId,
            uploadSourceCodeInput.awsCredentials.secretAccessKey,
        )

        const sourceCodeStorageExists =
            await this.sourceCodeStorageExists(s3Client)
        if (!sourceCodeStorageExists) {
            await this.createSourceCodeStorage(s3Client)
        }

        try {
            Logger.info(
                this.constructor.name,
                this.uploadSourceCode.name,
                "executing put object command",
            )

            const putObjectCommand = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: `${uploadSourceCodeInput.ownerEmail}-${uploadSourceCodeInput.appName}-sourceCode.zip`,
                Body: uploadSourceCodeInput.bufferedSourceCode,
            })

            await s3Client.send(putObjectCommand)
            Logger.info(
                this.constructor.name,
                this.uploadSourceCode.name,
                "put object command executed with success",
            )
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.uploadSourceCode.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }

    private async sourceCodeStorageExists(
        s3Client: S3Client,
    ): Promise<boolean> {
        try {
            Logger.info(
                this.constructor.name,
                this.sourceCodeStorageExists.name,
                "executing list buckets command",
            )
            const listBucketsCommand = new ListBucketsCommand({})
            const output = await s3Client.send(listBucketsCommand)
            if (!output.Buckets) {
                throw new Error("Buckets undefined")
            }

            Logger.info(
                this.constructor.name,
                this.sourceCodeStorageExists.name,
                "list buckets command executed with success",
            )
            if (output.Buckets.find((obj) => obj.Name == this.bucketName)) {
                return true
            }

            return false
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.sourceCodeStorageExists.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }

    private async createSourceCodeStorage(s3Client: S3Client): Promise<void> {
        try {
            Logger.info(
                this.constructor.name,
                this.createSourceCodeStorage.name,
                "executing create bucket command",
            )
            const createBucketCommand = new CreateBucketCommand({
                Bucket: this.bucketName,
            })
            await s3Client.send(createBucketCommand)
            Logger.info(
                this.constructor.name,
                this.createSourceCodeStorage.name,
                "create bucket command executed with success",
            )
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.createSourceCodeStorage.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }

    async findSourceCodes(
        findSourceCodesInput: FindSourceCodesInput,
    ): Promise<Array<SourceCodeEntity | null>> {
        try {
            Logger.info(
                this.constructor.name,
                this.findSourceCodes.name,
                "executing list objects command",
            )
            const s3Client = this.getS3Client(
                findSourceCodesInput.awsCredentials.accessKeyId,
                findSourceCodesInput.awsCredentials.secretAccessKey,
            )
            const listObjectsCommand = new ListObjectsCommand({
                Bucket: this.bucketName,
            })

            const output = await s3Client.send(listObjectsCommand)
            Logger.info(
                this.constructor.name,
                this.findSourceCodes.name,
                "list objects command executed with success",
            )

            if (!output.Contents || output.Contents.length == 0) {
                return []
            }

            return output.Contents.map((object) => {
                return new SourceCodeEntity(String(object.Key))
            })
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.findSourceCodes.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }

    async deleteSourceCode(
        deleteSourceCodeInput: DeleteSourceCodeInput,
    ): Promise<void> {
        try {
            Logger.info(
                this.constructor.name,
                this.deleteSourceCode.name,
                "executing delete object command",
            )
            const s3Client = this.getS3Client(
                deleteSourceCodeInput.awsCredentials.accessKeyId,
                deleteSourceCodeInput.awsCredentials.secretAccessKey,
            )
            const deleteObjectCommand = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: deleteSourceCodeInput.sourceCodePath,
            })
            await s3Client.send(deleteObjectCommand)
            Logger.info(
                this.constructor.name,
                this.deleteSourceCode.name,
                "delete object command executed with success",
            )
        } catch (error: any) {
            Logger.error(
                this.constructor.name,
                this.deleteSourceCode.name,
                `S3 client throw ${error.message}`,
            )
            throw new S3Exception()
        }
    }
}
