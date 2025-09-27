#!/usr/bin/env node

const { dbConnection } = require('./database/config');
const { seedDatabase } = require('./database/seedData');

async function simpleSetup() {
    console.log('🚀 Simple KalamKriti Database Setup...\n');
    
    try {
        // Step 1: Connect to database
        console.log('1️⃣ Connecting to database...');
        await dbConnection.connect();
        console.log('✅ Connected successfully\n');
        
        // Step 2: Check if data exists
        const { Product } = require('./database/models');
        const productCount = await Product.countDocuments();
        
        if (productCount === 0) {
            console.log('2️⃣ Seeding database with sample data...');
            await seedDatabase();
            console.log('✅ Database seeded successfully\n');
        } else {
            console.log('2️⃣ Database already contains data, skipping seed\n');
        }
        
        // Step 3: Show database stats
        console.log('3️⃣ Database Statistics:');
        const stats = await dbConnection.getDatabaseStats();
        console.log(`   📊 Collections: ${stats.collections}`);
        console.log(`   💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   📈 Objects: ${stats.objects}\n`);
        
        console.log('🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Start the server: npm start');
        console.log('   2. Open your browser: http://localhost:3000');
        console.log('   3. Test the API: http://localhost:3000/api/health');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        await dbConnection.disconnect();
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    simpleSetup();
}

module.exports = simpleSetup;

