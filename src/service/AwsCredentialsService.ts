import { AwsCredentialsRepository } from "../repository/AwsCredentialsRepository"
import { AwsCredentialsDoesNotExistException } from "../exception/AwsCredentialsDoesNotExistException"

export class AwsCredentialsService {
    constructor(
        private readonly awsCredentialsRepository: AwsCredentialsRepository,
    ) {}

    async saveAwsCredentials(
        saveAwsCredentialsDtoInput: SaveAwsCredentialsDtoInput,
    ): Promise<SaveAwsCredentialsDtoOutput> {
        await this.awsCredentialsRepository.saveAwsCredentials({
            ownerEmail: saveAwsCredentialsDtoInput.ownerEmail,
            accessKeyId: saveAwsCredentialsDtoInput.accessKeyId,
            secretAccessKey: saveAwsCredentialsDtoInput.secretAccessKey,
        })

        return new SaveAwsCredentialsDtoOutput()
    }

    async findAwsCredentials(
        findAwsCredentialsDtoInput: FindAwsCredentialsDtoInput,
    ): Promise<FindAwsCredentialsDtoOutput> {
        const awsCredentials =
            await this.awsCredentialsRepository.findAwsCredentials({
                ownerEmail: findAwsCredentialsDtoInput.ownerEmail,
            })
        return new FindAwsCredentialsDtoOutput(
            awsCredentials.accessKeyId,
            awsCredentials.secretAccessKey,
        )
    }

    async awsCredentialsExists(
        awsCredentialsExistsDtoInput: AwsCredentialsExistsDtoInput,
    ): Promise<AwsCredentialsExistsDtoOutput> {
        try {
            await this.awsCredentialsRepository.findAwsCredentials({
                ownerEmail: awsCredentialsExistsDtoInput.ownerEmail,
            })
            return new AwsCredentialsExistsDtoOutput(true)
        } catch (error: any) {
            if (error instanceof AwsCredentialsDoesNotExistException) {
                return new AwsCredentialsExistsDtoOutput(false)
            }
            throw error
        }
    }

    async updateAwsCredentials(
        updateAwsCredentialsDtoInput: UpdateAwsCredentialsDtoInput,
    ): Promise<UpdateAwsCredentialsDtoOutput> {
        await this.awsCredentialsRepository.updateAwsCredentials({
            ownerEmail: updateAwsCredentialsDtoInput.ownerEmail,
            accessKeyId: updateAwsCredentialsDtoInput.accessKeyId,
            secretAccessKey: updateAwsCredentialsDtoInput.secretAccessKey,
        })

        return new UpdateAwsCredentialsDtoOutput()
    }

    async deleteAwsCredentials(
        deleteAwsCredentialsDtoOutput: DeleteAwsCredentialsDtoInput,
    ): Promise<DeleteAwsCredentialsDtoOutput> {
        await this.awsCredentialsRepository.deleteAwsCredentials({
            ownerEmail: deleteAwsCredentialsDtoOutput.ownerEmail,
        })
        return new DeleteAwsCredentialsDtoOutput()
    }
}

export class SaveAwsCredentialsDtoInput {
    constructor(
        public readonly ownerEmail: string,
        public readonly accessKeyId: string,
        public readonly secretAccessKey: string,
    ) {}
}

export class SaveAwsCredentialsDtoOutput {
    constructor() {}
}

export class FindAwsCredentialsDtoInput {
    constructor(public readonly ownerEmail: string) {}
}

export class FindAwsCredentialsDtoOutput {
    constructor(
        public readonly accessKeyId: string,
        public readonly secretAccessKey: string,
    ) {}
}

export class AwsCredentialsExistsDtoInput {
    constructor(public readonly ownerEmail: string) {}
}

export class AwsCredentialsExistsDtoOutput {
    constructor(public readonly exists: boolean) {}
}

export class UpdateAwsCredentialsDtoInput {
    constructor(
        public readonly ownerEmail: string,
        public readonly accessKeyId: string,
        public readonly secretAccessKey: string,
    ) {}
}

export class UpdateAwsCredentialsDtoOutput {
    constructor() {}
}

export class DeleteAwsCredentialsDtoInput {
    constructor(public readonly ownerEmail: string) {}
}

export class DeleteAwsCredentialsDtoOutput {
    constructor() {}
}
