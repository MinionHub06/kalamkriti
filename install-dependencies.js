#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing KalamKriti Dependencies...\n');

try {
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
        console.error('❌ package.json not found!');
        process.exit(1);
    }

    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
        console.log('📦 Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!\n');
    } else {
        console.log('📦 Dependencies already installed\n');
    }

    // Check if specific modules exist
    const requiredModules = [
        'bcryptjs',
        'jsonwebtoken', 
        'mongoose',
        'express',
        'cors',
        'dotenv',
        'express-validator'
    ];

    console.log('🔍 Checking required modules...');
    let allModulesPresent = true;

    for (const module of requiredModules) {
        try {
            require.resolve(module);
            console.log(`   ✅ ${module}`);
        } catch (error) {
            console.log(`   ❌ ${module} - Missing`);
            allModulesPresent = false;
        }
    }

    if (allModulesPresent) {
        console.log('\n🎉 All dependencies are installed and ready!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run: npm run setup');
        console.log('   2. Run: npm start');
        console.log('   3. Test: npm test');
    } else {
        console.log('\n❌ Some dependencies are missing. Installing...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Installation complete!');
    }

} catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\n🔧 Manual installation:');
    console.log('   npm install bcryptjs jsonwebtoken mongoose express cors dotenv express-validator');
    process.exit(1);
}
