export class HttpResponse<T> {
    public readonly httpStatusCode: HttpStatusCode
    public readonly body: {
        apiStatusCode: ApiStatusCode,
        message: string,
        data?: T | null
    }

    constructor(
        httpStatusCode: HttpStatusCode,
        apiStatusCode: ApiStatusCode,
        message: string,
        data?: T | null
    ) {
        this.httpStatusCode = httpStatusCode
        this.body = {
            apiStatusCode: apiStatusCode,
            message: message,
            data: data
        }
    }

    static ok<T>(message: string, data: T): HttpResponse<T> {
        return new HttpResponse<T>(HttpStatusCode.OK, ApiStatusCode.SUCCESS, message, data)
    }

    static created<T>(message: string, data: T): HttpResponse<T> {
        return new HttpResponse<T>(HttpStatusCode.CREATED, ApiStatusCode.SUCCESS, message, data)
    }

    static badRequest<T>(apiStatusCode: ApiStatusCode, message: string, data: T): HttpResponse<T> {
        return new HttpResponse<T>(HttpStatusCode.BAD_REQUEST, apiStatusCode, message, data)
    }

    static conflict<T>(apiStatusCode: ApiStatusCode, message: string, data: T): HttpResponse<T> {
        return new HttpResponse<T>(HttpStatusCode.CONFLICT, apiStatusCode, message, data)
    }

    static internalServerError(): HttpResponse<null> {
        return new HttpResponse<null>(HttpStatusCode.INTERNAL_SERVER_ERROR, ApiStatusCode.INTERNAL_ERROR, "Internal server error", null)
    }
}

enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export enum ApiStatusCode {
    SUCCESS = "SUCCESS",
    INVALID_INPUT = "INVALID_INPUT",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    EMAIL_EXISTS = "EMAIL_EXISTS",
    EXPIRED_CONFIRMATION_CODE = "EXPIRED_CONFIRMATION_CODE",
    INVALID_CONFIRMATION_CODE = "INVALID_CONFIRMATION_CODE",
    INCORRECT_EMAIL_OR_PASSWORD = "INCORRECT_EMAIL_OR_PASSWORD",
    EMAIL_NOT_CONFIRMED = "EMAIL_NOT_CONFIRMED",
    DEPLOY_MODEL_DOES_NOT_EXIST = "DEPLOY_MODEL_DOES_NOT_EXIST",
    AWS_CREDENTIALS_CONFIGURATION_MISSING="AWS_CREDENTIALS_CONFIGURATION_MISSING",
}