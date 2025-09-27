// Check existing users in database
const { dbConnection } = require('./database/config');
const { User } = require('./database/models');

async function checkUsers() {
    try {
        await dbConnection.connect();
        
        console.log('🔍 Checking existing users...\n');
        
        const users = await User.find({}).select('firstName lastName email phone userType createdAt');
        
        console.log(`Found ${users.length} users:\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Phone: ${user.phone}`);
            console.log(`   Type: ${user.userType}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log('');
        });
        
        // Test login with first user
        if (users.length > 0) {
            console.log('🧪 Testing login with first user...');
            const firstUser = users[0];
            
            const bcrypt = require('bcryptjs');
            const testPassword = 'password123';
            
            // Check if password is hashed
            const userWithPassword = await User.findOne({ email: firstUser.email });
            console.log('Password field exists:', !!userWithPassword.password);
            console.log('Password length:', userWithPassword.password?.length);
            console.log('Password starts with $2b$:', userWithPassword.password?.startsWith('$2b$'));
            
            // Try to verify password
            try {
                const isValid = await bcrypt.compare(testPassword, userWithPassword.password);
                console.log('Password verification result:', isValid);
            } catch (error) {
                console.log('Password verification error:', error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await dbConnection.disconnect();
    }
}

checkUsers();

