// Test creating a new user and logging in
const http = require('http');

function createAndLoginUser() {
    console.log('👤 Creating a new user and testing login...\n');
    
    // Create a new user
    const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '9876543216',
        password: 'mypassword123',
        userType: 'customer'
    };
    
    const registerData = JSON.stringify(userData);
    
    const registerOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(registerData)
        }
    };
    
    console.log('1️⃣ Creating new user...');
    console.log('   Name:', userData.firstName, userData.lastName);
    console.log('   Email:', userData.email);
    console.log('   Phone:', userData.phone);
    console.log('   Type:', userData.userType);
    
    const registerReq = http.request(registerOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('   Status:', res.statusCode);
            
            if (res.statusCode === 201) {
                console.log('   ✅ User created successfully!\n');
                
                // Now try to login with the new user
                loginWithNewUser(userData.email, userData.password);
            } else {
                console.log('   ❌ Registration failed:', data);
            }
        });
    });
    
    registerReq.on('error', (error) => {
        console.error('❌ Registration Error:', error.message);
    });
    
    registerReq.write(registerData);
    registerReq.end();
}

function loginWithNewUser(email, password) {
    console.log('2️⃣ Testing login with new user...');
    
    const loginData = JSON.stringify({ email, password });
    
    const loginOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };
    
    const loginReq = http.request(loginOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('   Status:', res.statusCode);
            
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('   ✅ Login successful!');
                console.log('   User ID:', response.user.id);
                console.log('   Name:', response.user.firstName, response.user.lastName);
                console.log('   Email:', response.user.email);
                console.log('   Type:', response.user.userType);
                console.log('   Token received:', !!response.token);
                
                console.log('\n🎉 Success! You can now use these credentials:');
                console.log('   Email:', email);
                console.log('   Password:', password);
                console.log('\n📝 You can now login with these credentials in your frontend!');
            } else {
                console.log('   ❌ Login failed:', data);
            }
        });
    });
    
    loginReq.on('error', (error) => {
        console.error('❌ Login Error:', error.message);
    });
    
    loginReq.write(loginData);
    loginReq.end();
}

createAndLoginUser();

