import { Request } from 'express';
import { Types } from 'mongoose';

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    metadata?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface ErrorResponse {
    code: string;
    message: string;
    status: 'error';
    details?: any;
}

// =============================================================================
// Authentication Types
// =============================================================================

export interface JWTPayload {
    userId: string;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        roles: string[];
    };
}

// =============================================================================
// Core Shop/User Types (Essential for current implementation)
// =============================================================================

export interface Shop {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    roles: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShopSignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface ShopLoginRequest {
    email: string;
    password: string;
}

export interface ShopSignUpResponse {
    shop: Omit<Shop, 'password'>;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ShopLoginResponse {
    shop: Omit<Shop, 'password'>;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

// =============================================================================
// Product Types
// =============================================================================

export interface Product {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Types.ObjectId | Category;
    images: string[];
    attributes: ProductAttribute[];
    shop: Types.ObjectId | Shop;
    status: 'active' | 'inactive' | 'draft';
    tags: string[];
    variations?: ProductVariation[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductAttribute {
    name: string;
    value: string;
}

export interface ProductVariation {
    name: string;
    options: VariationOption[];
}

export interface VariationOption {
    name: string;
    price: number;
    quantity: number;
    sku?: string;
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    images?: string[];
    attributes?: ProductAttribute[];
    tags?: string[];
    variations?: ProductVariation[];
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface ProductSearchQuery {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Category Types
// =============================================================================

export interface Category {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    image?: string;
    parent?: Types.ObjectId | Category;
    children?: Types.ObjectId[] | Category[];
    status: 'active' | 'inactive';
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryCreateRequest {
    name: string;
    description?: string;
    image?: string;
    parentId?: string;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {}

// =============================================================================
// Order Types
// =============================================================================

export interface Order {
    _id?: Types.ObjectId;
    orderNumber: string;
    user: Types.ObjectId | Shop;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: Address;
    billingAddress?: Address;
    notes?: string;
    tracking?: TrackingInfo;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItem {
    product: Types.ObjectId | Product;
    quantity: number;
    price: number;
    variation?: string;
    total: number;
}

export type OrderStatus = 
    | 'pending' 
    | 'confirmed' 
    | 'processing' 
    | 'shipped' 
    | 'delivered' 
    | 'cancelled' 
    | 'refunded';

export type PaymentStatus = 
    | 'pending' 
    | 'paid' 
    | 'failed' 
    | 'refunded' 
    | 'partially_refunded';

export type PaymentMethod = 
    | 'credit_card' 
    | 'debit_card' 
    | 'paypal' 
    | 'bank_transfer' 
    | 'cash_on_delivery';

export interface Address {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface TrackingInfo {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
}

export interface OrderCreateRequest {
    items: {
        productId: string;
        quantity: number;
        variation?: string;
    }[];
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod: PaymentMethod;
    notes?: string;
}

export interface OrderUpdateRequest {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    tracking?: TrackingInfo;
    notes?: string;
}

// =============================================================================
// Cart Types
// =============================================================================

export interface Cart {
    _id?: Types.ObjectId;
    user: Types.ObjectId | Shop;
    items: CartItem[];
    totalAmount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CartItem {
    product: Types.ObjectId | Product;
    quantity: number;
    variation?: string;
    addedAt: Date;
}

export interface CartAddItemRequest {
    productId: string;
    quantity: number;
    variation?: string;
}

export interface CartUpdateItemRequest {
    productId: string;
    quantity: number;
    variation?: string;
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

export interface ImageUploadResponse {
    url: string;
    filename: string;
    size: number;
}

// =============================================================================
// Pagination & Filter Types
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

export interface DateRangeQuery {
    startDate?: Date;
    endDate?: Date;
}

// =============================================================================
// Database Connection Types
// =============================================================================

export interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    uri?: string;
}

export interface EnvironmentConfig {
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    MONGODB_URI: string;
    DB_NAME: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    BCRYPT_SALT_ROUNDS?: number;
}

// =============================================================================
// Service Response Types
// =============================================================================

export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export interface ServiceError {
    code: string;
    message: string;
    status?: number;
    details?: any;
}

// =============================================================================
// Utility Types
// =============================================================================

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// =============================================================================
// Export all types from specific files
// =============================================================================

export * from './api.types';
export * from './auth.types';
export * from './models.types'; 