import {describe, expect, jest, test} from "@jest/globals";
import {mockDeep} from "jest-mock-extended";

import {GetContainerModelTemplateDtoOutput, TemplateService} from "../../../src/service/TemplateService";
import {TemplateRepository} from "../../../src/repository/TemplateRepository";

describe("TemplateService", () => {
    const templateRepository = mockDeep<TemplateRepository>()
    const templateService = new TemplateService(templateRepository)

    describe("getContainerModelTemplate", () => {
        test("should get template model", async () => {
            const templateBody = "AWSTemplateFormatVersion: \"2010-09-09\"..."
            jest.spyOn(templateRepository, "getContainerModelTemplate").mockResolvedValue(templateBody)

            const output = await templateService.getContainerModelTemplate()

            expect(templateRepository.getContainerModelTemplate).toBeCalledWith()
            expect(output).toEqual(new GetContainerModelTemplateDtoOutput(templateBody))
        })
    })
})