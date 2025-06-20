
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    
}

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Conflict',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
    TOO_MANY_REQUESTS: 'Too Many Requests',
    BAD_GATEWAY: 'Bad Gateway',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
    GATEWAY_TIMEOUT: 'Gateway Timeout',
    PRECONDITION_FAILED: 'Precondition Failed',
    PAYLOAD_TOO_LARGE: 'Payload Too Large',
}

class ErrorResponse extends Error {
    status: number;
    
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, status: number = StatusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, status: number = StatusCode.BAD_REQUEST) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, status: number = StatusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND, status: number = StatusCode.NOT_FOUND) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, status: number = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message = ReasonStatusCode.INTERNAL_SERVER_ERROR, status: number = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, status: number = StatusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

export { ErrorResponse, ConflictRequestError, BadRequestError, AuthFailureError, NotFoundError, ForbiddenError, InternalServerError, UnauthorizedError };