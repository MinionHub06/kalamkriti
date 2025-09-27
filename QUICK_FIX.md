# 🚨 Quick Fix for Missing Dependencies

## The Problem
The error `Cannot find module 'bcryptjs'` means the required dependencies are not installed in your `node_modules` folder.

## 🔧 Solution

### Step 1: Install Dependencies
Run this command in your terminal:
```bash
npm install
```

### Step 2: Verify Installation
```bash
npm run install-deps
```

### Step 3: Setup Database
```bash
npm run setup
```

### Step 4: Start Server
```bash
npm start
```

### Step 5: Test Connection
```bash
npm test
```

## 🆘 If npm install doesn't work:

### Option 1: Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### Option 2: Install specific dependencies
```bash
npm install bcryptjs jsonwebtoken mongoose express cors dotenv express-validator
```

### Option 3: Use yarn instead
```bash
yarn install
```

## ✅ What Should Happen

After running `npm install`, you should see:
- A `node_modules` folder created
- All dependencies downloaded
- No more "Cannot find module" errors

## 🎯 Then You Can:

1. **Setup the database**: `npm run setup`
2. **Start the server**: `npm start`  
3. **Test everything**: `npm test`
4. **Open your website**: http://localhost:3000

## 🔍 Troubleshooting

If you still get errors:

1. **Check Node.js version**: `node --version` (should be 14+)
2. **Check npm version**: `npm --version` (should be 6+)
3. **Check if you're in the right folder**: Make sure you're in the `adc` folder
4. **Check internet connection**: npm needs internet to download packages

---

**The issue is just missing dependencies - once installed, everything will work! 🚀**

