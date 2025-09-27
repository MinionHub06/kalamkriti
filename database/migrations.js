const mongoose = require('mongoose');

// Database migration utilities
class DatabaseMigrations {
    constructor() {
        this.migrations = new Map();
        this.initializeMigrations();
    }

    initializeMigrations() {
        // Migration 1: Add indexes for better performance
        this.migrations.set('001_add_performance_indexes', {
            up: async () => {
                const db = mongoose.connection.db;
                
                // User collection indexes
                await db.collection('users').createIndex({ email: 1 });
                await db.collection('users').createIndex({ userType: 1 });
                await db.collection('users').createIndex({ 'weaverProfile.isVerified': 1 });
                await db.collection('users').createIndex({ createdAt: -1 });
                
                // Product collection indexes
                await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' });
                await db.collection('products').createIndex({ category: 1, subcategory: 1 });
                await db.collection('products').createIndex({ weaverId: 1 });
                await db.collection('products').createIndex({ status: 1, isActive: 1 });
                await db.collection('products').createIndex({ price: 1 });
                await db.collection('products').createIndex({ 'reviews.average': -1 });
                await db.collection('products').createIndex({ createdAt: -1 });
                
                // Order collection indexes
                await db.collection('orders').createIndex({ userId: 1 });
                await db.collection('orders').createIndex({ orderNumber: 1 });
                await db.collection('orders').createIndex({ status: 1 });
                await db.collection('orders').createIndex({ createdAt: -1 });
                
                // Review collection indexes
                await db.collection('reviews').createIndex({ productId: 1 });
                await db.collection('reviews').createIndex({ userId: 1 });
                await db.collection('reviews').createIndex({ status: 1 });
                
                // Wishlist collection indexes
                await db.collection('wishlists').createIndex({ userId: 1, productId: 1 }, { unique: true });
                
                // Category collection indexes
                await db.collection('categories').createIndex({ slug: 1 });
                await db.collection('categories').createIndex({ isActive: 1 });
                
                // Coupon collection indexes
                await db.collection('coupons').createIndex({ code: 1 });
                await db.collection('coupons').createIndex({ validFrom: 1, validUntil: 1 });
                
                console.log('✅ Migration 001: Added performance indexes');
            },
            down: async () => {
                const db = mongoose.connection.db;
                
                // Drop all indexes except _id
                const collections = ['users', 'products', 'orders', 'reviews', 'wishlists', 'categories', 'coupons'];
                for (const collectionName of collections) {
                    const collection = db.collection(collectionName);
                    const indexes = await collection.indexes();
                    for (const index of indexes) {
                        if (index.name !== '_id_') {
                            await collection.dropIndex(index.name);
                        }
                    }
                }
                
                console.log('✅ Migration 001: Removed performance indexes');
            }
        });

        // Migration 2: Add product variants structure
        this.migrations.set('002_add_product_variants', {
            up: async () => {
                const db = mongoose.connection.db;
                
                // Add variants field to existing products
                await db.collection('products').updateMany(
                    { variants: { $exists: false } },
                    { 
                        $set: { 
                            'inventory.variants': [],
                            'inventory.sku': null
                        } 
                    }
                );
                
                console.log('✅ Migration 002: Added product variants structure');
            },
            down: async () => {
                const db = mongoose.connection.db;
                
                // Remove variants field
                await db.collection('products').updateMany(
                    {},
                    { 
                        $unset: { 
                            'inventory.variants': '',
                            'inventory.sku': ''
                        } 
                    }
                );
                
                console.log('✅ Migration 002: Removed product variants structure');
            }
        });

        // Migration 3: Add user profile enhancements
        this.migrations.set('003_enhance_user_profiles', {
            up: async () => {
                const db = mongoose.connection.db;
                
                // Add new fields to existing users
                await db.collection('users').updateMany(
                    { 'weaverProfile.rating': { $exists: false } },
                    { 
                        $set: { 
                            'weaverProfile.rating': { average: 0, count: 0 },
                            'customerProfile.loyaltyPoints': 0,
                            'customerProfile.membershipTier': 'bronze'
                        } 
                    }
                );
                
                console.log('✅ Migration 003: Enhanced user profiles');
            },
            down: async () => {
                const db = mongoose.connection.db;
                
                // Remove added fields
                await db.collection('users').updateMany(
                    {},
                    { 
                        $unset: { 
                            'weaverProfile.rating': '',
                            'customerProfile.loyaltyPoints': '',
                            'customerProfile.membershipTier': ''
                        } 
                    }
                );
                
                console.log('✅ Migration 003: Reverted user profile enhancements');
            }
        });

        // Migration 4: Add order tracking enhancements
        this.migrations.set('004_enhance_order_tracking', {
            up: async () => {
                const db = mongoose.connection.db;
                
                // Add tracking fields to existing orders
                await db.collection('orders').updateMany(
                    { 'shipping.trackingNumber': { $exists: false } },
                    { 
                        $set: { 
                            'shipping.trackingNumber': null,
                            'shipping.carrier': null,
                            'shipping.estimatedDelivery': null,
                            'shipping.actualDelivery': null
                        } 
                    }
                );
                
                console.log('✅ Migration 004: Enhanced order tracking');
            },
            down: async () => {
                const db = mongoose.connection.db;
                
                // Remove tracking fields
                await db.collection('orders').updateMany(
                    {},
                    { 
                        $unset: { 
                            'shipping.trackingNumber': '',
                            'shipping.carrier': '',
                            'shipping.estimatedDelivery': '',
                            'shipping.actualDelivery': ''
                        } 
                    }
                );
                
                console.log('✅ Migration 004: Reverted order tracking enhancements');
            }
        });

        // Migration 5: Add product SEO fields
        this.migrations.set('005_add_product_seo', {
            up: async () => {
                const db = mongoose.connection.db;
                
                // Add SEO fields to existing products
                await db.collection('products').updateMany(
                    { keywords: { $exists: false } },
                    { 
                        $set: { 
                            keywords: [],
                            metaDescription: null
                        } 
                    }
                );
                
                console.log('✅ Migration 005: Added product SEO fields');
            },
            down: async () => {
                const db = mongoose.connection.db;
                
                // Remove SEO fields
                await db.collection('products').updateMany(
                    {},
                    { 
                        $unset: { 
                            keywords: '',
                            metaDescription: ''
                        } 
                    }
                );
                
                console.log('✅ Migration 005: Removed product SEO fields');
            }
        });
    }

    async runMigration(migrationName) {
        const migration = this.migrations.get(migrationName);
        if (!migration) {
            throw new Error(`Migration ${migrationName} not found`);
        }

        try {
            console.log(`🔄 Running migration: ${migrationName}`);
            await migration.up();
            console.log(`✅ Migration ${migrationName} completed successfully`);
        } catch (error) {
            console.error(`❌ Migration ${migrationName} failed:`, error);
            throw error;
        }
    }

    async rollbackMigration(migrationName) {
        const migration = this.migrations.get(migrationName);
        if (!migration) {
            throw new Error(`Migration ${migrationName} not found`);
        }

        try {
            console.log(`🔄 Rolling back migration: ${migrationName}`);
            await migration.down();
            console.log(`✅ Migration ${migrationName} rolled back successfully`);
        } catch (error) {
            console.error(`❌ Rollback of migration ${migrationName} failed:`, error);
            throw error;
        }
    }

    async runAllMigrations() {
        const migrationNames = Array.from(this.migrations.keys()).sort();
        
        for (const migrationName of migrationNames) {
            await this.runMigration(migrationName);
        }
        
        console.log('🎉 All migrations completed successfully!');
    }

    async rollbackAllMigrations() {
        const migrationNames = Array.from(this.migrations.keys()).sort().reverse();
        
        for (const migrationName of migrationNames) {
            await this.rollbackMigration(migrationName);
        }
        
        console.log('🎉 All migrations rolled back successfully!');
    }

    listMigrations() {
        console.log('Available migrations:');
        for (const [name, migration] of this.migrations) {
            console.log(`- ${name}`);
        }
    }
}

// Database connection and migration runner
class DatabaseManager {
    constructor() {
        this.migrations = new DatabaseMigrations();
    }

    async connect(uri) {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('✅ Disconnected from MongoDB');
        } catch (error) {
            console.error('❌ MongoDB disconnection error:', error);
            throw error;
        }
    }

    async runMigrations() {
        await this.migrations.runAllMigrations();
    }

    async rollbackMigrations() {
        await this.migrations.rollbackAllMigrations();
    }

    async runSpecificMigration(migrationName) {
        await this.migrations.runMigration(migrationName);
    }

    async rollbackSpecificMigration(migrationName) {
        await this.migrations.rollbackMigration(migrationName);
    }

    listMigrations() {
        this.migrations.listMigrations();
    }
}

module.exports = {
    DatabaseMigrations,
    DatabaseManager
};
