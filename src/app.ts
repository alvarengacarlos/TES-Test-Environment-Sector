import express from "express"
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";

import {userRouter} from "./route/userRoute"
import {awsCredentialsRouter} from "./route/awsCredentialsRoute";
import {infraStackRouter} from "./route/InfraStackRoute";
import {sourceCodeRoute} from "./route/sourceCodeRoute";
import {errorHandler} from "./middleware/errorHandler"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(awsCredentialsRouter)
app.use(infraStackRouter)
app.use(sourceCodeRoute)
app.use(userRouter)

app.use(errorHandler)

export default app
