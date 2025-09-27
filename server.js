const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kalamkriti', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['customer', 'weaver', 'buyer'], required: true },
    specialization: { type: String },
    experience: { type: Number },
    bio: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    inStock: { type: Boolean, default: true },
    weaverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, userType } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            userType
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// User Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName, email, phone },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({ inStock: true }).populate('weaverId', 'firstName lastName');
        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, category, price, description, image } = req.body;
        
        const product = new Product({
            name,
            category,
            price,
            description,
            image,
            weaverId: req.user.userId
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Order Routes
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;
        
        // Calculate total amount
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (product) {
                totalAmount += product.price * item.quantity;
            }
        }

        const order = new Order({
            userId: req.user.userId,
            products,
            totalAmount,
            shippingAddress
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Weaver Routes
app.get('/api/weavers', async (req, res) => {
    try {
        const weavers = await User.find({ userType: 'weaver' })
            .select('firstName lastName specialization experience bio');
        res.json({ weavers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Initialize database with sample data
async function initializeData() {
    try {
        // Check if products exist
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const sampleProducts = [
                {
                    name: "Heritage Silk Saree",
                    category: "sarees",
                    price: 18500,
                    description: "Handwoven Banarasi Silk",
                    image: "silk1"
                },
                {
                    name: "Organic Cotton Kurta",
                    category: "kurtas",
                    price: 3200,
                    description: "Block Print Collection",
                    image: "cotton1"
                },
                {
                    name: "Chanderi Dupatta",
                    category: "dupattas",
                    price: 5800,
                    description: "Gold Zari Work",
                    image: "dupatta1"
                },
                {
                    name: "Pashmina Shawl",
                    category: "shawls",
                    price: 12000,
                    description: "Kashmir Handloom",
                    image: "shawl1"
                }
            ];

            await Product.insertMany(sampleProducts);
            console.log('Sample products added to database');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initializeData();
});

module.exports = app;
