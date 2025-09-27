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

// Sample products
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
            },
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center&q=80',
                alt: 'Heritage Banarasi Silk Saree - Detail',
                isPrimary: false,
                order: 2
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
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center',
                alt: 'Chanderi Gold Zari Dupatta',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Chanderi Gold Zari Dupatta - Detail',
                isPrimary: false,
                order: 2
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
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Kashmir Pashmina Shawl',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center',
                alt: 'Kashmir Pashmina Shawl - Detail',
                isPrimary: false,
                order: 2
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
    },
    // Additional Products
    {
        name: 'Kanjeevaram Silk Saree with Temple Border',
        slug: 'kanjeevaram-silk-saree-temple-border',
        category: 'sarees',
        subcategory: 'silk',
        price: 25000,
        originalPrice: 30000,
        discount: 17,
        description: 'Magnificent Kanjeevaram silk saree featuring intricate temple border designs and traditional motifs. Handwoven with pure silk and gold zari.',
        shortDescription: 'Traditional Kanjeevaram with temple border',
        features: ['Pure Kanjeevaram Silk', 'Temple Border', 'Gold Zari', 'Handwoven'],
        materials: ['Pure Silk', 'Gold Zari', 'Silver Thread'],
        careInstructions: 'Dry clean only. Store in muslin cloth.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center',
                alt: 'Kanjeevaram Silk Saree with Temple Border',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center',
                alt: 'Kanjeevaram Silk Saree - Border Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 3,
            sku: 'KAN-SILK-002',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Maroon',
                    material: 'Silk',
                    quantity: 2,
                    price: 25000,
                    sku: 'KAN-SILK-002-MAROON'
                },
                {
                    size: 'Free Size',
                    color: 'Green',
                    material: 'Silk',
                    quantity: 1,
                    price: 25000,
                    sku: 'KAN-SILK-002-GREEN'
                }
            ]
        },
        weaverName: 'Rajesh Kumar',
        specifications: {
            dimensions: {
                length: 600,
                width: 120,
                unit: 'cm'
            },
            weight: {
                value: 900,
                unit: 'g'
            },
            colors: ['Maroon', 'Green'],
            sizes: ['Free Size'],
            patterns: ['Temple Border', 'Traditional Motifs'],
            techniques: ['Handwoven', 'Kanjeevaram Weaving']
        },
        tags: ['kanjeevaram', 'silk', 'temple-border', 'traditional', 'handwoven'],
        keywords: ['kanjeevaram saree', 'temple border', 'silk', 'traditional'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.8,
            count: 6
        }
    },
    {
        name: 'Handwoven Cotton Saree with Block Print',
        slug: 'handwoven-cotton-saree-block-print',
        category: 'sarees',
        subcategory: 'cotton',
        price: 4500,
        originalPrice: 5500,
        discount: 18,
        description: 'Beautiful handwoven cotton saree with traditional block print patterns. Comfortable and perfect for daily wear.',
        shortDescription: 'Handwoven cotton with block print',
        features: ['Handwoven Cotton', 'Block Print', 'Comfortable', 'Daily Wear'],
        materials: ['100% Cotton', 'Natural Dyes'],
        careInstructions: 'Machine wash cold. Air dry.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center',
                alt: 'Handwoven Cotton Saree with Block Print',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Handwoven Cotton Saree - Print Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 12,
            sku: 'COT-SAREE-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 4,
                    price: 4500,
                    sku: 'COT-SAREE-001-BLUE'
                },
                {
                    size: 'Free Size',
                    color: 'Red',
                    material: 'Cotton',
                    quantity: 4,
                    price: 4500,
                    sku: 'COT-SAREE-001-RED'
                },
                {
                    size: 'Free Size',
                    color: 'Green',
                    material: 'Cotton',
                    quantity: 4,
                    price: 4500,
                    sku: 'COT-SAREE-001-GREEN'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 550,
                width: 110,
                unit: 'cm'
            },
            weight: {
                value: 400,
                unit: 'g'
            },
            colors: ['Blue', 'Red', 'Green'],
            sizes: ['Free Size'],
            patterns: ['Block Print', 'Traditional Motifs'],
            techniques: ['Hand Block Printing', 'Natural Dyeing']
        },
        tags: ['cotton', 'block-print', 'handwoven', 'daily-wear', 'comfortable'],
        keywords: ['cotton saree', 'block print', 'handwoven', 'daily wear'],
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        reviews: {
            average: 4.6,
            count: 15
        }
    },
    {
        name: 'Elegant Chikankari Kurta Set',
        slug: 'elegant-chikankari-kurta-set',
        category: 'kurtas',
        subcategory: 'cotton',
        price: 6800,
        originalPrice: 8000,
        discount: 15,
        description: 'Exquisite chikankari kurta set with intricate hand embroidery. Perfect for festive occasions and celebrations.',
        shortDescription: 'Chikankari kurta with hand embroidery',
        features: ['Chikankari Embroidery', 'Hand Embroidered', 'Festive Wear', 'Elegant'],
        materials: ['Cotton', 'Silk Thread'],
        careInstructions: 'Dry clean only. Handle with care.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Elegant Chikankari Kurta Set',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center',
                alt: 'Chikankari Kurta - Embroidery Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 8,
            sku: 'CHIK-KURTA-001',
            variants: [
                {
                    size: 'M',
                    color: 'White',
                    material: 'Cotton',
                    quantity: 2,
                    price: 6800,
                    sku: 'CHIK-KURTA-001-M-WHITE'
                },
                {
                    size: 'L',
                    color: 'White',
                    material: 'Cotton',
                    quantity: 3,
                    price: 6800,
                    sku: 'CHIK-KURTA-001-L-WHITE'
                },
                {
                    size: 'XL',
                    color: 'White',
                    material: 'Cotton',
                    quantity: 3,
                    price: 6800,
                    sku: 'CHIK-KURTA-001-XL-WHITE'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 125,
                width: 65,
                unit: 'cm'
            },
            weight: {
                value: 350,
                unit: 'g'
            },
            colors: ['White'],
            sizes: ['M', 'L', 'XL'],
            patterns: ['Chikankari Embroidery', 'Floral Motifs'],
            techniques: ['Hand Embroidery', 'Chikankari Work']
        },
        tags: ['chikankari', 'embroidery', 'festive', 'elegant', 'handmade'],
        keywords: ['chikankari kurta', 'hand embroidery', 'festive wear', 'elegant'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.7,
            count: 9
        }
    },
    {
        name: 'Traditional Bandhani Dupatta',
        slug: 'traditional-bandhani-dupatta',
        category: 'dupattas',
        subcategory: 'cotton',
        price: 3200,
        originalPrice: 3800,
        discount: 16,
        description: 'Vibrant bandhani dupatta with traditional tie-dye patterns. Lightweight and perfect for casual and semi-formal occasions.',
        shortDescription: 'Traditional bandhani with tie-dye patterns',
        features: ['Bandhani Work', 'Tie-Dye', 'Vibrant Colors', 'Lightweight'],
        materials: ['Cotton', 'Natural Dyes'],
        careInstructions: 'Hand wash cold. Air dry.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center',
                alt: 'Traditional Bandhani Dupatta',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Bandhani Dupatta - Pattern Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 15,
            sku: 'BAND-DUPATTA-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Yellow',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'BAND-DUPATTA-001-YELLOW'
                },
                {
                    size: 'Free Size',
                    color: 'Red',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'BAND-DUPATTA-001-RED'
                },
                {
                    size: 'Free Size',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 5,
                    price: 3200,
                    sku: 'BAND-DUPATTA-001-BLUE'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 250,
                width: 100,
                unit: 'cm'
            },
            weight: {
                value: 120,
                unit: 'g'
            },
            colors: ['Yellow', 'Red', 'Blue'],
            sizes: ['Free Size'],
            patterns: ['Bandhani', 'Tie-Dye Patterns'],
            techniques: ['Bandhani Work', 'Tie-Dye']
        },
        tags: ['bandhani', 'tie-dye', 'cotton', 'vibrant', 'traditional'],
        keywords: ['bandhani dupatta', 'tie-dye', 'cotton', 'vibrant'],
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        reviews: {
            average: 4.5,
            count: 12
        }
    },
    {
        name: 'Luxury Cashmere Shawl',
        slug: 'luxury-cashmere-shawl',
        category: 'shawls',
        subcategory: 'wool',
        price: 18000,
        originalPrice: 22000,
        discount: 18,
        description: 'Ultra-soft cashmere shawl with delicate embroidery. Perfect for special occasions and cold weather.',
        shortDescription: 'Ultra-soft cashmere with delicate embroidery',
        features: ['Pure Cashmere', 'Hand Embroidered', 'Ultra-Soft', 'Luxury'],
        materials: ['100% Cashmere', 'Silk Thread'],
        careInstructions: 'Dry clean only. Store in breathable bag.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Luxury Cashmere Shawl',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center',
                alt: 'Cashmere Shawl - Embroidery Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 2,
            sku: 'CASH-SHAWL-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Cream',
                    material: 'Cashmere',
                    quantity: 1,
                    price: 18000,
                    sku: 'CASH-SHAWL-001-CREAM'
                },
                {
                    size: 'Free Size',
                    color: 'Gray',
                    material: 'Cashmere',
                    quantity: 1,
                    price: 18000,
                    sku: 'CASH-SHAWL-001-GRAY'
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
                value: 180,
                unit: 'g'
            },
            colors: ['Cream', 'Gray'],
            sizes: ['Free Size'],
            patterns: ['Floral Embroidery', 'Delicate Motifs'],
            techniques: ['Hand Embroidery', 'Cashmere Weaving']
        },
        tags: ['cashmere', 'luxury', 'embroidery', 'soft', 'warm'],
        keywords: ['cashmere shawl', 'luxury', 'hand embroidered', 'soft'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.9,
            count: 3
        }
    },
    {
        name: 'Handwoven Jute Tote Bag',
        slug: 'handwoven-jute-tote-bag',
        category: 'accessories',
        subcategory: 'jute',
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        description: 'Eco-friendly handwoven jute tote bag with traditional patterns. Perfect for shopping and daily use.',
        shortDescription: 'Eco-friendly jute tote with traditional patterns',
        features: ['Eco-friendly', 'Handwoven', 'Durable', 'Traditional Patterns'],
        materials: ['100% Jute', 'Cotton Lining'],
        careInstructions: 'Spot clean. Air dry.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center',
                alt: 'Handwoven Jute Tote Bag',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Jute Tote Bag - Interior View',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 25,
            sku: 'JUTE-BAG-001',
            variants: [
                {
                    size: 'One Size',
                    color: 'Natural',
                    material: 'Jute',
                    quantity: 15,
                    price: 1200,
                    sku: 'JUTE-BAG-001-NATURAL'
                },
                {
                    size: 'One Size',
                    color: 'Brown',
                    material: 'Jute',
                    quantity: 10,
                    price: 1200,
                    sku: 'JUTE-BAG-001-BROWN'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 35,
                width: 40,
                unit: 'cm'
            },
            weight: {
                value: 200,
                unit: 'g'
            },
            colors: ['Natural', 'Brown'],
            sizes: ['One Size'],
            patterns: ['Traditional Weaving', 'Geometric Patterns'],
            techniques: ['Hand Weaving', 'Jute Crafting']
        },
        tags: ['jute', 'eco-friendly', 'tote-bag', 'handwoven', 'sustainable'],
        keywords: ['jute tote bag', 'eco-friendly', 'handwoven', 'sustainable'],
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        reviews: {
            average: 4.4,
            count: 18
        }
    },
    {
        name: 'Embroidered Cushion Covers Set',
        slug: 'embroidered-cushion-covers-set',
        category: 'home_textiles',
        subcategory: 'cotton',
        price: 2800,
        originalPrice: 3500,
        discount: 20,
        description: 'Beautiful set of embroidered cushion covers with traditional motifs. Perfect for home decoration.',
        shortDescription: 'Embroidered cushion covers with traditional motifs',
        features: ['Hand Embroidered', 'Traditional Motifs', 'Home Decor', 'Set of 2'],
        materials: ['Cotton', 'Silk Thread'],
        careInstructions: 'Machine wash cold. Air dry.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center',
                alt: 'Embroidered Cushion Covers Set',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center',
                alt: 'Cushion Covers - Embroidery Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 10,
            sku: 'CUSHION-SET-001',
            variants: [
                {
                    size: '18x18 inches',
                    color: 'Red',
                    material: 'Cotton',
                    quantity: 5,
                    price: 2800,
                    sku: 'CUSHION-SET-001-RED'
                },
                {
                    size: '18x18 inches',
                    color: 'Blue',
                    material: 'Cotton',
                    quantity: 5,
                    price: 2800,
                    sku: 'CUSHION-SET-001-BLUE'
                }
            ]
        },
        weaverName: 'Priya Sharma',
        specifications: {
            dimensions: {
                length: 45,
                width: 45,
                unit: 'cm'
            },
            weight: {
                value: 300,
                unit: 'g'
            },
            colors: ['Red', 'Blue'],
            sizes: ['18x18 inches'],
            patterns: ['Traditional Embroidery', 'Floral Motifs'],
            techniques: ['Hand Embroidery', 'Traditional Crafting']
        },
        tags: ['cushion-covers', 'embroidery', 'home-decor', 'traditional', 'handmade'],
        keywords: ['cushion covers', 'embroidered', 'home decor', 'traditional'],
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        reviews: {
            average: 4.6,
            count: 8
        }
    },
    {
        name: 'Silk Scarf with Paisley Print',
        slug: 'silk-scarf-paisley-print',
        category: 'accessories',
        subcategory: 'silk',
        price: 4500,
        originalPrice: 5500,
        discount: 18,
        description: 'Elegant silk scarf with beautiful paisley print. Perfect accessory for any outfit.',
        shortDescription: 'Elegant silk scarf with paisley print',
        features: ['Pure Silk', 'Paisley Print', 'Elegant', 'Versatile'],
        materials: ['100% Silk', 'Natural Dyes'],
        careInstructions: 'Dry clean only. Handle with care.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center',
                alt: 'Silk Scarf with Paisley Print',
                isPrimary: true,
                order: 1
            },
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center',
                alt: 'Silk Scarf - Paisley Detail',
                isPrimary: false,
                order: 2
            }
        ],
        inventory: {
            inStock: true,
            quantity: 12,
            sku: 'SILK-SCARF-001',
            variants: [
                {
                    size: 'Free Size',
                    color: 'Purple',
                    material: 'Silk',
                    quantity: 4,
                    price: 4500,
                    sku: 'SILK-SCARF-001-PURPLE'
                },
                {
                    size: 'Free Size',
                    color: 'Green',
                    material: 'Silk',
                    quantity: 4,
                    price: 4500,
                    sku: 'SILK-SCARF-001-GREEN'
                },
                {
                    size: 'Free Size',
                    color: 'Blue',
                    material: 'Silk',
                    quantity: 4,
                    price: 4500,
                    sku: 'SILK-SCARF-001-BLUE'
                }
            ]
        },
        weaverName: 'Rajesh Kumar',
        specifications: {
            dimensions: {
                length: 180,
                width: 60,
                unit: 'cm'
            },
            weight: {
                value: 80,
                unit: 'g'
            },
            colors: ['Purple', 'Green', 'Blue'],
            sizes: ['Free Size'],
            patterns: ['Paisley Print', 'Traditional Motifs'],
            techniques: ['Silk Printing', 'Traditional Dyeing']
        },
        tags: ['silk-scarf', 'paisley', 'elegant', 'accessory', 'versatile'],
        keywords: ['silk scarf', 'paisley print', 'elegant', 'accessory'],
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        reviews: {
            average: 4.7,
            count: 11
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
