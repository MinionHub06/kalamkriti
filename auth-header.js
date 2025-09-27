// Shared Authentication Header Management
class AuthHeaderManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    updateHeader() {
        // Find the auth section in the header
        const authSection = document.querySelector('header .flex.items-center.space-x-4 > div:last-child') || 
                           document.querySelector('header .flex.items-center.space-x-4:last-child');
        
        if (authSection) {
            if (this.isAuthenticated()) {
                // User is logged in - show welcome message and logout
                authSection.innerHTML = `
                    <span class="text-cocoa font-medium">Welcome, ${this.user.firstName}</span>
                    <a href="dashboard.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Dashboard</a>
                    <button onclick="logout()" class="text-cocoa hover:text-maroon transition-colors font-medium">Logout</button>
                `;
            } else {
                // User is not logged in - show login/signup buttons
                authSection.innerHTML = `
                    <a href="login.html" class="text-cocoa hover:text-maroon transition-colors font-medium">Login</a>
                    <a href="register.html" class="bg-maroon text-white px-4 py-2 rounded-lg font-medium hover:bg-maroon/90 transition-colors">Sign Up</a>
                `;
            }
        }
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getCurrentUser() {
        return this.user;
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateHeader();
        window.location.href = 'handloom.html';
    }

    requireAuth(redirectTo = 'login.html') {
        if (!this.isAuthenticated()) {
            alert('Please log in to access this page.');
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }
}

// Global auth header manager
const authHeader = new AuthHeaderManager();

// Global logout function
function logout() {
    authHeader.logout();
}

// Update headers on page load
document.addEventListener('DOMContentLoaded', function() {
    authHeader.updateHeader();
});

// Export for use in other scripts
window.authHeader = authHeader;
