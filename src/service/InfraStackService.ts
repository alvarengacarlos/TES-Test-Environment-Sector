import {InfraStackRepository} from "../repository/InfraStackRepository";
import {AwsCredentialsService} from "./AwsCredentialsService";
import {AwsCredentialsEntity} from "../entity/AwsCredentialsEntity";
import {TemplateService} from "./TemplateService";
import {TemplateModel} from "../util/TemplateModel";
import {InfraStackEntity} from "../entity/InfraStackEntity";

export class InfraStackService {
    constructor(
        private readonly infraStackRepository: InfraStackRepository,
        private readonly awsCredentialsService: AwsCredentialsService,
        private readonly templateService: TemplateService
    ) {
    }

    async createInfraStack(createInfraStackDtoInput: CreateInfraStackDtoInput): Promise<CreateInfraStackDtoOutput> {
        const findAwsCredentialsOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: createInfraStackDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsOutput.accessKeyId, findAwsCredentialsOutput.secretAccessKey)

        const templateBody = await this.chooseTemplateModel(createInfraStackDtoInput.templateType)

        await this.infraStackRepository.createInfraStack({
            appName: createInfraStackDtoInput.appName,
            awsCredentials: awsCredentials,
            templateBody: templateBody,
            sourceCodePath: createInfraStackDtoInput.sourceCodePath
        })

        return new CreateInfraStackDtoOutput()
    }

    private async chooseTemplateModel(templateType: string): Promise<string> {
        switch (templateType) {
            case TemplateModel.CONTAINER_MODEL:
                const getContainerModelTemplateDtoOutput = await this.templateService.getContainerModelTemplate()
                return getContainerModelTemplateDtoOutput.templateBody
                break
            default:
                throw new Error("Invalid template type")
        }
    }

    async findInfraStacks(findInfraStacksDtoInput: FindInfraStacksDtoInput): Promise<FindInfraStacksDtoOutput> {
        const findAwsCredentialsOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: findInfraStacksDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsOutput.accessKeyId, findAwsCredentialsOutput.secretAccessKey)

        const infraStackEntities = await this.infraStackRepository.findInfraStacks({
            awsCredentials: awsCredentials
        })

        return new FindInfraStacksDtoOutput(infraStackEntities)
    }

    async deleteInfraStack(deleteInfraStackDtoInput: DeleteInfraStackDtoInput): Promise<DeleteInfraStackDtoOutput> {
        const findAwsCredentialsOutput = await this.awsCredentialsService.findAwsCredentials({
            ownerEmail: deleteInfraStackDtoInput.ownerEmail
        })
        const awsCredentials = new AwsCredentialsEntity(findAwsCredentialsOutput.accessKeyId, findAwsCredentialsOutput.secretAccessKey)
        await this.infraStackRepository.deleteInfraStack({
            awsCredentials: awsCredentials,
            stackName: deleteInfraStackDtoInput.stackName
        })
        return new DeleteInfraStackDtoOutput()
    }
}

export class CreateInfraStackDtoInput {
    constructor(
        public readonly appName: string,
        public readonly templateType: TemplateModel,
        public readonly ownerEmail: string,
        public readonly sourceCodePath: string
    ) {
    }
}

export class CreateInfraStackDtoOutput {
    constructor(
    ) {
    }
}

export class FindInfraStacksDtoInput {
    constructor(
        public readonly ownerEmail: string
    ) {
    }
}

export class FindInfraStacksDtoOutput {
    constructor(
        public readonly infraStacks: Array<InfraStackEntity | null>
    ) {
    }
}

export class DeleteInfraStackDtoInput {
    constructor(
        public readonly stackName: string,
        public readonly ownerEmail: string
    ) {
    }
}

export class DeleteInfraStackDtoOutput {
    constructor() {
    }
}