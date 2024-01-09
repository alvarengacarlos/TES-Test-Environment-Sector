import { AwsCredentialsEntity } from "../entity/AwsCredentialsEntity"

export interface AwsCredentialsRepository {
    saveAwsCredentials(
        saveAwsCredentialsInput: SaveAwsCredentialsInput,
    ): Promise<void>
    findAwsCredentials(
        findAwsCredentialsInput: FindAwsCredentialsInput,
    ): Promise<AwsCredentialsEntity>
    updateAwsCredentials(
        updateAwsCredentialsInput: UpdateAwsCredentialsInput,
    ): Promise<void>
    deleteAwsCredentials(
        deleteAwsCredentialsInput: DeleteAwsCredentialsInput,
    ): Promise<void>
}

export type SaveAwsCredentialsInput = {
    ownerEmail: string
    accessKeyId: string
    secretAccessKey: string
}

export type FindAwsCredentialsInput = {
    ownerEmail: string
}

export type UpdateAwsCredentialsInput = {
    ownerEmail: string
    accessKeyId: string
    secretAccessKey: string
}

export type DeleteAwsCredentialsInput = {
    ownerEmail: string
}
