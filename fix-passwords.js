// Fix existing user passwords by re-hashing them
const { dbConnection } = require('./database/config');
const { User } = require('./database/models');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
    try {
        await dbConnection.connect();
        
        console.log('🔧 Fixing user passwords...\n');
        
        const users = await User.find({});
        console.log(`Found ${users.length} users to fix\n`);
        
        for (const user of users) {
            console.log(`Fixing password for: ${user.firstName} ${user.lastName} (${user.email})`);
            
            // Check if password is already hashed
            if (user.password.startsWith('$2b$')) {
                console.log('  ✅ Password already hashed, skipping');
                continue;
            }
            
            // Hash the password
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            // Update the user
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            
            console.log('  ✅ Password hashed and updated');
        }
        
        console.log('\n🎉 All passwords fixed!');
        
        // Test login with a fixed user
        console.log('\n🧪 Testing login with fixed password...');
        const testUser = await User.findOne({ email: 'sneha.gupta@example.com' });
        
        if (testUser) {
            const isValid = await bcrypt.compare('password123', testUser.password);
            console.log('Password verification result:', isValid);
            
            if (isValid) {
                console.log('✅ Login should now work!');
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await dbConnection.disconnect();
    }
}

fixPasswords();

