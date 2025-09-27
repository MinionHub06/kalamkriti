#!/usr/bin/env node

const { dbConnection } = require('./database/config');
const { seedDatabase } = require('./database/seedData');

async function setupDatabase() {
    console.log('🚀 Setting up KalamKriti Database...\n');
    
    try {
        // Step 1: Connect to database
        console.log('1️⃣ Connecting to database...');
        await dbConnection.connect();
        console.log('✅ Connected successfully\n');
        
        // Step 2: Run migrations
        console.log('2️⃣ Running database migrations...');
        await dbConnection.runMigrations();
        console.log('✅ Migrations completed\n');
        
        // Step 3: Check if data exists
        const { Product } = require('./database/models');
        const productCount = await Product.countDocuments();
        
        if (productCount === 0) {
            console.log('3️⃣ Seeding database with sample data...');
            await seedDatabase();
            console.log('✅ Database seeded successfully\n');
        } else {
            console.log('3️⃣ Database already contains data, skipping seed\n');
        }
        
        // Step 4: Show database stats
        console.log('4️⃣ Database Statistics:');
        const stats = await dbConnection.getDatabaseStats();
        console.log(`   📊 Collections: ${stats.collections}`);
        console.log(`   💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   📈 Objects: ${stats.objects}\n`);
        
        console.log('🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Start the server: npm start');
        console.log('   2. Open your browser: http://localhost:3000');
        console.log('   3. Test the API: http://localhost:3000/api/health');
        console.log('\n🔗 Available endpoints:');
        console.log('   • POST /api/auth/register - User registration');
        console.log('   • POST /api/auth/login - User login');
        console.log('   • GET /api/products - Get products');
        console.log('   • GET /api/weavers - Get weavers');
        console.log('   • GET /api/health - Health check');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        await dbConnection.disconnect();
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
