import express from "express"
import {errorHandler} from "./middleware/errorHandler"
import {userRouter} from "./route/userRoute"
import {deployModelRouter} from "./route/deployModelRoute";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(userRouter)
app.use(deployModelRouter)
app.use(errorHandler)

export default app
