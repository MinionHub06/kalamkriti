// Centralized Header Component
class HeaderComponent {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    generateHeader() {
        const isAuthenticated = !!this.token && !!this.user;
        
        return `
            <header class="bg-cream/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-cocoa/10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center">
                            <a href="handloom.html" class="text-2xl font-serif font-bold text-cocoa">KalamKriti</a>
                        </div>
                        <nav class="hidden md:flex space-x-8">
                            <a href="products.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Products</a>
                            <a href="weavers.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Our Weavers</a>
                            <a href="bespoke.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Bespoke Studio</a>
                            <a href="about.html" class="text-cocoa hover:text-maroon transition-colors font-medium">About Us</a>
                            <a href="dashboard.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Dashboard</a>
                        </nav>
                        <div class="flex items-center space-x-4">
                            <!-- Cart Button -->
                            <button onclick="toggleCartModal()" class="relative text-cocoa hover:text-maroon transition-colors font-medium p-2 hidden md:block">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                                </svg>
                                <span class="cart-count absolute -top-2 -right-2 bg-maroon text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold hidden">0</span>
                            </button>
                            
                            ${isAuthenticated ? `
                                <span class="text-cocoa font-medium">Welcome, ${this.user.firstName}</span>
                                <a href="dashboard.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Dashboard</a>
                                <button onclick="logout()" class="text-cocoa hover:text-maroon transition-colors font-medium">Logout</button>
                            ` : `
                                <a href="login.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Login</a>
                                <a href="register.html" class="bg-maroon text-white px-4 py-2 rounded-lg font-medium hover:bg-maroon/90 transition-colors">Sign Up</a>
                            `}
                            
                            <button class="md:hidden text-cocoa" id="mobile-menu-button">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Menu -->
                <div class="md:hidden hidden" id="mobile-menu">
                    <div class="px-2 pt-2 pb-3 space-y-1 bg-cream border-t border-cocoa/10">
                        <a href="products.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Products</a>
                        <a href="weavers.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Our Weavers</a>
                        <a href="bespoke.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Bespoke Studio</a>
                        <a href="about.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">About Us</a>
                        <a href="dashboard.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Dashboard</a>
                        <a href="cart.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Cart</a>
                        ${isAuthenticated ? `
                            <button onclick="logout()" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium w-full text-left">Logout</button>
                        ` : `
                            <a href="login.html" class="block px-3 py-2 text-cocoa hover:text-maroon transition-colors font-medium">Login</a>
                        `}
                    </div>
                </div>
            </header>
        `;
    }

    render() {
        // Find existing header and replace it
        const existingHeader = document.querySelector('header');
        if (existingHeader) {
            existingHeader.outerHTML = this.generateHeader();
        } else {
            // If no header exists, prepend to body
            document.body.insertAdjacentHTML('afterbegin', this.generateHeader());
        }
        
        // Add mobile menu functionality
        this.addMobileMenuHandlers();
        
        // Update cart count
        this.updateCartCount();
    }

    addMobileMenuHandlers() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(element => {
            if (totalItems > 0) {
                element.textContent = totalItems;
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    updateAuthState() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.render();
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.render();
        window.location.href = 'handloom.html';
    }
}

// Global header instance
const headerComponent = new HeaderComponent();

// Global logout function
function logout() {
    headerComponent.logout();
}

// Render header on page load
document.addEventListener('DOMContentLoaded', function() {
    headerComponent.render();
});

// Update header when auth state changes
window.addEventListener('storage', function(e) {
    if (e.key === 'authToken' || e.key === 'user') {
        headerComponent.updateAuthState();
    }
});

// Export for use in other scripts
window.headerComponent = headerComponent;

