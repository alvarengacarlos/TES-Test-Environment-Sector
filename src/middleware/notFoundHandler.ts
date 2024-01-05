import {Request, Response, NextFunction} from "express";
import {HttpResponse} from "../util/HttpResponse";

export function notFoundHandler(request: Request, response: Response, next: NextFunction) {
    const httpResponse = HttpResponse.notFound()
    response.status(httpResponse.httpStatusCode).json(httpResponse.body)
}