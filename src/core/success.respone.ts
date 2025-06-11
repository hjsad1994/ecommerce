import { Response } from 'express';

const StatusCode = {
    // 2xx Success
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
} as const;

const ReasonStatusCode = {
    SUCCESS: 'Success',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No Content',
} as const;

interface SuccessResponseData {
    message?: string;
    metadata?: any;
    options?: any;
}

class SuccessResponse {
    message: string;
    status: number;
    metadata: any;
    options: any;

    constructor({ message, statusCode = StatusCode.SUCCESS, reasonStatusCode = ReasonStatusCode.SUCCESS, metadata = {} }: {
        message?: string;
        statusCode?: number;
        reasonStatusCode?: string;
        metadata?: any;
    }) {
        this.message = message || reasonStatusCode;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res: Response, headers: Record<string, string> = {}): Response {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }: SuccessResponseData = {}) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata, options }: SuccessResponseData = {}) {
        super({
            message,
            statusCode: StatusCode.CREATED,
            reasonStatusCode: ReasonStatusCode.CREATED,
            metadata
        });
        this.options = options;
    }
}

export { OK, CREATED, SuccessResponse };
