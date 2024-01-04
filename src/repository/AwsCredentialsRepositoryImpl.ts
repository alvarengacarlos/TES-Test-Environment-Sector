import {
    CreateSecretCommand,
    DeleteSecretCommand,
    GetSecretValueCommand,
    SecretsManagerClient, UpdateSecretCommand
} from "@aws-sdk/client-secrets-manager";

import {
    AwsCredentialsRepository,
    DeleteAwsCredentialsInput,
    FindAwsCredentialsInput,
    SaveAwsCredentialsInput, UpdateAwsCredentialsInput
} from "./AwsCredentialsRepository";
import {Logger} from "../util/Logger";
import {SecretsManagerException} from "../exception/SecretsManagerException";
import {AwsCredentialsEntity} from "../entity/AwsCredentialsEntity";

export class AwsCredentialsRepositoryImpl implements AwsCredentialsRepository {
    constructor(
        private readonly secretsManagerClient: SecretsManagerClient,
    ) {
    }

    async saveAwsCredentials(saveAwsCredentialsInput: SaveAwsCredentialsInput): Promise<void> {
        try {
            Logger.info(this.constructor.name, this.saveAwsCredentials.name, `executing create secret command`)
            const createSecretCommand = new CreateSecretCommand({
                Name: this.generateAwsCredentialsPath(saveAwsCredentialsInput.ownerEmail),
                SecretString: JSON.stringify({
                    accessKeyId: saveAwsCredentialsInput.accessKeyId,
                    secretAccessKey: saveAwsCredentialsInput.secretAccessKey
                }),
            })
            await this.secretsManagerClient.send(createSecretCommand)
            Logger.info(this.constructor.name, this.saveAwsCredentials.name, `create secret command executed with success`)

        } catch (error: any) {
            Logger.error(this.constructor.name, this.saveAwsCredentials.name, `Secrets manager client throw ${error.message}`)
            throw new SecretsManagerException()
        }
    }

    private generateAwsCredentialsPath(ownerEmail: string): string {
        return `${ownerEmail}-awsCredentials`
    }

    async findAwsCredentials(findAwsCredentialsInput: FindAwsCredentialsInput): Promise<AwsCredentialsEntity> {
        try {
            Logger.info(this.constructor.name, this.findAwsCredentials.name, "executing get secret value command")
            const getSecretValueCommand = new GetSecretValueCommand({
                SecretId: this.generateAwsCredentialsPath(findAwsCredentialsInput.ownerEmail)
            })
            const output = await this.secretsManagerClient.send(getSecretValueCommand)

            Logger.info(this.constructor.name, this.findAwsCredentials.name, "get secret value command executed with success")
            const awsCredentials = JSON.parse(String(output?.SecretString))
            return new AwsCredentialsEntity(awsCredentials.accessKeyId, awsCredentials.secretAccessKey)

        } catch (error: any) {
            Logger.error(this.constructor.name, this.findAwsCredentials.name, `Secrets Manager client throw ${error.message}`)
            throw new SecretsManagerException()
        }
    }

    async updateAwsCredentials(updateAwsCredentialsInput: UpdateAwsCredentialsInput): Promise<void> {
        try {
            Logger.info(this.constructor.name, this.updateAwsCredentials.name, `executing update secret command`)
            const updateSecretCommand = new UpdateSecretCommand({
                SecretId: this.generateAwsCredentialsPath(updateAwsCredentialsInput.ownerEmail),
                SecretString: JSON.stringify({
                    accessKeyId: updateAwsCredentialsInput.accessKeyId,
                    secretAccessKey: updateAwsCredentialsInput.secretAccessKey
                }),
            })
            await this.secretsManagerClient.send(updateSecretCommand)
            Logger.info(this.constructor.name, this.updateAwsCredentials.name, `update secret command executed with success`)

        } catch (error: any) {
            Logger.error(this.constructor.name, this.updateAwsCredentials.name, `Secrets manager client throw ${error.message}`)
            throw new SecretsManagerException()
        }
    }

    async deleteAwsCredentials(deleteAwsCredentialsInput: DeleteAwsCredentialsInput): Promise<void> {
        try {
            Logger.info(this.constructor.name, this.deleteAwsCredentials.name, "executing delete secret command")
            const deleteSecretCommand = new DeleteSecretCommand({
                SecretId: this.generateAwsCredentialsPath(deleteAwsCredentialsInput.ownerEmail),
                ForceDeleteWithoutRecovery: true
            })
            await this.secretsManagerClient.send(deleteSecretCommand)
            Logger.info(this.constructor.name, this.deleteAwsCredentials.name, "delete secret command executed with success")

        } catch (error: any) {
            Logger.error(this.constructor.name, this.deleteAwsCredentials.name, `Secrets Manager client throw ${error.message}`)
            throw new SecretsManagerException()
        }
    }
}