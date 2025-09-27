# 🗄️ KalamKriti Database Setup Guide

## Quick Start

Follow these steps to connect your frontend to the database:

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run setup
```
This will:
- Connect to MongoDB
- Run database migrations
- Seed with sample data
- Show database statistics

### 3. Start the Server
```bash
npm start
```

### 4. Test the Connection
```bash
npm test
```

## 🚀 What's Included

### Database Features
- ✅ **User Management**: Registration, login, profiles
- ✅ **Product Catalog**: Products with variants and inventory
- ✅ **Order System**: Complete order lifecycle
- ✅ **Review System**: Product reviews and ratings
- ✅ **Wishlist**: User wishlist management
- ✅ **Categories**: Product categorization
- ✅ **Coupons**: Discount system

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get products
- `GET /api/weavers` - Get weavers
- `GET /api/health` - Health check
- `GET /api/user/profile` - User profile (requires auth)

## 🔧 Troubleshooting

### If the database connection fails:

1. **Check MongoDB is running:**
   ```bash
   # On Windows
   net start MongoDB
   
   # On Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

2. **Check the connection string:**
   - Default: `mongodb://localhost:27017/kalamkriti_dev`
   - Update in `env.example` if needed

3. **Reset the database:**
   ```bash
   npm run db:reset
   ```

### If the frontend can't connect:

1. **Check the server is running:**
   - Visit: http://localhost:3000/api/health
   - Should show: `{"status":"connected","message":"Database is healthy"}`

2. **Check CORS settings:**
   - The server has CORS enabled for all origins
   - If issues persist, check browser console for errors

3. **Test API endpoints:**
   ```bash
   # Test health
   curl http://localhost:3000/api/health
   
   # Test products
   curl http://localhost:3000/api/products
   ```

## 📊 Database Management

### View Database Stats
```bash
npm run db:stats
```

### Check Database Health
```bash
npm run db:health
```

### Reset Database
```bash
npm run db:reset
```

### Run Migrations
```bash
npm run db:migrate
```

## 🌐 Frontend Integration

Your frontend is already configured to work with the database:

### Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Profile**: `GET /api/user/profile` (requires auth token)

### Products
- **Get Products**: `GET /api/products`
- **Search**: `GET /api/search?q=searchterm`
- **Filter**: `GET /api/products?category=sarees&minPrice=1000`

### Orders
- **Create Order**: `POST /api/orders`
- **Get Orders**: `GET /api/orders`

## 🔐 Authentication Flow

1. User fills login form
2. Frontend sends POST to `/api/auth/login`
3. Server validates credentials
4. Server returns JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in API requests

## 📱 Testing the Frontend

1. Open `login.html` in your browser
2. Try registering a new user
3. Try logging in with existing user
4. Check if products load on `products.html`
5. Test the cart functionality

## 🆘 Need Help?

If you're still having issues:

1. Check the browser console for errors
2. Check the server console for errors
3. Run `npm test` to verify API endpoints
4. Check MongoDB is running and accessible

## 📋 Sample Data

The database comes with sample data:
- **3 Weavers** with different specializations
- **4 Products** with variants and inventory
- **2 Customers** with sample profiles
- **Sample Orders** and reviews
- **Categories** for all product types

## 🎯 Next Steps

Once the database is connected:
1. Test user registration and login
2. Browse products and test search
3. Test the shopping cart
4. Create orders and test the flow
5. Customize the data for your needs

---

**Happy coding! 🚀**
