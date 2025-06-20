import { Request } from 'express';
import { Types } from 'mongoose';

// =============================================================================
// Custom Request Extensions
// =============================================================================

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
    shop?: AuthenticatedShop;
    objKey?: any; // For API key middleware
    keyStore?: any; // For key token storage
    refreshToken?: string; // For refresh token middleware
}

// =============================================================================
// Authentication Types (Currently Used)
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
// Login/Register Request Types (Currently Used)
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
// Authentication Response Types (Currently Used)
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
// Authorization Context (For Middleware)
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
// Auth Middleware Types (Currently Used)
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