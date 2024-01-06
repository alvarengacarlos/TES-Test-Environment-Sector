import { Request, Response, NextFunction } from "express"

export function setTokenInformations(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    request.headers.requesterEmail =
        request.apiGateway?.event?.requestContext?.authorizer?.claims?.email

    next()
}
