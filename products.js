// Products Management
class ProductManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.products = [];
        this.currentFilter = 'all';
    }

    async loadProducts() {
        try {
            const response = await fetch(`${this.apiBase}/products`);
            const data = await response.json();
            this.products = data.products || [];
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.loadMockProducts();
        }
    }

    loadMockProducts() {
        this.products = [
            {
                id: 1,
                name: "Heritage Silk Saree",
                category: "sarees",
                price: 18500,
                description: "Handwoven Banarasi Silk",
                image: "silk1",
                inStock: true
            },
            {
                id: 2,
                name: "Organic Cotton Kurta",
                category: "kurtas",
                price: 3200,
                description: "Block Print Collection",
                image: "cotton1",
                inStock: true
            },
            {
                id: 3,
                name: "Chanderi Dupatta",
                category: "dupattas",
                price: 5800,
                description: "Gold Zari Work",
                image: "dupatta1",
                inStock: true
            },
            {
                id: 4,
                name: "Pashmina Shawl",
                category: "shawls",
                price: 12000,
                description: "Kashmir Handloom",
                image: "shawl1",
                inStock: true
            },
            {
                id: 5,
                name: "Traditional Silk Saree",
                category: "sarees",
                price: 22000,
                description: "Pure Silk with Zari",
                image: "silk2",
                inStock: true
            },
            {
                id: 6,
                name: "Cotton Kurti Set",
                category: "kurtas",
                price: 4500,
                description: "Handwoven Cotton",
                image: "cotton2",
                inStock: true
            }
        ];
        this.renderProducts();
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const filteredProducts = this.currentFilter === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === this.currentFilter);

        grid.innerHTML = filteredProducts.map(product => {
            // Get the primary image URL
            const primaryImage = product.images && product.images.length > 0 
                ? product.images.find(img => img.isPrimary) || product.images[0]
                : null;
            
            const imageUrl = primaryImage ? primaryImage.url : this.getPlaceholderImage(product.category);
            
            return `
                <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group product-card">
                    <a href="product-detail.html?id=${product._id || product.id}" class="block">
                    <div class="relative overflow-hidden bg-gradient-to-br from-maroon/20 to-emerald/20" style="height: 300px;">
                        <img src="${imageUrl}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        ${product.discount > 0 ? `<div class="absolute top-2 right-2 bg-maroon text-white px-2 py-1 rounded text-xs font-semibold">${product.discount}% OFF</div>` : ''}
                    </div>
                    </a>
                    <div class="p-6">
                        <a href="product-detail.html?id=${product._id || product.id}" class="block">
                            <h3 class="font-serif font-semibold text-cocoa mb-2 hover:text-maroon transition-colors">${product.name}</h3>
                            <p class="text-cocoa/60 text-sm mb-3">${product.shortDescription || product.description}</p>
                        </a>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-2">
                                <p class="text-xl font-bold text-maroon">₹${product.price.toLocaleString()}</p>
                                ${product.originalPrice && product.originalPrice > product.price ? 
                                    `<p class="text-sm text-cocoa/50 line-through">₹${product.originalPrice.toLocaleString()}</p>` : ''
                                }
                            </div>
                            <button onclick="addToCart('${product._id || product.id}')" class="bg-maroon hover:bg-maroon/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getPlaceholderImage(category) {
        const placeholders = {
            'sarees': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=1000&fit=crop&crop=center&q=80',
            'kurtas': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center&q=80',
            'dupattas': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center&q=80',
            'shawls': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&h=1000&fit=crop&crop=center&q=80',
            'accessories': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center&q=80',
            'home_textiles': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&crop=center&q=80'
        };
        return placeholders[category] || placeholders['sarees'];
    }

    generateProductSVG(imageType) {
        const patterns = {
            silk1: `
                <defs>
                    <pattern id="silk1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill="#8B1538"/>
                        <circle cx="10" cy="10" r="3" fill="#B8860B" opacity="0.7"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#silk1)"/>
                <path d="M50 50 Q150 100 250 50 Q200 200 150 350 Q100 200 50 50" fill="#2D5016" opacity="0.3"/>
            `,
            cotton1: `
                <defs>
                    <pattern id="cotton1" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                        <rect width="15" height="15" fill="#2D5016"/>
                        <rect x="2" y="2" width="11" height="11" fill="#F7F3E9" opacity="0.8"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cotton1)"/>
                <ellipse cx="150" cy="200" rx="80" ry="150" fill="#B8860B" opacity="0.4"/>
            `,
            dupatta1: `
                <defs>
                    <pattern id="dupatta1" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                        <rect width="25" height="25" fill="#B8860B"/>
                        <path d="M0 12.5h25M12.5 0v25" stroke="#8B1538" stroke-width="1" opacity="0.6"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dupatta1)"/>
                <rect x="50" y="100" width="200" height="200" fill="#2D5016" opacity="0.2"/>
            `,
            shawl1: `
                <defs>
                    <pattern id="shawl1" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <rect width="30" height="30" fill="#2D5016"/>
                        <circle cx="15" cy="15" r="8" fill="#F7F3E9" opacity="0.9"/>
                        <circle cx="15" cy="15" r="4" fill="#8B1538" opacity="0.7"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#shawl1)"/>
                <path d="M0 0 Q150 50 300 0 L300 400 Q150 350 0 400 Z" fill="#3C2415" opacity="0.1"/>
            `,
            silk2: `
                <defs>
                    <pattern id="silk2" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                        <rect width="25" height="25" fill="#B8860B"/>
                        <rect x="5" y="5" width="15" height="15" fill="#8B1538" opacity="0.6"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#silk2)"/>
                <path d="M0 100 Q150 50 300 100 Q150 200 0 300 Q150 250 300 300" fill="#2D5016" opacity="0.4"/>
            `,
            cotton2: `
                <defs>
                    <pattern id="cotton2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill="#2D5016"/>
                        <circle cx="10" cy="10" r="6" fill="#F7F3E9" opacity="0.8"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cotton2)"/>
                <rect x="50" y="150" width="200" height="100" fill="#8B1538" opacity="0.3"/>
            `
        };
        
        return patterns[imageType] || patterns.silk1;
    }

    filterProducts(category) {
        this.currentFilter = category;
        this.renderProducts();
    }
}

// Global product manager
const productManager = new ProductManager();

// Filter buttons
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-maroon', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-white', 'text-cocoa', 'border', 'border-cocoa/20'));
            
            // Add active class to clicked button
            this.classList.add('active', 'bg-maroon', 'text-white');
            this.classList.remove('bg-white', 'text-cocoa', 'border', 'border-cocoa/20');
            
            const category = this.getAttribute('data-category');
            productManager.filterProducts(category);
        });
    });

    // Load products on page load
    productManager.loadProducts();
    
    // Handle URL parameters for category filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        // Find and click the appropriate filter button
        const filterButton = document.querySelector(`[data-category="${category}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
});

// Cart functionality - using shared cart.js
function addToCart(productId) {
    const product = productManager.products.find(p => (p._id || p.id) === productId);
    if (product) {
        // Prepare product data for cart
        const cartProduct = {
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            description: product.shortDescription || product.description,
            image: product.images && product.images.length > 0 ? product.images[0].url : '',
            category: product.category,
            quantity: 1
        };
        
        // Use the shared addToCart function from cart.js
        if (typeof window.addToCart === 'function') {
            window.addToCart(cartProduct);
        } else {
            // Fallback if cart.js is not loaded
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(cartProduct);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
        
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('bg-emerald');
        button.classList.remove('bg-maroon');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-emerald');
            button.classList.add('bg-maroon');
        }, 1000);
    }
}

// Cart modal functions are now handled by cart.js

// CSS for filter buttons
const style = document.createElement('style');
style.textContent = `
    .filter-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .filter-btn:hover {
        transform: translateY(-2px);
    }
    .filter-btn.active {
        background-color: #8B1538;
        color: white;
    }
`;
document.head.appendChild(style);
