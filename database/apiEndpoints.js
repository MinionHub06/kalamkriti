const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Product, Order, Review, Wishlist, Category, Coupon, Cart, BespokeRequest } = require('./models');

const router = express.Router();

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

// Helper function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== AUTHENTICATION ENDPOINTS ====================

// User Registration
router.post('/auth/register', asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user (no password hashing)
    const user = new User({
        firstName,
        lastName,
        email,
        phone,
        password: password, // Store password as plain text
        userType: userType || 'customer'
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
}));

// User Login
router.post('/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (plain text comparison)
    if (user.password !== password) {
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
}));

// ==================== USER ENDPOINTS ====================

// Get user profile
router.get('/user/profile', authenticateToken, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
}));

// Update user profile
router.put('/user/profile', authenticateToken, asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, weaverProfile, customerProfile } = req.body;
    
    const updateData = { firstName, lastName, email, phone };
    
    // Add weaver profile if user is a weaver
    if (weaverProfile && req.user.userType === 'weaver') {
        updateData.weaverProfile = weaverProfile;
    }
    
    // Add customer profile if user is a customer
    if (customerProfile && req.user.userType === 'customer') {
        updateData.customerProfile = customerProfile;
    }
    
    const user = await User.findByIdAndUpdate(
        req.user.userId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
}));

// Get user addresses
router.get('/user/addresses', authenticateToken, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select('addresses');
    res.json({ addresses: user.addresses });
}));

// Add user address
router.post('/user/addresses', authenticateToken, asyncHandler(async (req, res) => {
    const { type, name, street, city, state, pincode, country, phone, landmark, isDefault } = req.body;
    
    const newAddress = {
        type,
        name,
        street,
        city,
        state,
        pincode,
        country,
        phone,
        landmark,
        isDefault: isDefault || false
    };
    
    // If this is set as default, unset other default addresses
    if (isDefault) {
        await User.updateMany(
            { _id: req.user.userId, 'addresses.isDefault': true },
            { $set: { 'addresses.$.isDefault': false } }
        );
    }
    
    const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $push: { addresses: newAddress } },
        { new: true }
    ).select('addresses');
    
    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
}));

// ==================== PRODUCT ENDPOINTS ====================

// Get all products with filtering and pagination
router.get('/products', asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        category,
        subcategory,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        inStock = true
    } = req.query;

    const query = { status: 'active' };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (inStock !== 'false') query['inventory.inStock'] = true;
    
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (search) {
        query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
        .populate('weaverId', 'firstName lastName weaverProfile.specialization')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const total = await Product.countDocuments(query);

    res.json({
        products,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    });
}));

// Get single product
router.get('/products/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('weaverId', 'firstName lastName weaverProfile.specialization weaverProfile.bio weaverProfile.rating')
        .lean();
    
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
}));

// Create product (weavers only)
router.post('/products', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.userType !== 'weaver') {
        return res.status(403).json({ message: 'Only weavers can create products' });
    }
    
    const productData = {
        ...req.body,
        weaverId: req.user.userId,
        weaverName: req.user.firstName + ' ' + req.user.lastName
    };
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ message: 'Product created successfully', product });
}));

// Update product (weavers only)
router.put('/products/:id', authenticateToken, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.weaverId.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'You can only update your own products' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    
    res.json({ message: 'Product updated successfully', product: updatedProduct });
}));

// ==================== ORDER ENDPOINTS ====================

// Get user orders
router.get('/orders', authenticateToken, asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user.userId };
    if (status) query.status = status;
    
    const orders = await Order.find(query)
        .populate('items.productId', 'name images price')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();
    
    const total = await Order.countDocuments(query);
    
    res.json({
        orders,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        }
    });
}));

// Get single order
router.get('/orders/:id', authenticateToken, asyncHandler(async (req, res) => {
    const order = await Order.findOne({ 
        _id: req.params.id, 
        userId: req.user.userId 
    }).populate('items.productId', 'name images price');
    
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
}));

// Create order
router.post('/orders', authenticateToken, asyncHandler(async (req, res) => {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;
    
    // Validate items
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        
        if (!product.inventory.inStock || product.inventory.quantity < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        }
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        orderItems.push({
            productId: product._id,
            productName: product.name,
            productImage: product.images[0]?.url,
            quantity: item.quantity,
            unitPrice: product.price,
            totalPrice: itemTotal,
            variant: item.variant || {}
        });
    }
    
    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
        const coupon = await Coupon.findOne({ 
            code: couponCode.toUpperCase(),
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        });
        
        if (coupon && coupon.usedCount < coupon.usageLimit) {
            if (coupon.type === 'percentage') {
                discount = Math.min(
                    (subtotal * coupon.value) / 100,
                    coupon.maxDiscountAmount || subtotal
                );
            } else if (coupon.type === 'fixed') {
                discount = Math.min(coupon.value, subtotal);
            }
        }
    }
    
    const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping above ₹2000
    const total = subtotal - discount + tax + shipping;
    
    const order = new Order({
        userId: req.user.userId,
        customerInfo: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            phone: req.user.phone
        },
        items: orderItems,
        pricing: {
            subtotal,
            discount,
            tax,
            shipping,
            total
        },
        shippingAddress,
        billingAddress: billingAddress || { sameAsShipping: true },
        status: 'pending',
        payment: {
            method: paymentMethod,
            status: 'pending'
        },
        shipping: {
            method: 'standard',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
    });
    
    await order.save();
    
    // Update product inventory
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { 'inventory.quantity': -item.quantity } }
        );
    }
    
    res.status(201).json({ message: 'Order created successfully', order });
}));

// ==================== REVIEW ENDPOINTS ====================

// Get product reviews
router.get('/products/:id/reviews', asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({ 
        productId: req.params.id, 
        status: 'approved' 
    })
    .populate('userId', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
    
    const total = await Review.countDocuments({ 
        productId: req.params.id, 
        status: 'approved' 
    });
    
    res.json({
        reviews,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalReviews: total
        }
    });
}));

// Create review
router.post('/reviews', authenticateToken, asyncHandler(async (req, res) => {
    const { productId, rating, title, comment, images, orderId } = req.body;
    
    // Check if user has ordered this product
    if (orderId) {
        const order = await Order.findOne({ 
            _id: orderId, 
            userId: req.user.userId,
            'items.productId': productId,
            status: 'delivered'
        });
        
        if (!order) {
            return res.status(400).json({ message: 'You can only review products you have purchased' });
        }
    }
    
    const review = new Review({
        productId,
        userId: req.user.userId,
        orderId,
        rating,
        title,
        comment,
        images: images || [],
        isVerified: !!orderId
    });
    
    await review.save();
    
    // Update product review stats
    const productReviews = await Review.find({ 
        productId, 
        status: 'approved' 
    });
    
    const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
        'reviews.average': Math.round(averageRating * 10) / 10,
        'reviews.count': productReviews.length
    });
    
    res.status(201).json({ message: 'Review created successfully', review });
}));

// ==================== WISHLIST ENDPOINTS ====================

// Get user wishlist
router.get('/wishlist', authenticateToken, asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.find({ userId: req.user.userId })
        .populate('productId', 'name price images category')
        .sort({ createdAt: -1 })
        .lean();
    
    res.json({ wishlist });
}));

// Add to wishlist
router.post('/wishlist', authenticateToken, asyncHandler(async (req, res) => {
    const { productId } = req.body;
    
    const existingItem = await Wishlist.findOne({ 
        userId: req.user.userId, 
        productId 
    });
    
    if (existingItem) {
        return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    const wishlistItem = new Wishlist({
        userId: req.user.userId,
        productId
    });
    
    await wishlistItem.save();
    
    res.status(201).json({ message: 'Added to wishlist successfully' });
}));

// Remove from wishlist
router.delete('/wishlist/:productId', authenticateToken, asyncHandler(async (req, res) => {
    const result = await Wishlist.findOneAndDelete({
        userId: req.user.userId,
        productId: req.params.productId
    });
    
    if (!result) {
        return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    res.json({ message: 'Removed from wishlist successfully' });
}));

// ==================== CATEGORY ENDPOINTS ====================

// Get all categories
router.get('/categories', asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .lean();
    
    res.json({ categories });
}));

// ==================== COUPON ENDPOINTS ====================

// Validate coupon
router.post('/coupons/validate', authenticateToken, asyncHandler(async (req, res) => {
    const { code, orderAmount } = req.body;
    
    const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
    });
    
    if (!coupon) {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
    
    if (orderAmount < coupon.minOrderAmount) {
        return res.status(400).json({ 
            message: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
        });
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }
    
    let discount = 0;
    if (coupon.type === 'percentage') {
        discount = Math.min(
            (orderAmount * coupon.value) / 100,
            coupon.maxDiscountAmount || orderAmount
        );
    } else if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, orderAmount);
    }
    
    res.json({ 
        valid: true, 
        discount: Math.round(discount),
        coupon: {
            code: coupon.code,
            name: coupon.name,
            type: coupon.type,
            value: coupon.value
        }
    });
}));

// ==================== SEARCH ENDPOINTS ====================

// Search products
router.get('/search', asyncHandler(async (req, res) => {
    const { q, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    const query = { status: 'active' };
    
    if (q) {
        query.$text = { $search: q };
    }
    
    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    const products = await Product.find(query)
        .populate('weaverId', 'firstName lastName')
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();
    
    const total = await Product.countDocuments(query);
    
    res.json({
        products,
        query: q,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total
        }
    });
}));

// ==================== STATISTICS ENDPOINTS ====================

// Get dashboard statistics (admin only)
router.get('/admin/stats', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    
    const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        topProducts
    ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$pricing.total' } } }
        ]),
        Order.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'firstName lastName'),
        Product.find().sort({ 'reviews.average': -1 }).limit(10).select('name price reviews')
    ]);
    
    res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
        topProducts
    });
}));

// ==================== CART ENDPOINTS ====================

// Get user's cart
router.get('/cart', authenticateToken, asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    
    if (!cart) {
        cart = new Cart({ userId: req.user.userId, items: [] });
        await cart.save();
    }
    
    res.json({ cart });
}));

// Add item to cart
router.post('/cart/add', authenticateToken, asyncHandler(async (req, res) => {
    const { productId, quantity = 1, variant = {} } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        cart = new Cart({ userId: req.user.userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            productId,
            productName: product.name,
            productImage: product.images[0]?.url || '',
            productPrice: product.price,
            quantity,
            variant
        });
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    res.json({ 
        message: 'Item added to cart',
        cart: {
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        }
    });
}));

// Update cart item quantity
router.patch('/cart/update', authenticateToken, asyncHandler(async (req, res) => {
    const { productId, quantity, variant = {} } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    res.json({ 
        message: 'Cart updated',
        cart: {
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        }
    });
}));

// Remove item from cart
router.delete('/cart/remove', authenticateToken, asyncHandler(async (req, res) => {
    const { productId, variant = {} } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items.splice(itemIndex, 1);
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    res.json({ 
        message: 'Item removed from cart',
        cart: {
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        }
    });
}));

// Clear cart
router.delete('/cart/clear', authenticateToken, asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    res.json({ message: 'Cart cleared' });
}));

// Sync localStorage cart with database
router.post('/cart/sync', authenticateToken, asyncHandler(async (req, res) => {
    const { items } = req.body; // Items from localStorage
    
    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items format' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        cart = new Cart({ userId: req.user.userId, items: [] });
    }
    
    // Clear existing items
    cart.items = [];
    
    // Add items from localStorage
    for (const item of items) {
        if (item.id && item.quantity > 0) {
            // Get product details
            const product = await Product.findById(item.id);
            if (product) {
                cart.items.push({
                    productId: item.id,
                    productName: product.name,
                    productImage: product.images[0]?.url || '',
                    productPrice: product.price,
                    quantity: item.quantity,
                    variant: item.variant || {}
                });
            }
        }
    }
    
    // Update totals
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    cart.lastUpdated = new Date();
    
    await cart.save();
    
    res.json({ 
        message: 'Cart synced successfully',
        cart: {
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        }
    });
}));

// ==================== BESPOKE REQUEST ENDPOINTS ====================

// Create a new bespoke request
router.post('/bespoke/request', authenticateToken, asyncHandler(async (req, res) => {
    const { projectType, budget, timeline, description, preferences } = req.body;
    
    // Get user information
    const user = await User.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Create bespoke request
    const bespokeRequest = new BespokeRequest({
        userId: req.user.userId,
        customerInfo: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        },
        projectType,
        budget,
        timeline,
        description,
        preferences: preferences || {}
    });
    
    await bespokeRequest.save();
    
    res.status(201).json({
        message: 'Bespoke request submitted successfully',
        request: {
            requestNumber: bespokeRequest.requestNumber,
            status: bespokeRequest.status,
            createdAt: bespokeRequest.createdAt
        }
    });
}));

// Get all bespoke requests for a user
router.get('/bespoke/requests', authenticateToken, asyncHandler(async (req, res) => {
    const requests = await BespokeRequest.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .select('-messages -preferences.referenceImages');
    
    res.json({ requests });
}));

// Get a specific bespoke request
router.get('/bespoke/requests/:requestNumber', authenticateToken, asyncHandler(async (req, res) => {
    const request = await BespokeRequest.findOne({ 
        requestNumber: req.params.requestNumber,
        userId: req.user.userId 
    });
    
    if (!request) {
        return res.status(404).json({ message: 'Bespoke request not found' });
    }
    
    res.json({ request });
}));

// Update bespoke request status (admin/weaver only)
router.patch('/bespoke/requests/:requestNumber/status', authenticateToken, asyncHandler(async (req, res) => {
    const { status, weaverId, estimatedCompletion, pricing } = req.body;
    
    // Check if user is admin or weaver
    const user = await User.findById(req.user.userId);
    if (!['admin', 'weaver'].includes(user.userType)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    const request = await BespokeRequest.findOne({ requestNumber: req.params.requestNumber });
    if (!request) {
        return res.status(404).json({ message: 'Bespoke request not found' });
    }
    
    // Update status
    request.status = status;
    request.updatedAt = new Date();
    
    // Assign weaver if provided
    if (weaverId) {
        const weaver = await User.findById(weaverId);
        if (weaver && weaver.userType === 'weaver') {
            request.assignedWeaver = {
                weaverId: weaverId,
                weaverName: `${weaver.firstName} ${weaver.lastName}`,
                assignedAt: new Date(),
                estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : undefined
            };
        }
    }
    
    // Update pricing if provided
    if (pricing) {
        request.pricing = { ...request.pricing, ...pricing };
    }
    
    await request.save();
    
    res.json({ 
        message: 'Bespoke request updated successfully',
        request: {
            requestNumber: request.requestNumber,
            status: request.status,
            assignedWeaver: request.assignedWeaver
        }
    });
}));

// Add message to bespoke request
router.post('/bespoke/requests/:requestNumber/messages', authenticateToken, asyncHandler(async (req, res) => {
    const { message, attachments } = req.body;
    
    const request = await BespokeRequest.findOne({ 
        requestNumber: req.params.requestNumber,
        userId: req.user.userId 
    });
    
    if (!request) {
        return res.status(404).json({ message: 'Bespoke request not found' });
    }
    
    // Determine sender type
    const user = await User.findById(req.user.userId);
    const sender = user.userType === 'admin' ? 'admin' : 'customer';
    
    request.messages.push({
        sender,
        message,
        attachments: attachments || []
    });
    
    await request.save();
    
    res.json({ message: 'Message added successfully' });
}));

// Get all bespoke requests (admin/weaver view)
router.get('/admin/bespoke/requests', authenticateToken, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!['admin', 'weaver'].includes(user.userType)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) {
        query.status = status;
    }
    
    if (user.userType === 'weaver') {
        query['assignedWeaver.weaverId'] = req.user.userId;
    }
    
    const requests = await BespokeRequest.find(query)
        .populate('userId', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    
    const total = await BespokeRequest.countDocuments(query);
    
    res.json({
        requests,
        pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        }
    });
}));

module.exports = router;
