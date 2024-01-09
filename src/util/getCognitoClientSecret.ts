import {
    CognitoIdentityProviderClient,
    DescribeUserPoolClientCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { Logger } from "./Logger"

export async function getCognitoClientSecret(): Promise<string> {
    if (process.env.COGNITO_CLIENT_SECRET != "") {
        Logger.info(
            "getCognitoClientSecret",
            "getCognitoClientSecret",
            "cognito client secret got with success",
        )
        return String(process.env.COGNITO_CLIENT_SECRET)
    }

    const cognitoClient = new CognitoIdentityProviderClient()

    const describeUserPoolClientCommand = new DescribeUserPoolClientCommand({
        UserPoolId: String(process.env.COGNITO_USER_POOL_ID),
        ClientId: String(process.env.COGNITO_CLIENT_ID),
    })

    Logger.info(
        "getCognitoClientSecret",
        "getCognitoClientSecret",
        "getting cognito client secret",
    )
    const response = await cognitoClient.send(describeUserPoolClientCommand)

    if (response.UserPoolClient?.ClientSecret) {
        Logger.info(
            "getCognitoClientSecret",
            "getCognitoClientSecret",
            "cognito client secret got with success",
        )
        process.env.COGNITO_CLIENT_SECRET = response.UserPoolClient.ClientSecret
        return process.env.COGNITO_CLIENT_SECRET
    } else {
        Logger.warn(
            "getCognitoClientSecret",
            "getCognitoClientSecret",
            "cognito client secret not found",
        )
        throw new Error("cognito client secret not found")
    }
}
