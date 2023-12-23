import {ErrorRequestHandler} from "express";
import {HttpResponse} from "../util/HttpResponse";
import {Logger} from "../util/Logger";

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    Logger.error("errorHandler", "errorHandler", error.message)
    const httpResponse = HttpResponse.internalServerError()
    response.status(httpResponse.httpStatusCode).json(httpResponse.body)
}
