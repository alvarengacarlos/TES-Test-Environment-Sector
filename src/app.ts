import express from "express"
import {errorHandler} from "./middleware/errorHandler"
import {userRouter} from "./route/userRoute"

const app = express()
app.use(express.json())
app.use(userRouter)
app.use(errorHandler)

export default app
