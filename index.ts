import awsServerlessExpress from "aws-serverless-express"

import app from "./src/app"

const server = awsServerlessExpress.createServer(app)

export const handler = (event: any, context: any) => {
    awsServerlessExpress.proxy(server, event, context)
}