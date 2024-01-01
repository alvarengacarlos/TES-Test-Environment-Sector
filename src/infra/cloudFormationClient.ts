import {CloudFormationClient} from "@aws-sdk/client-cloudformation";

export const cloudFormationClient = new CloudFormationClient()

export function getCloudFormationClientWithCredentials(accessKeyId: string, secretAccessKey: string): CloudFormationClient {
    return new CloudFormationClient({
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        }
    })
}