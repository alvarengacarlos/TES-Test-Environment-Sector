import {PrismaClient} from "@prisma/client";

import {CreateDeployModelDtoInput, CreateDeployModelDtoOutput} from "../use-case/CreateDeployModelUseCase";
import {DeployModelRepository} from "./DeployModelRepository";
import {Logger} from "../util/Logger";

export class DeployModelRepositoryImpl implements DeployModelRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) {
    }

    async saveDeployModel(createDeployModelDtoInput: CreateDeployModelDtoInput): Promise<CreateDeployModelDtoOutput> {
        try {
            Logger.info(this.constructor.name, this.saveDeployModel.name, "saving deploy model")
            await this.prismaClient.$connect()
            const result = await this.prismaClient.deployModel.create({
                data: createDeployModelDtoInput
            })

            Logger.info(this.constructor.name, this.saveDeployModel.name, "deploy model saved with success")
            return new CreateDeployModelDtoOutput(
                result.id,
                result.deployModelName,
                result.deployModelType,
                result.databaseType,
                result.executionEnvironment,
                result.ownerEmail
            )


        } catch (error: any) {
            Logger.error(this.constructor.name, this.saveDeployModel.name, `Prisma client throw ${error.message}`)
            throw new Error("Database exception")

        } finally {
            await this.prismaClient.$disconnect()
        }
    }
}