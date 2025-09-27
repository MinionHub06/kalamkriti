// Shared Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Cart Modal Functions
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) {
        console.warn('Cart modal not found on this page');
        return;
    }
    
    modal.classList.toggle('hidden');
    
    if (!modal.classList.contains('hidden')) {
        loadCartModal();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function loadCartModal() {
    const cartItemsContainer = document.getElementById('cart-modal-items');
    const emptyCart = document.getElementById('cart-modal-empty');
    const cartFooter = document.getElementById('cart-modal-footer');
    
    if (!cartItemsContainer || !emptyCart || !cartFooter) {
        console.warn('Cart modal elements not found');
        return;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCart.classList.remove('hidden');
        cartFooter.classList.add('hidden');
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartFooter.classList.remove('hidden');
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-cocoa/10">
            <div class="w-16 h-16 bg-gradient-to-br from-maroon/30 to-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            
            <div class="flex-1 min-w-0">
                <h3 class="font-serif font-semibold text-cocoa mb-1 truncate">${item.name}</h3>
                <p class="text-cocoa/60 text-sm mb-2 truncate">${item.description}</p>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center border border-cocoa/20 rounded-lg">
                        <button onclick="updateCartQuantity(${index}, -1)" class="px-3 py-1 text-cocoa hover:bg-cream transition-colors">-</button>
                        <span class="px-3 py-1 text-cocoa font-medium min-w-[2rem] text-center">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, 1)" class="px-3 py-1 text-cocoa hover:bg-cream transition-colors">+</button>
                    </div>
                    <span class="text-lg font-bold text-maroon">₹${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
            
            <button onclick="removeFromCart(${index})" class="text-cocoa/50 hover:text-maroon transition-colors p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    updateCartModalSummary();
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartModal();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartModal();
    updateCartCount();
}

function updateCartModalSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 200 : 0;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.getElementById('cart-modal-subtotal');
    const shippingEl = document.getElementById('cart-modal-shipping');
    const taxEl = document.getElementById('cart-modal-tax');
    const totalEl = document.getElementById('cart-modal-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = `₹${shipping}`;
    if (taxEl) taxEl.textContent = `₹${tax}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Close modal
    toggleCartModal();
    
    // Redirect to cart page
    window.location.href = 'cart.html';
}

// Add to cart function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
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

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cart-modal');
    if (modal && e.target === modal) {
        toggleCartModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('cart-modal');
        if (modal && !modal.classList.contains('hidden')) {
            toggleCartModal();
        }
    }
});

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

