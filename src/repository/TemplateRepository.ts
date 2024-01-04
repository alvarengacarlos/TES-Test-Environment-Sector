export interface TemplateRepository {
    getContainerModelTemplate(): Promise<string>
}
