// Test authentication endpoints
const http = require('http');

function testLogin() {
    console.log('🧪 Testing Authentication...\n');
    
    // Test login with existing user
    const loginData = JSON.stringify({
        email: 'sneha.gupta@example.com',
        password: 'password123'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ Login Test:');
            console.log('   Status:', res.statusCode);
            console.log('   Response:', data);
            
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('   ✅ Login successful!');
                console.log('   User:', response.user);
                console.log('   Token received:', !!response.token);
            } else {
                console.log('   ❌ Login failed');
            }
            
            // Test registration
            testRegistration();
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Login Error:', error.message);
    });
    
    req.write(loginData);
    req.end();
}

function testRegistration() {
    console.log('\n🧪 Testing Registration...\n');
    
    // Test registration with new user
    const registerData = JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        phone: '9876543215',
        password: 'password123',
        userType: 'customer'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(registerData)
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ Registration Test:');
            console.log('   Status:', res.statusCode);
            console.log('   Response:', data);
            
            if (res.statusCode === 201) {
                console.log('   ✅ Registration successful!');
            } else {
                console.log('   ❌ Registration failed');
            }
            
            console.log('\n🎉 Authentication testing complete!');
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Registration Error:', error.message);
    });
    
    req.write(registerData);
    req.end();
}

testLogin();

