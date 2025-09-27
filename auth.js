// Authentication and User Management
class AuthManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'handloom.html';
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        return this.user;
    }
}

// Global auth instance
const auth = new AuthManager();

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            if (!validatePassword(password)) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Signing In...';
            submitButton.disabled = true;
            
            const result = await auth.login(email, password);
            
            if (result.success) {
                alert('Login successful! Redirecting...');
                const redirectUrl = localStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert(result.error || 'Login failed. Please try again.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

// Registration form handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = Object.fromEntries(formData);
            
            // Validation
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(userData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            if (!validatePassword(userData.password)) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            
            if (userData.password !== userData.confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            if (!validatePhone(userData.phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            if (!userData.terms) {
                alert('Please accept the terms and conditions.');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Creating Account...';
            submitButton.disabled = true;
            
            const result = await auth.register(userData);
            
            if (result.success) {
                alert('Registration successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            } else {
                alert(result.error || 'Registration failed. Please try again.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

// Logout function
function logout() {
    auth.logout();
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update header component with current auth state
    if (window.headerComponent) {
        window.headerComponent.updateAuthState();
    }
    
    // Check if user is on a protected page
    const protectedPages = ['dashboard.html', 'product-detail.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!auth.isAuthenticated()) {
            // Store the intended destination
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }
        
        const user = auth.getCurrentUser();
        if (user) {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = `Welcome, ${user.firstName}`;
            }
        }
    }
    
    // Check for redirect after login
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl && auth.isAuthenticated()) {
        localStorage.removeItem('redirectAfterLogin');
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            window.location.href = redirectUrl;
        }
    }
});
