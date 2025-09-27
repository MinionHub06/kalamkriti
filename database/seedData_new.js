const { User, Product, Order, Review, Wishlist, Category, Coupon } = require('./models');

// Sample categories
const categories = [
    {
        name: 'Sarees',
        slug: 'sarees',
        description: 'Traditional and contemporary sarees for every occasion',
        image: '/images/categories/sarees.jpg',
        isActive: true,
        sortOrder: 1
    },
    {
        name: 'Kurtas',
        slug: 'kurtas',
        description: 'Comfortable and stylish kurtas for men and women',
        image: '/images/categories/kurtas.jpg',
        isActive: true,
        sortOrder: 2
    },
    {
        name: 'Dupattas',
        slug: 'dupattas',
        description: 'Elegant dupattas to complement your outfits',
        image: '/images/categories/dupattas.jpg',
        isActive: true,
        sortOrder: 3
    },
    {
        name: 'Shawls',
        slug: 'shawls',
        description: 'Warm and beautiful shawls for all seasons',
        image: '/images/categories/shawls.jpg',
        isActive: true,
        sortOrder: 4
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Handcrafted accessories to complete your look',
        image: '/images/categories/accessories.jpg',
        isActive: true,
        sortOrder: 5
    },
    {
        name: 'Home Textiles',
        slug: 'home-textiles',
        description: 'Beautiful handloom textiles for your home',
        image: '/images/categories/home-textiles.jpg',
        isActive: true,
        sortOrder: 6
    }
];

// Sample users (weavers)
const weavers = [
    {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@kalamkriti.com',
        phone: '9876543210',
        password: 'password123',
        userType: 'weaver',
        weaverProfile: {
            specialization: 'silk',
            experience: 15,
            bio: 'Master weaver with 15 years of experience in traditional Banarasi silk weaving. Specializes in intricate zari work and traditional patterns.',
            workshopLocation: {
                address: '123 Silk Street, Varanasi',
                city: 'Varanasi',
                state: 'Uttar Pradesh',
                pincode: '221001',
                coordinates: {
                    latitude: 25.3176,
                    longitude: 82.9739
                }
            },
            certifications: [
                {
                    name: 'Master Weaver Certificate',
                    issuingAuthority: 'Handloom Development Board',
                    dateIssued: new Date('2015-01-15'),
                    certificateUrl: '/certificates/rajesh-master-weaver.pdf'
                }
            ],
            skills: ['handloom', 'embroidery', 'design'],
            rating: {
                average: 4.8,
                count: 45
            },
            isVerified: true,
            verificationDocuments: [
                {
                    type: 'aadhar',
                    documentUrl: '/documents/rajesh-aadhar.pdf',
                    status: 'approved'
                }
            ]
        },
        addresses: [{
            type: 'home',
            isDefault: true,
            name: 'Rajesh Kumar',
            street: '123 Silk Street',
            city: 'Varanasi',
            state: 'Uttar Pradesh',
            pincode: '221001',
            country: 'India',
            phone: '+91 98765 43210'
        }],
        isActive: true,
        isEmailVerified: true
    },
    {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@kalamkriti.com',
        phone: '9876543211',
        password: 'password123',
        userType: 'weaver',
        weaverProfile: {
            specialization: 'cotton',
            experience: 12,
            bio: 'Expert in organic cotton weaving and block printing. Passionate about sustainable fashion and traditional techniques.',
            workshopLocation: {
                address: '456 Cotton Lane, Jaipur',
                city: 'Jaipur',
                state: 'Rajasthan',
                pincode: '302001',
                coordinates: {
                    latitude: 26.9124,
                    longitude: 75.7873
                }
            },
            skills: ['handloom', 'block_printing', 'dyeing'],
            rating: {
                average: 4.6,
                count: 32
            },
            isVerified: true
        },
        addresses: [{
            type: 'home',
            isDefault: true,
            name: 'Priya Sharma',
            street: '456 Cotton Lane',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001',
            country: 'India',
            phone: '+91 98765 43211'
        }],
        isActive: true,
        isEmailVerified: true
    },
    {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@kalamkriti.com',
        phone: '9876543212',
        password: 'password123',
        userType: 'weaver',
        weaverProfile: {
            specialization: 'wool',
            experience: 8,
            bio: 'Specialist in Pashmina and wool weaving from Kashmir. Creates luxurious shawls and stoles.',
            workshopLocation: {
                address: '789 Wool Road, Srinagar',
                city: 'Srinagar',
                state: 'Jammu and Kashmir',
                pincode: '190001',
                coordinates: {
                    latitude: 34.0837,
                    longitude: 74.7973
                }
            },
            skills: ['handloom', 'quality_control'],
            rating: {
                average: 4.9,
                count: 28
            },
            isVerified: true
        },
        addresses: [{
            type: 'home',
            isDefault: true,
            name: 'Amit Patel',
            street: '789 Wool Road',
            city: 'Srinagar',
            state: 'Jammu and Kashmir',
            pincode: '190001',
            country: 'India',
            phone: '+91 98765 43212'
        }],
        isActive: true,
        isEmailVerified: true
    }
];

// Sample customers
const customers = [
    {
        firstName: 'Sneha',
        lastName: 'Gupta',
        email: 'sneha.gupta@example.com',
        phone: '9876543213',
        password: 'password123',
        userType: 'customer',
        customerProfile: {
            preferences: {
                categories: ['sarees', 'kurtas'],
                priceRange: { min: 2000, max: 15000 },
                colors: ['red', 'blue', 'green'],
                sizes: ['M', 'L']
            },
            loyaltyPoints: 150,
            membershipTier: 'silver'
        },
        addresses: [{
            type: 'home',
            isDefault: true,
            name: 'Sneha Gupta',
            street: '101 Fashion Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            phone: '+91 98765 43213'
        }],
        isActive: true,
        isEmailVerified: true
    },
    {
        firstName: 'Arjun',
        lastName: 'Singh',
        email: 'arjun.singh@example.com',
        phone: '9876543214',
        password: 'password123',
        userType: 'customer',
        customerProfile: {
            preferences: {
                categories: ['kurtas', 'accessories'],
                priceRange: { min: 1000, max: 8000 },
                colors: ['white', 'black', 'navy'],
                sizes: ['L', 'XL']
            },
            loyaltyPoints: 75,
            membershipTier: 'bronze'
        },
        addresses: [{
            type: 'home',
            isDefault: true,
            name: 'Arjun Singh',
            street: '202 Style Avenue',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India',
            phone: '+91 98765 43214'
        }],
        isActive: true,
        isEmailVerified: true
    }
];

// Sample products with proper handloom images
const products = [
    {
        name: 'Heritage Banarasi Silk Saree',
        slug: 'heritage-banarasi-silk-saree',
        category: 'sarees',
        subcategory: 'silk',
        price: 18500,
        originalPrice: 22000,
        discount: 16,
        description: 'Exquisite Banarasi silk saree with intricate zari work and traditional motifs. Handwoven by master craftsmen using age-old techniques.',
        shortDescription: 'Traditional Banarasi silk with zari work',
        features: ['Handwoven', 'Pure Silk', 'Zari Work', 'Traditional Motifs'],
        materials: ['Pure Silk', 'Gold Zari', 'Silver Thread'],
        careInstructions: 'Dry clean only. Store in cool, dry place.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center&q=80',
                alt: 'Heritage Banarasi Silk Saree',
                isPrimary: true,
                order: 1
            }
        ],
        inventory: {
            inStock: true,
            quantity: 5,
            sku: 'BAN-SILK-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Red',
                    material: 'Silk',
                    quantity: 2,
                    price: 18500,
                    sku: 'BAN-SILK-001-RED'
                },
                {
                    size: 'Free Size',
                    color: 'Maroon',
                    material: 'Silk',
                    quantity: 3,
                    price: 18500,
                    sku: 'BAN-SILK-001-MAROON'
                }
            ]
        },
        weaverName: 'Rajesh Kumar',
        specifications: {
            dimensions: {
                length: 550,
                width: 110,
                unit: 'cm'
            },
            weight: {
                value: 800,
                unit: 'g'
            },
            colors: ['Red', 'Maroon'],
            sizes: ['Free Size'],
            patterns: ['Traditional Motifs', 'Zari Work'],
            techniques: ['Handwoven', 'Banarasi Weaving']
        },
        tags: ['silk', 'banarasi', 'traditional', 'zari', 'handwoven'],
        keywords: ['silk saree', 'banarasi', 'traditional', 'handwoven'],
        status: 'active',
        isFeatured: true,
        isBestseller: true,
        reviews: {
            average: 4.8,
            count: 12
        }
    },
    {
        name: 'Organic Cotton Block Print Kurta',
        slug: 'organic-cotton-block-print-kurta',
        category: 'kurtas',
        subcategory: 'cotton',
        price: 3200,
        originalPrice: 3800,
        discount: 16,
        description: 'Comfortable organic cotton kurta with beautiful block print design. Perfect for casual and semi-formal occasions.',
        shortDescription: 'Organic cotton with traditional block print',
        features: ['Organic Cotton', 'Block Print', 'Comfortable', 'Eco-friendly'],
        materials: ['100% Organic Cotton', 'Natural Dyes'],
        careInstructions: 'Machine wash cold. Air dry.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center&q=80',
                alt: 'Organic Cotton Block Print Kurta',
                isPrimary: true,
                order: 1
            }
        ],
        inventory: {
            inStock: true,
            quantity: 15,
            sku: 'COT-KURTA-001',
            variants: [
                {
                    size: 'M',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'COT-KURTA-001-M-BLUE'
                },
                {
                    size: 'L',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'COT-KURTA-001-L-BLUE'
                },
                {
                    size: 'XL',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'COT-KURTA-001-XL-BLUE'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 120,
                width: 60,
                unit: 'cm'
            },
            weight: {
                value: 300,
                unit: 'g'
            },
            colors: ['Blue'],
            sizes: ['M', 'L', 'XL'],
            patterns: ['Block Print'],
            techniques: ['Hand Block Printing', 'Natural Dyeing']
        },
        tags: ['cotton', 'organic', 'block-print', 'casual', 'eco-friendly'],
        keywords: ['cotton kurta', 'block print', 'organic', 'casual'],
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        reviews: {
            average: 4.5,
            count: 8
        }
    },
    {
        name: 'Chanderi Gold Zari Dupatta',
        slug: 'chanderi-gold-zari-dupatta',
        category: 'dupattas',
        subcategory: 'silk',
        price: 5800,
        originalPrice: 6500,
        discount: 11,
        description: 'Elegant Chanderi dupatta with intricate gold zari work. Lightweight and perfect for special occasions.',
        shortDescription: 'Chanderi dupatta with gold zari work',
        features: ['Chanderi Silk', 'Gold Zari', 'Lightweight', 'Elegant'],
        materials: ['Chanderi Silk', 'Gold Zari'],
        careInstructions: 'Dry clean only. Handle with care.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center&q=80',
                alt: 'Chanderi Gold Zari Dupatta',
                isPrimary: true,
                order: 1
            }
        ],
        inventory: {
            inStock: true,
            quantity: 8,
            sku: 'CHAN-DUPATTA-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Gold',
                    material: 'Chanderi Silk',
                    quantity: 8,
                    price: 5800,
                    sku: 'CHAN-DUPATTA-001-GOLD'
                }
            ]
        },
        weaverName: 'Rajesh Kumar',
        specifications: {
            dimensions: {
                length: 250,
                width: 100,
                unit: 'cm'
            },
            weight: {
                value: 150,
                unit: 'g'
            },
            colors: ['Gold'],
            sizes: ['Free Size'],
            patterns: ['Zari Work', 'Traditional Motifs'],
            techniques: ['Chanderi Weaving', 'Zari Work']
        },
        tags: ['chanderi', 'silk', 'zari', 'dupatta', 'elegant'],
        keywords: ['chanderi dupatta', 'gold zari', 'silk', 'elegant'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.7,
            count: 6
        }
    },
    {
        name: 'Kashmir Pashmina Shawl',
        slug: 'kashmir-pashmina-shawl',
        category: 'shawls',
        subcategory: 'wool',
        price: 12000,
        originalPrice: 15000,
        discount: 20,
        description: 'Luxurious Kashmir Pashmina shawl with intricate embroidery. Soft, warm, and perfect for winter.',
        shortDescription: 'Luxurious Kashmir Pashmina with embroidery',
        features: ['Pure Pashmina', 'Hand Embroidered', 'Luxurious', 'Warm'],
        materials: ['100% Pashmina', 'Silk Thread'],
        careInstructions: 'Dry clean only. Store in breathable bag.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center&q=80',
                alt: 'Kashmir Pashmina Shawl',
                isPrimary: true,
                order: 1
            }
        ],
        inventory: {
            inStock: true,
            quantity: 3,
            sku: 'PASH-SHAWL-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Cream',
                    material: 'Pashmina',
                    quantity: 2,
                    price: 12000,
                    sku: 'PASH-SHAWL-001-CREAM'
                },
                {
                    size: 'Free Size',
                    color: 'Brown',
                    material: 'Pashmina',
                    quantity: 1,
                    price: 12000,
                    sku: 'PASH-SHAWL-001-BROWN'
                }
            ]
        },
        weaverName: 'Amit Patel',
        specifications: {
            dimensions: {
                length: 200,
                width: 200,
                unit: 'cm'
            },
            weight: {
                value: 200,
                unit: 'g'
            },
            colors: ['Cream', 'Brown'],
            sizes: ['Free Size'],
            patterns: ['Floral Embroidery', 'Traditional Motifs'],
            techniques: ['Hand Embroidery', 'Pashmina Weaving']
        },
        tags: ['pashmina', 'kashmir', 'wool', 'luxury', 'warm'],
        keywords: ['pashmina shawl', 'kashmir', 'luxury', 'warm'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.9,
            count: 4
        }
    }
];

// Sample coupons
const coupons = [
    {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off on your first order',
        type: 'percentage',
        value: 10,
        minOrderAmount: 1000,
        maxDiscountAmount: 2000,
        usageLimit: 1000,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicableCategories: ['sarees', 'kurtas', 'dupattas', 'shawls'],
        userTypes: ['customer'],
        isActive: true
    },
    {
        code: 'SILK20',
        name: 'Silk Collection Sale',
        description: '20% off on all silk products',
        type: 'percentage',
        value: 20,
        minOrderAmount: 5000,
        maxDiscountAmount: 5000,
        usageLimit: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        applicableCategories: ['sarees', 'dupattas'],
        userTypes: ['customer'],
        isActive: true
    },
    {
        code: 'FREESHIP',
        name: 'Free Shipping',
        description: 'Free shipping on orders above ₹2000',
        type: 'free_shipping',
        value: 0,
        minOrderAmount: 2000,
        usageLimit: 2000,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        userTypes: ['customer'],
        isActive: true
    }
];

// Function to seed the database
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Review.deleteMany({});
        await Wishlist.deleteMany({});
        await Category.deleteMany({});
        await Coupon.deleteMany({});

        console.log('Cleared existing data');

        // Insert categories
        const insertedCategories = await Category.insertMany(categories);
        console.log(`Inserted ${insertedCategories.length} categories`);

        // Insert weavers
        const insertedWeavers = await User.insertMany(weavers);
        console.log(`Inserted ${insertedWeavers.length} weavers`);

        // Insert customers
        const insertedCustomers = await User.insertMany(customers);
        console.log(`Inserted ${insertedCustomers.length} customers`);

        // Update products with weaver IDs
        const productsWithWeavers = products.map((product, index) => {
            const weaverIndex = index % insertedWeavers.length;
            return {
                ...product,
                weaverId: insertedWeavers[weaverIndex]._id
            };
        });

        // Insert products
        const insertedProducts = await Product.insertMany(productsWithWeavers);
        console.log(`Inserted ${insertedProducts.length} products`);

        // Insert coupons
        const insertedCoupons = await Coupon.insertMany(coupons);
        console.log(`Inserted ${insertedCoupons.length} coupons`);

        // Create sample orders
        const sampleOrders = [
            {
                orderNumber: 'KK' + Date.now().toString().slice(-8) + '0001',
                userId: insertedCustomers[0]._id,
                customerInfo: {
                    firstName: insertedCustomers[0].firstName,
                    lastName: insertedCustomers[0].lastName,
                    email: insertedCustomers[0].email,
                    phone: insertedCustomers[0].phone
                },
                items: [
                    {
                        productId: insertedProducts[0]._id,
                        productName: insertedProducts[0].name,
                        productImage: insertedProducts[0].images[0].url,
                        quantity: 1,
                        unitPrice: insertedProducts[0].price,
                        totalPrice: insertedProducts[0].price,
                        variant: {
                            size: 'Free Size',
                            color: 'Red',
                            material: 'Silk'
                        }
                    }
                ],
                pricing: {
                    subtotal: insertedProducts[0].price,
                    discount: 0,
                    tax: Math.round(insertedProducts[0].price * 0.18),
                    shipping: 200,
                    total: insertedProducts[0].price + Math.round(insertedProducts[0].price * 0.18) + 200
                },
                shippingAddress: insertedCustomers[0].addresses[0],
                billingAddress: {
                    sameAsShipping: true
                },
                status: 'delivered',
                payment: {
                    method: 'card',
                    status: 'completed',
                    transactionId: 'TXN' + Date.now(),
                    paymentGateway: 'Razorpay',
                    paidAt: new Date()
                },
                shipping: {
                    method: 'standard',
                    trackingNumber: 'TRK' + Date.now(),
                    carrier: 'Blue Dart',
                    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    actualDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                },
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                confirmedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                shippedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ];

        const insertedOrders = await Order.insertMany(sampleOrders);
        console.log(`Inserted ${insertedOrders.length} orders`);

        // Create sample reviews
        const sampleReviews = [
            {
                productId: insertedProducts[0]._id,
                userId: insertedCustomers[0]._id,
                orderId: insertedOrders[0]._id,
                rating: 5,
                title: 'Absolutely beautiful!',
                comment: 'The saree is even more beautiful in person. The zari work is exquisite and the quality is outstanding. Highly recommended!',
                status: 'approved',
                isVerified: true,
                helpful: 3,
                notHelpful: 0
            },
            {
                productId: insertedProducts[1]._id,
                userId: insertedCustomers[1]._id,
                rating: 4,
                title: 'Great quality cotton',
                comment: 'Very comfortable and the block print is beautiful. Perfect for casual wear.',
                status: 'approved',
                isVerified: false,
                helpful: 1,
                notHelpful: 0
            }
        ];

        const insertedReviews = await Review.insertMany(sampleReviews);
        console.log(`Inserted ${insertedReviews.length} reviews`);

        // Create sample wishlist items
        const sampleWishlist = [
            {
                userId: insertedCustomers[0]._id,
                productId: insertedProducts[2]._id
            },
            {
                userId: insertedCustomers[1]._id,
                productId: insertedProducts[3]._id
            }
        ];

        const insertedWishlist = await Wishlist.insertMany(sampleWishlist);
        console.log(`Inserted ${insertedWishlist.length} wishlist items`);

        console.log('Database seeding completed successfully!');
        console.log('\nSample Data Summary:');
        console.log(`- Categories: ${insertedCategories.length}`);
        console.log(`- Weavers: ${insertedWeavers.length}`);
        console.log(`- Customers: ${insertedCustomers.length}`);
        console.log(`- Products: ${insertedProducts.length}`);
        console.log(`- Orders: ${insertedOrders.length}`);
        console.log(`- Reviews: ${insertedReviews.length}`);
        console.log(`- Wishlist Items: ${insertedWishlist.length}`);
        console.log(`- Coupons: ${insertedCoupons.length}`);

    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

module.exports = {
    seedDatabase,
    categories,
    weavers,
    customers,
    products,
    coupons
};
