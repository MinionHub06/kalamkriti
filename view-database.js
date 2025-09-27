// View all data in the database
const { dbConnection } = require('./database/config');
const { User, Product, Order, Review, Wishlist, Category, Coupon } = require('./database/models');

async function viewDatabase() {
    try {
        await dbConnection.connect();
        
        console.log('📊 KalamKriti Database Contents\n');
        console.log('=' .repeat(50));
        
        // Users
        console.log('\n👥 USERS:');
        const users = await User.find({}).select('-password');
        console.log(`Total Users: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   📱 Phone: ${user.phone}`);
            console.log(`   👤 Type: ${user.userType}`);
            console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
            if (user.userType === 'weaver' && user.weaverProfile) {
                console.log(`   🧵 Specialization: ${user.weaverProfile.specialization}`);
                console.log(`   ⭐ Rating: ${user.weaverProfile.rating?.average || 'N/A'}`);
            }
            console.log('');
        });
        
        // Products
        console.log('\n🛍️ PRODUCTS:');
        const products = await Product.find({});
        console.log(`Total Products: ${products.length}\n`);
        
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   💰 Price: ₹${product.price.toLocaleString()}`);
            console.log(`   🏷️ Category: ${product.category}`);
            console.log(`   📝 Description: ${product.description.substring(0, 50)}...`);
            console.log(`   📦 In Stock: ${product.inventory.inStock ? 'Yes' : 'No'}`);
            console.log(`   📊 Quantity: ${product.inventory.quantity}`);
            console.log(`   ⭐ Rating: ${product.reviews.average}/5 (${product.reviews.count} reviews)`);
            console.log('');
        });
        
        // Categories
        console.log('\n📂 CATEGORIES:');
        const categories = await Category.find({});
        console.log(`Total Categories: ${categories.length}\n`);
        
        categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category.name}`);
            console.log(`   🔗 Slug: ${category.slug}`);
            console.log(`   📝 Description: ${category.description}`);
            console.log(`   ✅ Active: ${category.isActive ? 'Yes' : 'No'}`);
            console.log('');
        });
        
        // Orders
        console.log('\n📦 ORDERS:');
        const orders = await Order.find({}).populate('userId', 'firstName lastName email');
        console.log(`Total Orders: ${orders.length}\n`);
        
        orders.forEach((order, index) => {
            console.log(`${index + 1}. Order #${order.orderNumber}`);
            console.log(`   👤 Customer: ${order.customerInfo.firstName} ${order.customerInfo.lastName}`);
            console.log(`   📧 Email: ${order.customerInfo.email}`);
            console.log(`   💰 Total: ₹${order.pricing.total.toLocaleString()}`);
            console.log(`   📊 Status: ${order.status}`);
            console.log(`   📅 Created: ${order.createdAt.toLocaleDateString()}`);
            console.log(`   📦 Items: ${order.items.length} products`);
            console.log('');
        });
        
        // Reviews
        console.log('\n⭐ REVIEWS:');
        const reviews = await Review.find({}).populate('userId', 'firstName lastName').populate('productId', 'name');
        console.log(`Total Reviews: ${reviews.length}\n`);
        
        reviews.forEach((review, index) => {
            console.log(`${index + 1}. ${review.title || 'No title'}`);
            console.log(`   👤 By: ${review.userId.firstName} ${review.userId.lastName}`);
            console.log(`   🛍️ Product: ${review.productId.name}`);
            console.log(`   ⭐ Rating: ${review.rating}/5`);
            console.log(`   💬 Comment: ${review.comment?.substring(0, 50) || 'No comment'}...`);
            console.log(`   ✅ Verified: ${review.isVerified ? 'Yes' : 'No'}`);
            console.log('');
        });
        
        // Coupons
        console.log('\n🎫 COUPONS:');
        const coupons = await Coupon.find({});
        console.log(`Total Coupons: ${coupons.length}\n`);
        
        coupons.forEach((coupon, index) => {
            console.log(`${index + 1}. ${coupon.name}`);
            console.log(`   🔑 Code: ${coupon.code}`);
            console.log(`   💰 Type: ${coupon.type} (${coupon.value}${coupon.type === 'percentage' ? '%' : '₹'})`);
            console.log(`   📅 Valid: ${coupon.validFrom.toLocaleDateString()} - ${coupon.validUntil.toLocaleDateString()}`);
            console.log(`   📊 Used: ${coupon.usedCount}/${coupon.usageLimit || 'Unlimited'}`);
            console.log(`   ✅ Active: ${coupon.isActive ? 'Yes' : 'No'}`);
            console.log('');
        });
        
        // Wishlist
        console.log('\n❤️ WISHLIST:');
        const wishlist = await Wishlist.find({}).populate('userId', 'firstName lastName').populate('productId', 'name price');
        console.log(`Total Wishlist Items: ${wishlist.length}\n`);
        
        wishlist.forEach((item, index) => {
            console.log(`${index + 1}. ${item.productId.name}`);
            console.log(`   👤 User: ${item.userId.firstName} ${item.userId.lastName}`);
            console.log(`   💰 Price: ₹${item.productId.price.toLocaleString()}`);
            console.log(`   📅 Added: ${item.createdAt.toLocaleDateString()}`);
            console.log('');
        });
        
        // Database Stats
        console.log('\n📈 DATABASE STATISTICS:');
        const stats = await dbConnection.getDatabaseStats();
        console.log(`Database: ${stats.database}`);
        console.log(`Collections: ${stats.collections}`);
        console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Total Objects: ${stats.objects}`);
        
        console.log('\n🎉 Database view complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await dbConnection.disconnect();
    }
}

viewDatabase();

