import { Types } from 'mongoose';

// =============================================================================
// Base Model Types
// =============================================================================

export interface BaseModel {
    _id?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}

export interface TimestampedModel extends BaseModel {
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    deletedBy?: Types.ObjectId;
}

// =============================================================================
// Authentication Model Types
// =============================================================================

export interface ApiKey extends BaseModel {
    key: string;
    status: boolean;
    permissions: string[];
}

export interface KeyToken extends BaseModel {
    user: Types.ObjectId | Shop;
    publicKey: string;
    privateKey: string;
    refreshToken: string[];
}

// =============================================================================
// Shop/User Model Types (Currently Implemented)
// =============================================================================

export interface Shop extends BaseModel {
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    verify: boolean;
    roles: string[];
    profile?: ShopProfile;
    lastLoginAt?: Date;
    emailVerifiedAt?: Date;
}

export interface ShopProfile {
    businessName?: string;
    businessType?: string;
    description?: string;
    logo?: string;
    phone?: string;
    website?: string;
    address?: Address;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
    type?: 'home' | 'work' | 'business' | 'other';
}

// =============================================================================
// Product Model Types (For Next Phase)
// =============================================================================

export interface Product extends TimestampedModel {
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    sku: string;
    quantity: number;
    category: Types.ObjectId | Category;
    shop: Types.ObjectId | Shop;
    images: ProductImage[];
    attributes: ProductAttribute[];
    tags: string[];
    status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
    featured: boolean;
}

export interface ProductImage {
    url: string;
    filename: string;
    alt?: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface ProductAttribute {
    name: string;
    value: string;
    type: 'text' | 'number' | 'boolean' | 'color' | 'size';
    unit?: string;
    isRequired?: boolean;
    isFilterable?: boolean;
}

// =============================================================================
// Category Model Types (For Next Phase)
// =============================================================================

export interface Category extends TimestampedModel {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    parent?: Types.ObjectId | Category;
    children?: Types.ObjectId[] | Category[];
    level: number;
    path: string;
    status: 'active' | 'inactive';
    featured: boolean;
    sortOrder: number;
    productCount?: number;
}

// =============================================================================
// Order Model Types (For Later Phase)
// =============================================================================

export interface Order extends TimestampedModel {
    orderNumber: string;
    user: Types.ObjectId | Shop;
    items: OrderItem[];
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    shippingAddress: Address;
    billingAddress?: Address;
    notes?: string;
    tracking?: TrackingInfo;
}

export interface OrderItem {
    product: Types.ObjectId | Product;
    productName: string;
    productImage?: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    variation?: string;
    attributes?: ProductAttribute[];
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
    | 'stripe'
    | 'bank_transfer' 
    | 'cash_on_delivery';

export interface TrackingInfo {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
}

// =============================================================================
// Cart Model Types (For Later Phase)
// =============================================================================

export interface Cart extends BaseModel {
    user: Types.ObjectId | Shop;
    items: CartItem[];
    subtotal: number;
    totalAmount: number;
    currency: string;
    expiresAt?: Date;
}

export interface CartItem {
    _id?: Types.ObjectId;
    product: Types.ObjectId | Product;
    productName: string;
    productImage?: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    variation?: string;
    addedAt: Date;
    updatedAt: Date;
} 