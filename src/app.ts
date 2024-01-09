import express from "express"
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit";

import {userRouter} from "./route/userRoute"
import {awsCredentialsRouter} from "./route/awsCredentialsRoute";
import {infraStackRouter} from "./route/InfraStackRoute";
import {sourceCodeRoute} from "./route/sourceCodeRoute";
import {errorHandler} from "./middleware/errorHandler"
import {notFoundHandler} from "./middleware/notFoundHandler";


const fifteenMinutesInMilliseconds = 15 * 60 * 1000
const limiter = rateLimit({
    windowMs: fifteenMinutesInMilliseconds,
    limit: 100,
})

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(helmet())
app.use(cors())
app.use(limiter)

app.use(awsCredentialsRouter)
app.use(infraStackRouter)
app.use(sourceCodeRoute)
app.use(userRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
