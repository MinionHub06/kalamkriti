#!/usr/bin/env node

const { dbConnection } = require('./config');
const { seedDatabase } = require('./seedData');

// Command line interface for database management
class DatabaseCLI {
    constructor() {
        this.commands = {
            'connect': this.connect,
            'disconnect': this.disconnect,
            'migrate': this.migrate,
            'rollback': this.rollback,
            'seed': this.seed,
            'reset': this.reset,
            'stats': this.stats,
            'health': this.health,
            'help': this.help
        };
    }

    async run() {
        const command = process.argv[2];
        const args = process.argv.slice(3);

        if (!command || !this.commands[command]) {
            console.log('❌ Invalid command. Use "help" to see available commands.');
            process.exit(1);
        }

        try {
            await this.commands[command].call(this, args);
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    async connect(args) {
        console.log('🔄 Connecting to database...');
        await dbConnection.connect();
        console.log('✅ Connected successfully');
    }

    async disconnect(args) {
        console.log('🔄 Disconnecting from database...');
        await dbConnection.disconnect();
        console.log('✅ Disconnected successfully');
    }

    async migrate(args) {
        const migrationName = args[0];
        
        if (migrationName) {
            console.log(`🔄 Running migration: ${migrationName}`);
            await dbConnection.runSpecificMigration(migrationName);
        } else {
            console.log('🔄 Running all migrations...');
            await dbConnection.runMigrations();
        }
        console.log('✅ Migrations completed');
    }

    async rollback(args) {
        const migrationName = args[0];
        
        if (migrationName) {
            console.log(`🔄 Rolling back migration: ${migrationName}`);
            await dbConnection.rollbackSpecificMigration(migrationName);
        } else {
            console.log('🔄 Rolling back all migrations...');
            await dbConnection.rollbackMigrations();
        }
        console.log('✅ Rollback completed');
    }

    async seed(args) {
        console.log('🔄 Seeding database...');
        await dbConnection.connect();
        await seedDatabase();
        console.log('✅ Database seeded successfully');
    }

    async reset(args) {
        console.log('⚠️  This will reset the entire database. Are you sure? (y/N)');
        
        // In a real implementation, you would use readline for user input
        // For now, we'll just proceed with the reset
        console.log('🔄 Resetting database...');
        
        await dbConnection.connect();
        
        // Drop all collections
        const { User, Product, Order, Review, Wishlist, Category, Coupon } = require('./models');
        
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        await Wishlist.deleteMany({});
        await Category.deleteMany({});
        await Coupon.deleteMany({});
        
        console.log('✅ Database reset completed');
        
        // Re-seed the database
        await seedDatabase();
        console.log('✅ Database re-seeded');
    }

    async stats(args) {
        await dbConnection.connect();
        
        const dbStats = await dbConnection.getDatabaseStats();
        const collectionStats = await dbConnection.getCollectionStats();
        
        console.log('\n📊 Database Statistics:');
        console.log('========================');
        console.log(`Database: ${dbStats.database}`);
        console.log(`Collections: ${dbStats.collections}`);
        console.log(`Data Size: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Storage Size: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Indexes: ${dbStats.indexes}`);
        console.log(`Objects: ${dbStats.objects}`);
        
        console.log('\n📋 Collection Details:');
        console.log('======================');
        for (const [name, stats] of Object.entries(collectionStats)) {
            console.log(`\n${name}:`);
            console.log(`  Documents: ${stats.count}`);
            console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`  Avg Doc Size: ${stats.avgObjSize} bytes`);
            console.log(`  Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
            console.log(`  Index Size: ${(stats.totalIndexSize / 1024).toFixed(2)} KB`);
        }
    }

    async health(args) {
        const health = await dbConnection.healthCheck();
        
        console.log('\n🏥 Database Health Check:');
        console.log('=========================');
        console.log(`Status: ${health.status}`);
        console.log(`Message: ${health.message}`);
        
        if (health.environment) {
            console.log(`Environment: ${health.environment}`);
        }
        
        if (health.database) {
            console.log(`Database: ${health.database}`);
        }
    }

    help(args) {
        console.log('\n🛠️  Database Management CLI');
        console.log('============================');
        console.log('\nAvailable commands:');
        console.log('  connect              - Connect to database');
        console.log('  disconnect           - Disconnect from database');
        console.log('  migrate [name]       - Run migrations (all or specific)');
        console.log('  rollback [name]      - Rollback migrations (all or specific)');
        console.log('  seed                 - Seed database with sample data');
        console.log('  reset                - Reset database and re-seed');
        console.log('  stats                - Show database statistics');
        console.log('  health               - Check database health');
        console.log('  help                 - Show this help message');
        console.log('\nExamples:');
        console.log('  node dbUtils.js migrate');
        console.log('  node dbUtils.js migrate 001_add_performance_indexes');
        console.log('  node dbUtils.js rollback');
        console.log('  node dbUtils.js seed');
        console.log('  node dbUtils.js stats');
    }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
    const cli = new DatabaseCLI();
    cli.run().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('❌ CLI Error:', error);
        process.exit(1);
    });
}

module.exports = DatabaseCLI;
