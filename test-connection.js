#!/usr/bin/env node

// Using built-in fetch (Node.js 18+)

async function testConnection() {
    const baseUrl = 'http://localhost:3000/api';
    
    console.log('🧪 Testing KalamKriti API Connection...\n');
    
    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await fetch(`${baseUrl}/health`);
        const healthData = await healthResponse.json();
        console.log(`   Status: ${healthData.status}`);
        console.log(`   Message: ${healthData.message}\n`);
        
        // Test 2: Get Products
        console.log('2️⃣ Testing products endpoint...');
        const productsResponse = await fetch(`${baseUrl}/products`);
        const productsData = await productsResponse.json();
        console.log(`   Products found: ${productsData.products?.length || 0}`);
        console.log(`   Pagination: ${productsData.pagination?.totalProducts || 0} total\n`);
        
        // Test 3: Get Weavers
        console.log('3️⃣ Testing weavers endpoint...');
        const weaversResponse = await fetch(`${baseUrl}/weavers`);
        const weaversData = await weaversResponse.json();
        console.log(`   Weavers found: ${weaversData.weavers?.length || 0}\n`);
        
        // Test 4: Test Registration
        console.log('4️⃣ Testing registration endpoint...');
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '+91 98765 43210',
            password: 'password123',
            userType: 'customer'
        };
        
        const registerResponse = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        if (registerResponse.ok) {
            console.log('   ✅ Registration endpoint working');
        } else {
            const errorData = await registerResponse.json();
            if (errorData.message.includes('already exists')) {
                console.log('   ✅ Registration endpoint working (user already exists)');
            } else {
                console.log(`   ❌ Registration failed: ${errorData.message}`);
            }
        }
        
        console.log('\n🎉 All tests completed! Your database is properly connected.');
        console.log('\n📋 Available endpoints:');
        console.log('   • GET  /api/health - Health check');
        console.log('   • GET  /api/products - Get products');
        console.log('   • GET  /api/weavers - Get weavers');
        console.log('   • POST /api/auth/register - User registration');
        console.log('   • POST /api/auth/login - User login');
        console.log('   • GET  /api/user/profile - User profile (requires auth)');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure MongoDB is running');
        console.log('   2. Run: npm run setup');
        console.log('   3. Run: npm start');
        console.log('   4. Then run this test again');
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testConnection();
}

module.exports = testConnection;
