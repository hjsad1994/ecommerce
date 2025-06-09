import { Request } from 'express';
import { Types } from 'mongoose';

// =============================================================================
// Authentication Types
// =============================================================================

export interface JWTPayload {
    userId: string;
    email: string;
    roles: string[];
    shopId?: string;
    iat?: number;
    exp?: number;
}

export interface JWTTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
    shop?: AuthenticatedShop;
}

export interface AuthenticatedUser {
    userId: string;
    email: string;
    roles: string[];
    permissions?: string[];
}

export interface AuthenticatedShop {
    shopId: string;
    email: string;
    name: string;
    status: 'active' | 'inactive';
    roles: string[];
    permissions?: string[];
}

// =============================================================================
// Login/Register Request Types
// =============================================================================

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface ShopRegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessType?: string;
    acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// =============================================================================
// Authentication Response Types
// =============================================================================

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        status: string;
        isVerified: boolean;
    };
    tokens: JWTTokens;
    permissions?: string[];
}

export interface RegisterResponse {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        isVerified: boolean;
    };
    message: string;
    verificationRequired: boolean;
}

export interface RefreshTokenResponse {
    tokens: JWTTokens;
}

// =============================================================================
// Role and Permission Types
// =============================================================================

export interface Role {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    permissions: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Permission {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    resource: string;
    action: string;
    conditions?: PermissionCondition[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PermissionCondition {
    field: string;
    operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
    value: any;
}

// =============================================================================
// Authorization Types
// =============================================================================

export interface AuthorizationContext {
    user: AuthenticatedUser;
    resource: string;
    action: string;
    resourceId?: string;
    conditions?: Record<string, any>;
}

export interface PermissionCheck {
    resource: string;
    action: string;
    resourceId?: string;
    conditions?: Record<string, any>;
}

// =============================================================================
// Session Types
// =============================================================================

export interface Session {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    sessionId: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    isActive: boolean;
    lastAccessedAt: Date;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SessionCreateRequest {
    userId: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresIn: number;
}

// =============================================================================
// OTP and Verification Types
// =============================================================================

export interface OTPVerification {
    _id?: Types.ObjectId;
    email: string;
    code: string;
    type: 'email_verification' | 'password_reset' | 'login_2fa';
    expiresAt: Date;
    isUsed: boolean;
    attempts: number;
    createdAt?: Date;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface ResendVerificationRequest {
    email: string;
}

// =============================================================================
// Auth Middleware Types
// =============================================================================

export interface AuthMiddlewareOptions {
    required?: boolean;
    roles?: string[];
    permissions?: string[];
    allowUnverified?: boolean;
}

export interface RoleBasedAuthOptions {
    roles: string[];
    requireAll?: boolean;
}

export interface PermissionBasedAuthOptions {
    permissions: PermissionCheck[];
    requireAll?: boolean;
} 