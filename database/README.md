# KalamKriti Database Documentation

## Overview

This document provides comprehensive documentation for the KalamKriti handloom e-commerce platform database. The database is built using MongoDB with Mongoose ODM and includes advanced features for user management, product catalog, order processing, reviews, and more.

## Database Structure

### Collections

1. **Users** - User accounts (customers, weavers, buyers, admins)
2. **Products** - Handloom products with variants and inventory
3. **Orders** - Order management and tracking
4. **Reviews** - Product reviews and ratings
5. **Wishlist** - User wishlist items
6. **Categories** - Product categories and subcategories
7. **Coupons** - Discount coupons and promotions

## Schema Details

### User Schema

The User schema supports multiple user types with specialized profiles:

```javascript
{
  // Basic Information
  firstName: String (required, 2-50 chars)
  lastName: String (required, 2-50 chars)
  email: String (required, unique, validated)
  phone: String (required, validated)
  password: String (required, min 6 chars, hashed)
  userType: String (enum: ['customer', 'weaver', 'buyer', 'admin'])
  
  // Weaver-specific fields
  weaverProfile: {
    specialization: String (enum: ['silk', 'cotton', 'wool', 'jute', 'mixed'])
    experience: Number (0-50 years)
    bio: String (max 1000 chars)
    workshopLocation: {
      address: String
      city: String
      state: String
      pincode: String
      coordinates: { latitude: Number, longitude: Number }
    }
    certifications: [{
      name: String
      issuingAuthority: String
      dateIssued: Date
      certificateUrl: String
    }]
    skills: [String] (enum: ['handloom', 'block_printing', 'embroidery', 'dyeing'])
    rating: { average: Number (0-5), count: Number }
    isVerified: Boolean
    verificationDocuments: [{
      type: String (enum: ['aadhar', 'pan', 'bank_account', 'workshop_photo'])
      documentUrl: String
      status: String (enum: ['pending', 'approved', 'rejected'])
    }]
  }
  
  // Customer-specific fields
  customerProfile: {
    preferences: {
      categories: [String]
      priceRange: { min: Number, max: Number }
      colors: [String]
      sizes: [String]
    }
    loyaltyPoints: Number
    membershipTier: String (enum: ['bronze', 'silver', 'gold', 'platinum'])
  }
  
  // Address Management
  addresses: [{
    type: String (enum: ['home', 'work', 'other'])
    isDefault: Boolean
    name: String
    street: String (required)
    city: String (required)
    state: String (required)
    pincode: String (required)
    country: String (default: 'India')
    phone: String
    landmark: String
  }]
  
  // Account Status
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  emailVerificationToken: String
  passwordResetToken: String
  passwordResetExpires: Date
  
  // Timestamps
  lastLogin: Date
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
}
```

### Product Schema

Comprehensive product schema with variants and inventory management:

```javascript
{
  // Basic Information
  name: String (required, 3-200 chars)
  slug: String (unique, auto-generated)
  category: String (required, enum: ['sarees', 'kurtas', 'dupattas', 'shawls', 'accessories'])
  subcategory: String (enum: ['silk', 'cotton', 'wool', 'jute', 'mixed'])
  
  // Pricing
  price: Number (required, min: 0)
  originalPrice: Number
  discount: Number (0-100, default: 0)
  currency: String (default: 'INR')
  
  // Product Details
  description: String (required, 10-2000 chars)
  shortDescription: String (max 200 chars)
  features: [String]
  materials: [String]
  careInstructions: String
  
  // Visual Content
  images: [{
    url: String (required)
    alt: String
    isPrimary: Boolean (default: false)
    order: Number (default: 0)
  }]
  videos: [{
    url: String
    thumbnail: String
    duration: Number
  }]
  
  // Inventory
  inventory: {
    inStock: Boolean (default: true)
    quantity: Number (default: 0, min: 0)
    sku: String (unique)
    variants: [{
      size: String
      color: String
      material: String
      quantity: Number (default: 0)
      price: Number
      sku: String
    }]
  }
  
  // Weaver Information
  weaverId: ObjectId (ref: 'User', required)
  weaverName: String (denormalized for performance)
  
  // Product Specifications
  specifications: {
    dimensions: { length: Number, width: Number, unit: String }
    weight: { value: Number, unit: String }
    colors: [String]
    sizes: [String]
    patterns: [String]
    techniques: [String]
  }
  
  // SEO and Marketing
  tags: [String]
  keywords: [String]
  metaDescription: String
  
  // Status and Visibility
  status: String (enum: ['draft', 'active', 'inactive', 'discontinued'])
  isFeatured: Boolean (default: false)
  isBestseller: Boolean (default: false)
  
  // Reviews and Ratings
  reviews: { average: Number (0-5), count: Number }
  
  // Timestamps
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
  publishedAt: Date
}
```

### Order Schema

Complete order management with tracking and payment information:

```javascript
{
  // Order Identification
  orderNumber: String (unique, auto-generated)
  
  // Customer Information
  userId: ObjectId (ref: 'User', required)
  customerInfo: {
    firstName: String
    lastName: String
    email: String
    phone: String
  }
  
  // Order Items
  items: [{
    productId: ObjectId (ref: 'Product', required)
    productName: String (denormalized)
    productImage: String (denormalized)
    quantity: Number (required, min: 1)
    unitPrice: Number (required, min: 0)
    totalPrice: Number (required, min: 0)
    variant: { size: String, color: String, material: String }
  }]
  
  // Pricing Breakdown
  pricing: {
    subtotal: Number (required, min: 0)
    discount: Number (default: 0, min: 0)
    tax: Number (default: 0, min: 0)
    shipping: Number (default: 0, min: 0)
    total: Number (required, min: 0)
  }
  
  // Shipping Information
  shippingAddress: {
    type: String (enum: ['home', 'work', 'other'])
    name: String (required)
    street: String (required)
    city: String (required)
    state: String (required)
    pincode: String (required)
    country: String (default: 'India')
    phone: String
    landmark: String
  }
  
  // Billing Information
  billingAddress: {
    sameAsShipping: Boolean (default: true)
    name: String
    street: String
    city: String
    state: String
    pincode: String
    country: String
    phone: String
  }
  
  // Order Status
  status: String (enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'])
  
  // Payment Information
  payment: {
    method: String (enum: ['cod', 'card', 'upi', 'netbanking', 'wallet'])
    status: String (enum: ['pending', 'completed', 'failed', 'refunded'])
    transactionId: String
    paymentGateway: String
    paidAt: Date
  }
  
  // Shipping Information
  shipping: {
    method: String (enum: ['standard', 'express', 'overnight'])
    trackingNumber: String
    carrier: String
    estimatedDelivery: Date
    actualDelivery: Date
    shippingNotes: String
  }
  
  // Order Notes
  notes: {
    customer: String
    admin: String
    internal: String
  }
  
  // Timestamps
  createdAt: Date (default: Date.now)
  updatedAt: Date (default: Date.now)
  confirmedAt: Date
  shippedAt: Date
  deliveredAt: Date
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### User Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add user address
- `PUT /api/user/addresses/:id` - Update user address
- `DELETE /api/user/addresses/:id` - Delete user address

### Product Endpoints

- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (weavers only)
- `PUT /api/products/:id` - Update product (weavers only)
- `DELETE /api/products/:id` - Delete product (weavers only)
- `GET /api/products/:id/reviews` - Get product reviews

### Order Endpoints

- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:id/cancel` - Cancel order

### Review Endpoints

- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist Endpoints

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Coupon Endpoints

- `GET /api/coupons` - Get active coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (admin only)

### Search Endpoints

- `GET /api/search` - Search products
- `GET /api/search/suggestions` - Get search suggestions

### Admin Endpoints

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/orders/:id/status` - Update order status

## Database Indexes

### User Collection Indexes

- `{ email: 1 }` - Unique email lookup
- `{ userType: 1 }` - Filter by user type
- `{ 'weaverProfile.isVerified': 1 }` - Filter verified weavers
- `{ createdAt: -1 }` - Sort by creation date

### Product Collection Indexes

- `{ name: 'text', description: 'text', tags: 'text' }` - Full-text search
- `{ category: 1, subcategory: 1 }` - Category filtering
- `{ weaverId: 1 }` - Filter by weaver
- `{ status: 1, isActive: 1 }` - Filter active products
- `{ price: 1 }` - Price sorting
- `{ 'reviews.average': -1 }` - Sort by rating
- `{ createdAt: -1 }` - Sort by creation date

### Order Collection Indexes

- `{ userId: 1 }` - User orders lookup
- `{ orderNumber: 1 }` - Order number lookup
- `{ status: 1 }` - Filter by status
- `{ createdAt: -1 }` - Sort by creation date

### Review Collection Indexes

- `{ productId: 1 }` - Product reviews lookup
- `{ userId: 1 }` - User reviews lookup
- `{ status: 1 }` - Filter by status

### Wishlist Collection Indexes

- `{ userId: 1, productId: 1 }` - Unique user-product combination

## Data Validation

### User Validation

- Email format validation using regex
- Phone number format validation
- Password minimum length (6 characters)
- Required fields validation
- Enum value validation for user types and specializations

### Product Validation

- Name length validation (3-200 characters)
- Description length validation (10-2000 characters)
- Price validation (minimum 0)
- Category and subcategory enum validation
- Image URL validation

### Order Validation

- Order items validation
- Pricing calculation validation
- Address validation
- Payment method validation

## Security Features

### Password Security

- Bcrypt hashing with salt rounds
- Password reset tokens with expiration
- Password strength validation

### Data Protection

- Sensitive data exclusion in queries
- Input sanitization
- SQL injection prevention through Mongoose

### Access Control

- JWT token authentication
- Role-based access control
- Resource ownership validation

## Performance Optimizations

### Indexing Strategy

- Strategic index placement for common queries
- Compound indexes for multi-field queries
- Text indexes for search functionality

### Query Optimization

- Population of related documents
- Field selection to reduce data transfer
- Pagination for large datasets
- Aggregation pipelines for complex queries

### Caching Strategy

- Denormalized data for frequently accessed fields
- Computed fields for performance
- Efficient data structure design

## Migration System

The database includes a comprehensive migration system for:

- Schema updates
- Index creation
- Data transformations
- Rollback capabilities

### Running Migrations

```javascript
const { dbConnection } = require('./database/config');

// Run all migrations
await dbConnection.runMigrations();

// Run specific migration
await dbConnection.runSpecificMigration('001_add_performance_indexes');

// Rollback migrations
await dbConnection.rollbackMigrations();
```

## Seed Data

The database includes comprehensive seed data for development and testing:

- Sample users (weavers, customers, admins)
- Product catalog with variants
- Categories and subcategories
- Sample orders and reviews
- Coupon codes

### Running Seed Data

```javascript
const { seedDatabase } = require('./database/seedData');

// Seed the database
await seedDatabase();
```

## Monitoring and Maintenance

### Health Checks

- Database connection monitoring
- Query performance tracking
- Index usage analysis
- Storage utilization monitoring

### Backup Strategy

- Regular automated backups
- Point-in-time recovery
- Data export capabilities

## Best Practices

### Data Modeling

- Use appropriate data types
- Implement proper relationships
- Denormalize for performance when needed
- Maintain data consistency

### Query Optimization

- Use indexes effectively
- Limit returned fields
- Implement pagination
- Use aggregation pipelines for complex queries

### Security

- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Regular security audits

## Troubleshooting

### Common Issues

1. **Connection Timeouts**: Check network connectivity and MongoDB configuration
2. **Index Errors**: Ensure proper index creation and maintenance
3. **Validation Errors**: Verify data format and required fields
4. **Performance Issues**: Analyze query patterns and optimize indexes

### Debug Tools

- MongoDB Compass for visual query analysis
- Mongoose debug mode for query logging
- Performance profiling tools
- Database monitoring dashboards

## Support

For database-related issues or questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Consult the migration logs
4. Contact the development team

---

*This documentation is maintained alongside the database schema and should be updated when changes are made to the database structure.*
