const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import database models and configuration
const { User, Product, Order, Review, Wishlist, Category, Coupon } = require('./database/models');
const { dbConnection } = require('./database/config');
const { seedDatabase } = require('./database/seedData');
const apiEndpoints = require('./database/apiEndpoints');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Make authenticateToken available to apiEndpoints
module.exports.authenticateToken = authenticateToken;

// Routes

// Use the comprehensive API endpoints
app.use('/api', apiEndpoints);

// Legacy routes for backward compatibility
app.get('/api/weavers', async (req, res) => {
    try {
        const weavers = await User.find({ userType: 'weaver' })
            .select('firstName lastName weaverProfile.specialization weaverProfile.experience weaverProfile.bio');
        res.json({ weavers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const health = await dbConnection.healthCheck();
        res.json(health);
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Health check failed',
            error: error.message 
        });
    }
});

// Database stats endpoint (admin only)
app.get('/api/admin/db-stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const stats = await dbConnection.getDatabaseStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Initialize database and start server
async function startServer() {
    try {
        // Connect to database
        await dbConnection.connect();
        
        // Skip migrations for now to avoid conflicts
        console.log('⏭️ Skipping migrations to avoid conflicts');
        
        // Seed database if needed
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('🔄 Seeding database with sample data...');
            await seedDatabase();
        }
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Database: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 API Documentation: http://localhost:${PORT}/api/health`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app;
