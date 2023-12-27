import {createHmac} from "crypto";
import {Logger} from "./Logger";
import {getCognitoClientSecret} from "./getCognitoClientSecret";

export async function createCognitoSecretHash(username: string): Promise<string> {
    Logger.info("createCognitoSecretHash", "createCognitoSecretHash", "creating cognito secret hash")
    const cognitoClientSecret = await getCognitoClientSecret()

    Logger.info("createCognitoSecretHash", "createCognitoSecretHash", "creating hmac hash")
    const hash = createHmac("sha256", cognitoClientSecret)

    Logger.info("createCognitoSecretHash", "createCognitoSecretHash", "updating hmac hash")
    hash.update(`${username}${String(process.env.COGNITO_CLIENT_ID)}`)

    Logger.info("createCognitoSecretHash", "createCognitoSecretHash", "making digest")
    const secretHash = hash.digest("base64")

    Logger.info("createCognitoSecretHash", "createCognitoSecretHash", "cognito secret hash created with success")
    return secretHash
}
