import { S3Client } from "@aws-sdk/client-s3"

export const s3Client = new S3Client()

export function getS3ClientWithCredentials(
    accessKeyId: string,
    secretAccessKey: string,
): S3Client {
    return new S3Client({
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    })
}
