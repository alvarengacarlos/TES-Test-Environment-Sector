import {
    InfraStackRepository, CreateInfraStackInput, DeleteInfraStackInput, FindInfraStacksInput,
} from "./InfraStackRepository";
import {getCloudFormationClientWithCredentials} from "../infra/cloudFormationClient";
import {Logger} from "../util/Logger";
import {CreateStackCommand, DeleteStackCommand, DescribeStacksCommand} from "@aws-sdk/client-cloudformation";
import {CloudFormationException} from "../exception/CloudFormationException";
import {randomUUID} from "crypto";
import {InfraStackEntity} from "../entity/InfraStackEntity";

export class InfraStackRepositoryImpl implements InfraStackRepository {
    constructor(
        private readonly getCloudFormationClient = getCloudFormationClientWithCredentials
    ) {
    }

    async createInfraStack(createInfraStackInput: CreateInfraStackInput): Promise<void> {
        try {
            Logger.info(this.constructor.name, this.createInfraStack.name, `executing create stack command`)
            const cloudFormationClient = this.getCloudFormationClient(
                createInfraStackInput.awsCredentials.accessKeyId,
                createInfraStackInput.awsCredentials.secretAccessKey
            )
            const createStackCommand = new CreateStackCommand({
                StackName: `tes-cloudformation-stack-${createInfraStackInput.appName}`,
                TemplateBody: createInfraStackInput.templateBody,
                Parameters: [
                    {
                        ParameterKey: "SourceCodePath",
                        ParameterValue: createInfraStackInput.sourceCodePath
                    }
                ],
                Capabilities: ["CAPABILITY_IAM"],
                OnFailure: "DELETE"
            })

            await cloudFormationClient.send(createStackCommand)
            Logger.info(this.constructor.name, this.createInfraStack.name, `create stack command executed with success`)
        } catch (error: any) {
            Logger.error(this.constructor.name, this.createInfraStack.name, `CloudFormation client throw ${error.message}`)
            throw new CloudFormationException()
        }
    }

    async findInfraStacks(findInfraStacksInput: FindInfraStacksInput): Promise<Array<InfraStackEntity | null>> {
        try {
            Logger.info(this.constructor.name, this.findInfraStacks.name, "executing describe stack command")
            const cloudFormationClient = this.getCloudFormationClient(
                findInfraStacksInput.awsCredentials.accessKeyId,
                findInfraStacksInput.awsCredentials.secretAccessKey
            )
            const describeStackCommand = new DescribeStacksCommand({})
            const output = await cloudFormationClient.send(describeStackCommand)

            if (!output.Stacks) {
                throw new Error("Stacks undefined")
            }

            Logger.info(this.constructor.name, this.findInfraStacks.name, "describe stack command executed with success")

            if (output.Stacks.length == 0) {
                return []
            }

            return output.Stacks.filter((stack) => {
                if (String(stack.StackName).includes("tes-cloudformation-stack")) {
                    return stack
                }
            }).map((stack) => {
                return new InfraStackEntity(
                    String(stack.StackId),
                    String(stack.StackName),
                    String(stack.StackStatus)
                )
            })

        } catch (error: any) {
            Logger.error(this.constructor.name, this.findInfraStacks.name, `CloudFormation client throw ${error.message}`)
            throw new CloudFormationException()
        }
    }

    async deleteInfraStack(deleteInfraStackInput: DeleteInfraStackInput): Promise<void> {
        try {
            Logger.info(this.constructor.name, this.deleteInfraStack.name, `executing delete stack command`)
            const cloudFormationClient = this.getCloudFormationClient(
                deleteInfraStackInput.awsCredentials.accessKeyId,
                deleteInfraStackInput.awsCredentials.secretAccessKey
            )
            const deleteStackCommand = new DeleteStackCommand({
                StackName: deleteInfraStackInput.stackName,
            })

            await cloudFormationClient.send(deleteStackCommand)
            Logger.info(this.constructor.name, this.deleteInfraStack.name, `delete stack command executed with success`)
        } catch (error: any) {
            Logger.error(this.constructor.name, this.deleteInfraStack.name, `CloudFormation client throw ${error.message}`)
            throw new CloudFormationException()
        }
    }
}