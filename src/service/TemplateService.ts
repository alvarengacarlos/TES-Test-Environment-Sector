import {TemplateRepository} from "../repository/TemplateRepository";

export class TemplateService {
    constructor(
        private readonly templateRepository: TemplateRepository
    ) {
    }

    async getContainerModelTemplate(): Promise<GetContainerModelTemplateDtoOutput> {
        const templateBody = await this.templateRepository.getContainerModelTemplate()
        return new GetContainerModelTemplateDtoOutput(templateBody)
    }
}

export class GetContainerModelTemplateDtoOutput {
    constructor(
        public readonly templateBody: string
    ) {
    }
}