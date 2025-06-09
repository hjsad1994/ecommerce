// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    metadata?: ApiMetadata;
}

export interface ApiMetadata {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    requestId?: string;
    timestamp?: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    error: {
        code: string;
        details?: any;
        stack?: string;
    };
    metadata?: {
        requestId?: string;
        timestamp: string;
    };
}

// =============================================================================
// HTTP Status Codes
// =============================================================================

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

// =============================================================================
// API Error Codes
// =============================================================================

export enum ApiErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
    AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    SERVER_ERROR = 'SERVER_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

// =============================================================================
// Pagination Types
// =============================================================================

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface SortQuery {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery {
    q?: string;
    fields?: string[];
}

export interface FilterQuery {
    [key: string]: any;
}

// =============================================================================
// Request Types
// =============================================================================

export interface BaseRequest {
    headers?: {
        authorization?: string;
        'content-type'?: string;
        'user-agent'?: string;
        [key: string]: string | undefined;
    };
}

export interface AuthenticatedApiRequest extends BaseRequest {
    user: {
        userId: string;
        email: string;
        roles: string[];
    };
}

// =============================================================================
// File Upload Types
// =============================================================================

export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

export interface FileUploadRequest {
    files: {
        [fieldname: string]: UploadedFile[];
    } | UploadedFile[];
}

export interface ImageUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
    uploadedAt: Date;
}