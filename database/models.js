const mongoose = require('mongoose');

// Enhanced User Schema with more fields for handloom platform
const userSchema = new mongoose.Schema({
    // Basic Information
    firstName: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^[\+]?[1-9][\d]{9,14}$/, 'Please enter a valid phone number (10-15 digits)']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    
    // User Type and Role
    userType: { 
        type: String, 
        enum: ['customer', 'weaver', 'buyer', 'admin'], 
        required: true,
        default: 'customer'
    },
    
    // Weaver-specific fields
    weaverProfile: {
        specialization: { 
            type: String,
            enum: ['silk', 'cotton', 'wool', 'jute', 'mixed', 'traditional', 'contemporary'],
            required: function() { return this.userType === 'weaver'; }
        },
        experience: { 
            type: Number,
            min: 0,
            max: 50,
            required: function() { return this.userType === 'weaver'; }
        },
        bio: { 
            type: String,
            maxlength: 1000
        },
        workshopLocation: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            coordinates: {
                latitude: Number,
                longitude: Number
            }
        },
        certifications: [{
            name: String,
            issuingAuthority: String,
            dateIssued: Date,
            certificateUrl: String
        }],
        skills: [{
            type: String,
            enum: ['handloom', 'block_printing', 'embroidery', 'dyeing', 'design', 'quality_control']
        }],
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 }
        },
        isVerified: { type: Boolean, default: false },
        verificationDocuments: [{
            type: { type: String, enum: ['aadhar', 'pan', 'bank_account', 'workshop_photo'] },
            documentUrl: String,
            status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
        }]
    },
    
    // Customer-specific fields
    customerProfile: {
        preferences: {
            categories: [{ type: String, enum: ['sarees', 'kurtas', 'dupattas', 'shawls', 'accessories'] }],
            priceRange: {
                min: { type: Number, default: 0 },
                max: { type: Number, default: 100000 }
            },
            colors: [String],
            sizes: [String]
        },
        loyaltyPoints: { type: Number, default: 0 },
        membershipTier: { 
            type: String, 
            enum: ['bronze', 'silver', 'gold', 'platinum'], 
            default: 'bronze' 
        }
    },
    
    // Address Management
    addresses: [{
        type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
        isDefault: { type: Boolean, default: false },
        name: String,
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' },
        phone: String,
        landmark: String
    }],
    
    // Account Status
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Timestamps
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Product Schema with enhanced fields
const productSchema = new mongoose.Schema({
    // Basic Information
    name: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    slug: { 
        type: String, 
        unique: true,
        lowercase: true,
        trim: true
    },
    category: { 
        type: String, 
        required: true,
        enum: ['sarees', 'kurtas', 'dupattas', 'shawls', 'accessories', 'home_textiles']
    },
    subcategory: {
        type: String,
        enum: ['silk', 'cotton', 'wool', 'jute', 'mixed', 'traditional', 'contemporary', 'ethnic', 'casual', 'formal']
    },
    
    // Pricing
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    originalPrice: Number,
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    currency: { type: String, default: 'INR' },
    
    // Product Details
    description: { 
        type: String, 
        required: true,
        minlength: 10,
        maxlength: 2000
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    features: [String],
    materials: [String],
    careInstructions: String,
    
    // Visual Content
    images: [{
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 }
    }],
    videos: [{
        url: String,
        thumbnail: String,
        duration: Number
    }],
    
    // Inventory
    inventory: {
        inStock: { type: Boolean, default: true },
        quantity: { type: Number, default: 0, min: 0 },
        sku: { type: String, unique: true, sparse: true },
        variants: [{
            size: String,
            color: String,
            material: String,
            quantity: { type: Number, default: 0 },
            price: Number,
            sku: String
        }]
    },
    
    // Weaver Information
    weaverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    weaverName: String, // Denormalized for performance
    
    // Product Specifications
    specifications: {
        dimensions: {
            length: Number,
            width: Number,
            unit: { type: String, enum: ['cm', 'inches'], default: 'cm' }
        },
        weight: {
            value: Number,
            unit: { type: String, enum: ['g', 'kg'], default: 'g' }
        },
        colors: [String],
        sizes: [String],
        patterns: [String],
        techniques: [String]
    },
    
    // SEO and Marketing
    tags: [String],
    keywords: [String],
    metaDescription: String,
    
    // Status and Visibility
    status: { 
        type: String, 
        enum: ['draft', 'active', 'inactive', 'discontinued'], 
        default: 'draft' 
    },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    
    // Reviews and Ratings
    reviews: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: Date
});

// Order Schema with comprehensive order management
const orderSchema = new mongoose.Schema({
    // Order Identification
    orderNumber: { 
        type: String, 
        unique: true,
        required: true
    },
    
    // Customer Information
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    customerInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
    },
    
    // Order Items
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        productName: String, // Denormalized for performance
        productImage: String, // Denormalized for performance
        quantity: { 
            type: Number, 
            required: true,
            min: 1
        },
        unitPrice: { 
            type: Number, 
            required: true,
            min: 0
        },
        totalPrice: { 
            type: Number, 
            required: true,
            min: 0
        },
        variant: {
            size: String,
            color: String,
            material: String
        }
    }],
    
    // Pricing Breakdown
    pricing: {
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        shipping: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 }
    },
    
    // Shipping Information
    shippingAddress: {
        type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' },
        phone: String,
        landmark: String
    },
    
    // Billing Information
    billingAddress: {
        sameAsShipping: { type: Boolean, default: true },
        name: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
        phone: String
    },
    
    // Order Status
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'], 
        default: 'pending' 
    },
    
    // Payment Information
    payment: {
        method: { 
            type: String, 
            enum: ['cod', 'card', 'upi', 'netbanking', 'wallet'],
            required: true
        },
        status: { 
            type: String, 
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paymentGateway: String,
        paidAt: Date
    },
    
    // Shipping Information
    shipping: {
        method: { 
            type: String, 
            enum: ['standard', 'express', 'overnight'],
            default: 'standard'
        },
        trackingNumber: String,
        carrier: String,
        estimatedDelivery: Date,
        actualDelivery: Date,
        shippingNotes: String
    },
    
    // Order Notes
    notes: {
        customer: String,
        admin: String,
        internal: String
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date
});

// Review Schema for product reviews
const reviewSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order' 
    },
    
    // Review Content
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    title: { 
        type: String,
        maxlength: 200
    },
    comment: { 
        type: String,
        maxlength: 1000
    },
    
    // Review Images
    images: [{
        url: String,
        alt: String
    }],
    
    // Review Status
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    isVerified: { type: Boolean, default: false },
    
    // Helpfulness
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

// Category Schema for better organization
const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    slug: { 
        type: String, 
        unique: true,
        lowercase: true,
        trim: true
    },
    description: String,
    image: String,
    parentCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Coupon Schema for discounts
const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: { type: String, required: true },
    description: String,
    
    // Discount Configuration
    type: { 
        type: String, 
        enum: ['percentage', 'fixed', 'free_shipping'],
        required: true
    },
    value: { 
        type: Number, 
        required: true,
        min: 0
    },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: Number,
    
    // Usage Limits
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    
    // Validity
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    
    // Applicability
    applicableCategories: [{ type: String }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    userTypes: [{ type: String, enum: ['customer', 'weaver', 'buyer', 'admin'] }],
    
    // Status
    isActive: { type: Boolean, default: true },
    
    createdAt: { type: Date, default: Date.now }
});

// Cart Schema for shopping cart management
const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        productName: String, // Denormalized for performance
        productImage: String, // Denormalized for performance
        productPrice: Number, // Denormalized for performance
        quantity: { 
            type: Number, 
            required: true,
            min: 1,
            max: 10
        },
        variant: {
            size: String,
            color: String,
            material: String
        },
        addedAt: { type: Date, default: Date.now }
    }],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

// BespokeRequest Schema for custom orders
const bespokeRequestSchema = new mongoose.Schema({
    // Request Identification
    requestNumber: { 
        type: String, 
        unique: true,
        required: true
    },
    
    // Customer Information
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    customerInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    
    // Project Details
    projectType: { 
        type: String, 
        required: true,
        enum: ['saree', 'kurta', 'dupatta', 'shawl', 'other']
    },
    budget: { 
        type: String, 
        required: true,
        enum: ['5k-15k', '15k-30k', '30k-50k', '50k+']
    },
    timeline: { 
        type: String, 
        required: true,
        enum: ['1-2weeks', '2-4weeks', '1-2months', '2+months']
    },
    description: { 
        type: String, 
        required: true,
        maxlength: 2000
    },
    
    // Design Preferences
    preferences: {
        colors: [String],
        patterns: [String],
        materials: [String],
        techniques: [String],
        inspiration: String,
        referenceImages: [{
            url: String,
            description: String
        }]
    },
    
    // Weaver Assignment
    assignedWeaver: {
        weaverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        weaverName: String,
        assignedAt: Date,
        estimatedCompletion: Date
    },
    
    // Project Status
    status: { 
        type: String, 
        enum: ['submitted', 'under_review', 'design_phase', 'production', 'quality_check', 'completed', 'cancelled'],
        default: 'submitted'
    },
    
    // Pricing
    pricing: {
        estimatedCost: Number,
        finalCost: Number,
        materialsCost: Number,
        laborCost: Number,
        additionalCharges: Number
    },
    
    // Communication
    messages: [{
        sender: { type: String, enum: ['customer', 'weaver', 'admin'] },
        message: String,
        timestamp: { type: Date, default: Date.now },
        attachments: [{
            url: String,
            type: String,
            name: String
        }]
    }],
    
    // Delivery
    delivery: {
        address: {
            name: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'India' },
            phone: String
        },
        method: { type: String, enum: ['standard', 'express', 'pickup'], default: 'standard' },
        trackingNumber: String,
        estimatedDelivery: Date,
        actualDelivery: Date
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: Date,
    cancelledAt: Date
});

// Password hashing middleware removed - using plain text passwords

// Pre-save middleware for product slug generation
productSchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Pre-save middleware for order number generation
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        const count = await this.constructor.countDocuments();
        this.orderNumber = `KK${Date.now().toString().slice(-8)}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

// Pre-save middleware for bespoke request number generation
bespokeRequestSchema.pre('save', async function(next) {
    if (this.isNew && !this.requestNumber) {
        const count = await this.constructor.countDocuments();
        this.requestNumber = `BP${Date.now().toString().slice(-8)}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'weaverProfile.isVerified': 1 });
userSchema.index({ createdAt: -1 });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ weaverId: 1 });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'reviews.average': -1 });
productSchema.index({ createdAt: -1 });

orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ status: 1 });

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

cartSchema.index({ userId: 1 });
cartSchema.index({ lastUpdated: -1 });

bespokeRequestSchema.index({ userId: 1 });
bespokeRequestSchema.index({ requestNumber: 1 });
bespokeRequestSchema.index({ status: 1 });
bespokeRequestSchema.index({ 'assignedWeaver.weaverId': 1 });
bespokeRequestSchema.index({ createdAt: -1 });

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Category = mongoose.model('Category', categorySchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const Cart = mongoose.model('Cart', cartSchema);
const BespokeRequest = mongoose.model('BespokeRequest', bespokeRequestSchema);

module.exports = {
    User,
    Product,
    Order,
    Review,
    Wishlist,
    Category,
    Coupon,
    Cart,
    BespokeRequest
};
