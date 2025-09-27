// Simple test to verify the API is working
const http = require('http');

function testAPI() {
    console.log('🧪 Testing KalamKriti API...\n');
    
    // Test health endpoint
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/health',
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ Health Check:');
            console.log('   Status:', res.statusCode);
            console.log('   Response:', data);
            
            // Test products endpoint
            testProducts();
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Error:', error.message);
    });
    
    req.end();
}

function testProducts() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/products',
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('\n✅ Products API:');
            console.log('   Status:', res.statusCode);
            const products = JSON.parse(data);
            console.log('   Products found:', products.products?.length || 0);
            console.log('   Total products:', products.pagination?.totalProducts || 0);
            
            console.log('\n🎉 API is working! Your frontend can now connect to the database.');
            console.log('\n📋 Available endpoints:');
            console.log('   • GET  /api/health - Health check');
            console.log('   • GET  /api/products - Get products');
            console.log('   • GET  /api/weavers - Get weavers');
            console.log('   • POST /api/auth/register - User registration');
            console.log('   • POST /api/auth/login - User login');
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Products API Error:', error.message);
    });
    
    req.end();
}

testAPI();

