const mongoose = require('mongoose');
const { DatabaseManager } = require('./migrations');

// Database configuration
const config = {
    development: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kalamkriti_dev',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    },
    production: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kalamkriti_prod',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority'
        }
    },
    test: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kalamkriti_test',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
    }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Database connection class
class DatabaseConnection {
    constructor() {
        this.connection = null;
        this.dbManager = new DatabaseManager();
        this.isConnected = false;
    }

    async connect() {
        try {
            if (this.isConnected) {
                console.log('✅ Database already connected');
                return;
            }

            console.log(`🔄 Connecting to MongoDB (${env})...`);
            
            this.connection = await mongoose.connect(
                currentConfig.uri, 
                currentConfig.options
            );

            this.isConnected = true;
            console.log('✅ Successfully connected to MongoDB');

            // Set up connection event listeners
            this.setupEventListeners();

            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (!this.isConnected) {
                console.log('ℹ️ Database not connected');
                return;
            }

            await mongoose.disconnect();
            this.isConnected = false;
            console.log('✅ Successfully disconnected from MongoDB');
        } catch (error) {
            console.error('❌ MongoDB disconnection error:', error);
            throw error;
        }
    }

    setupEventListeners() {
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from MongoDB');
            this.isConnected = false;
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await this.disconnect();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await this.disconnect();
            process.exit(0);
        });
    }

    async runMigrations() {
        try {
            console.log('🔄 Running database migrations...');
            await this.dbManager.runMigrations();
            console.log('✅ Database migrations completed');
        } catch (error) {
            console.error('❌ Migration error:', error);
            throw error;
        }
    }

    async rollbackMigrations() {
        try {
            console.log('🔄 Rolling back database migrations...');
            await this.dbManager.rollbackMigrations();
            console.log('✅ Database rollback completed');
        } catch (error) {
            console.error('❌ Rollback error:', error);
            throw error;
        }
    }

    async runSpecificMigration(migrationName) {
        try {
            console.log(`🔄 Running migration: ${migrationName}`);
            await this.dbManager.runSpecificMigration(migrationName);
            console.log(`✅ Migration ${migrationName} completed`);
        } catch (error) {
            console.error(`❌ Migration ${migrationName} error:`, error);
            throw error;
        }
    }

    async rollbackSpecificMigration(migrationName) {
        try {
            console.log(`🔄 Rolling back migration: ${migrationName}`);
            await this.dbManager.rollbackSpecificMigration(migrationName);
            console.log(`✅ Rollback of ${migrationName} completed`);
        } catch (error) {
            console.error(`❌ Rollback ${migrationName} error:`, error);
            throw error;
        }
    }

    listMigrations() {
        this.dbManager.listMigrations();
    }

    getConnection() {
        return this.connection;
    }

    isConnectedToDatabase() {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    async getDatabaseStats() {
        if (!this.isConnectedToDatabase()) {
            throw new Error('Database not connected');
        }

        try {
            const db = mongoose.connection.db;
            const stats = await db.stats();
            
            return {
                database: db.databaseName,
                collections: stats.collections,
                dataSize: stats.dataSize,
                storageSize: stats.storageSize,
                indexes: stats.indexes,
                objects: stats.objects
            };
        } catch (error) {
            console.error('❌ Error getting database stats:', error);
            throw error;
        }
    }

    async getCollectionStats() {
        if (!this.isConnectedToDatabase()) {
            throw new Error('Database not connected');
        }

        try {
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            const stats = {};

            for (const collection of collections) {
                const collectionStats = await db.collection(collection.name).stats();
                stats[collection.name] = {
                    count: collectionStats.count,
                    size: collectionStats.size,
                    avgObjSize: collectionStats.avgObjSize,
                    storageSize: collectionStats.storageSize,
                    totalIndexSize: collectionStats.totalIndexSize,
                    indexSizes: collectionStats.indexSizes
                };
            }

            return stats;
        } catch (error) {
            console.error('❌ Error getting collection stats:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            if (!this.isConnectedToDatabase()) {
                return {
                    status: 'disconnected',
                    message: 'Database not connected'
                };
            }

            // Ping the database
            await mongoose.connection.db.admin().ping();
            
            return {
                status: 'connected',
                message: 'Database is healthy',
                environment: env,
                database: mongoose.connection.db.databaseName
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

module.exports = {
    config,
    DatabaseConnection,
    dbConnection
};
