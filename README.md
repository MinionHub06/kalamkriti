# KalamKriti - Handloom E-commerce Platform

A comprehensive handloom e-commerce platform built for hackathon participation, featuring user authentication, product management, weaver profiles, and backend API integration.

## 🚀 Features

### Frontend
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **User Authentication** - Login/Register with JWT tokens
- **Product Catalog** - Dynamic product filtering and display
- **Weaver Profiles** - Meet the artisans behind the products
- **User Dashboard** - Profile management and order tracking
- **Interactive UI** - Smooth animations and modern design

### Backend
- **RESTful API** - Node.js/Express server
- **Database Integration** - MongoDB with Mongoose
- **JWT Authentication** - Secure user sessions
- **Product Management** - CRUD operations for products
- **Order System** - Complete order management
- **Weaver Management** - Artisan profile system

## 📁 Project Structure

```
kalamkriti/
├── Frontend Files
│   ├── handloom.html          # Main homepage
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── weavers.html           # Weaver profiles page
│   ├── products.html          # Product catalog
│   ├── dashboard.html         # User dashboard
│   ├── handloom.css           # Main stylesheet
│   ├── handloom.js            # Main JavaScript
│   ├── auth.js                # Authentication logic
│   ├── products.js            # Product management
│   └── dashboard.js           # Dashboard functionality
├── Backend Files
│   ├── server.js              # Express server
│   ├── package.json          # Dependencies
│   └── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/kalamkriti
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

3. **Start MongoDB**
   - Local: Start MongoDB service
   - Cloud: Use MongoDB Atlas connection string

4. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Open the Website**
   - Simply open `handloom.html` in your browser
   - Or use a local server like Live Server (VS Code extension)

2. **API Configuration**
   - The frontend is configured to connect to `http://localhost:3000/api`
   - Make sure the backend server is running

## 🎯 Key Features for Hackathon

### 1. **Complete E-commerce Platform**
- User registration and authentication
- Product catalog with filtering
- Shopping cart functionality
- Order management system

### 2. **Weaver Community**
- Artisan profiles and stories
- Specialization tracking
- Experience management
- Community building features

### 3. **Modern Technology Stack**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Features**: Responsive design, RESTful API, Authentication

### 4. **Hackathon-Ready Features**
- Scalable architecture
- Database integration
- API documentation
- Mobile-responsive design
- Real-time updates capability

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (authenticated)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Weavers
- `GET /api/weavers` - Get all weavers

## 🎨 Design Features

- **Color Scheme**: Warm, earthy tones reflecting handloom heritage
- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body
- **Animations**: Smooth transitions and scroll-triggered animations
- **Mobile-First**: Responsive design with mobile menu

## 🚀 Deployment Options

### Frontend
- Deploy static files to Netlify, Vercel, or GitHub Pages
- No build process required - pure HTML/CSS/JS

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Configure MongoDB Atlas for cloud database
- Set environment variables for production

## 📱 Mobile Responsiveness

The website is fully responsive with:
- Mobile-first design approach
- Touch-friendly navigation
- Optimized images and layouts
- Progressive enhancement

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Secure API endpoints

## 🎯 Hackathon Presentation Tips

1. **Demo Flow**:
   - Start with homepage showcasing products
   - Show user registration/login
   - Demonstrate product browsing and filtering
   - Show weaver profiles and community features
   - Display user dashboard and order management

2. **Technical Highlights**:
   - Full-stack development
   - Database integration
   - Authentication system
   - Responsive design
   - API architecture

3. **Business Value**:
   - Supports local artisans
   - Transparent supply chain
   - Community building
   - Sustainable fashion

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - Feel free to use this project for your hackathon or learning purposes.

---

**Built with ❤️ for the handloom community and hackathon success!**
