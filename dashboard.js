// Dashboard Management
class DashboardManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.currentSection = 'profile';
    }

    async loadUserData() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBase}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.populateProfileForm(data.user);
            } else {
                // Load mock data if API fails
                this.loadMockData();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.loadMockData();
        }
    }

    loadMockData() {
        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210',
            userType: 'customer'
        };
        this.populateProfileForm(mockUser);
    }

    populateProfileForm(user) {
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }

    async updateProfile(formData) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBase}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('[id$="-section"]');
        sections.forEach(section => section.classList.add('hidden'));
        
        // Show selected section
        const targetSection = document.getElementById(sectionId + '-section');
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update navigation
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('bg-cream');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('bg-cream');
            }
        });
    }
}

// Global dashboard manager
const dashboardManager = new DashboardManager();

// Navigation handlers
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    dashboardManager.loadUserData();
    
    // Navigation click handlers
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            dashboardManager.showSection(sectionId);
        });
    });
    
    // Profile form handler
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Updating...';
            submitButton.disabled = true;
            
            const result = await dashboardManager.updateProfile(formData);
            
            if (result.success) {
                alert('Profile updated successfully!');
            } else {
                alert(result.error || 'Failed to update profile. Please try again.');
            }
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
    
    // Weaver form handler
    const weaverForm = document.getElementById('weaver-form');
    if (weaverForm) {
        weaverForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Updating...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Weaver profile updated successfully!');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1000);
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'handloom.html';
}
