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
// Shop/User Model Types
// =============================================================================

export interface Shop extends BaseModel {
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    verify: boolean;
    roles: string[];
    profile?: ShopProfile;
    settings?: ShopSettings;
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
    socialMedia?: SocialMediaLinks;
}

export interface ShopSettings {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    business: BusinessSettings;
}

export interface NotificationSettings {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
}

export interface PrivacySettings {
    profileVisible: boolean;
    allowMessages: boolean;
    showOnlineStatus: boolean;
}

export interface BusinessSettings {
    autoApproveOrders: boolean;
    allowReturns: boolean;
    returnWindow: number; // days
    currency: string;
    timezone: string;
}

export interface SocialMediaLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
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
// Product Model Types
// =============================================================================

export interface Product extends TimestampedModel {
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    cost?: number;
    sku: string;
    barcode?: string;
    quantity: number;
    minQuantity?: number;
    maxQuantity?: number;
    weight?: number;
    dimensions?: ProductDimensions;
    category: Types.ObjectId | Category;
    subcategory?: Types.ObjectId | Category;
    brand?: Types.ObjectId | Brand;
    shop: Types.ObjectId | Shop;
    images: ProductImage[];
    attributes: ProductAttribute[];
    variations?: ProductVariation[];
    tags: string[];
    status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
    featured: boolean;
    seoData?: SEOData;
    inventory?: InventoryData;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
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

export interface ProductVariation {
    name: string;
    type: 'color' | 'size' | 'material' | 'style';
    options: VariationOption[];
}

export interface VariationOption {
    name: string;
    value: string;
    price: number;
    salePrice?: number;
    quantity: number;
    sku?: string;
    image?: string;
    isDefault?: boolean;
}

export interface SEOData {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
}

export interface InventoryData {
    trackQuantity: boolean;
    allowBackorders: boolean;
    lowStockThreshold?: number;
    reservedQuantity: number;
    availableQuantity: number;
}

// =============================================================================
// Category Model Types
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
    seoData?: SEOData;
    productCount?: number;
}

export interface Brand extends TimestampedModel {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    status: 'active' | 'inactive';
    featured: boolean;
    seoData?: SEOData;
    productCount?: number;
}

// =============================================================================
// Order Model Types
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
    fulfillmentStatus: FulfillmentStatus;
    paymentMethod: PaymentMethod;
    paymentDetails?: PaymentDetails;
    shippingAddress: Address;
    billingAddress?: Address;
    shippingMethod?: ShippingMethod;
    notes?: string;
    internalNotes?: string;
    tracking?: TrackingInfo;
    refunds?: Refund[];
    timeline: OrderTimeline[];
    metadata?: Record<string, any>;
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
    notes?: string;
}

export type OrderStatus = 
    | 'pending' 
    | 'confirmed' 
    | 'processing' 
    | 'shipped' 
    | 'delivered' 
    | 'cancelled' 
    | 'refunded'
    | 'on_hold';

export type PaymentStatus = 
    | 'pending' 
    | 'paid' 
    | 'failed' 
    | 'refunded' 
    | 'partially_refunded'
    | 'authorized'
    | 'cancelled';

export type FulfillmentStatus = 
    | 'unfulfilled'
    | 'partially_fulfilled'
    | 'fulfilled'
    | 'restocked';

export type PaymentMethod = 
    | 'credit_card' 
    | 'debit_card' 
    | 'paypal' 
    | 'stripe'
    | 'bank_transfer' 
    | 'cash_on_delivery'
    | 'wallet';

export interface PaymentDetails {
    provider: string;
    transactionId?: string;
    gatewayResponse?: Record<string, any>;
    cardLast4?: string;
    cardBrand?: string;
}

export interface ShippingMethod {
    name: string;
    code: string;
    cost: number;
    estimatedDays: number;
    trackingSupported: boolean;
}

export interface TrackingInfo {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    events: TrackingEvent[];
}

export interface TrackingEvent {
    status: string;
    description: string;
    location?: string;
    timestamp: Date;
}

export interface Refund {
    _id?: Types.ObjectId;
    amount: number;
    reason: string;
    status: 'pending' | 'processed' | 'failed';
    processedAt?: Date;
    transactionId?: string;
    notes?: string;
    createdAt: Date;
}

export interface OrderTimeline {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: Types.ObjectId;
}

// =============================================================================
// Cart Model Types
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
    attributes?: ProductAttribute[];
    addedAt: Date;
    updatedAt: Date;
}

// =============================================================================
// Review Model Types
// =============================================================================

export interface Review extends TimestampedModel {
    product: Types.ObjectId | Product;
    user: Types.ObjectId | Shop;
    order?: Types.ObjectId | Order;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
    verified: boolean;
    helpful: number;
    reported: number;
    status: 'pending' | 'approved' | 'rejected';
    moderatorNote?: string;
}

// =============================================================================
// Coupon Model Types
// =============================================================================

export interface Coupon extends TimestampedModel {
    code: string;
    name: string;
    description?: string;
    type: 'percentage' | 'fixed_amount' | 'free_shipping';
    value: number;
    minimumAmount?: number;
    maximumDiscount?: number;
    usageLimit?: number;
    usageCount: number;
    userLimit?: number;
    startDate: Date;
    endDate: Date;
    applicableProducts?: Types.ObjectId[];
    applicableCategories?: Types.ObjectId[];
    excludedProducts?: Types.ObjectId[];
    excludedCategories?: Types.ObjectId[];
    status: 'active' | 'inactive' | 'expired';
    isFirstTimeUser?: boolean;
}

// =============================================================================
// Wishlist Model Types
// =============================================================================

export interface Wishlist extends BaseModel {
    user: Types.ObjectId | Shop;
    items: WishlistItem[];
    name: string;
    isPublic: boolean;
}

export interface WishlistItem {
    product: Types.ObjectId | Product;
    addedAt: Date;
    notes?: string;
} 