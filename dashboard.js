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

    async loadBespokeRequests() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiBase}/bespoke/requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displayBespokeRequests(data.requests);
            }
        } catch (error) {
            console.error('Error loading bespoke requests:', error);
        }
    }

    displayBespokeRequests(requests) {
        const bespokeSection = document.getElementById('bespoke-section');
        if (!bespokeSection) return;
        
        const projectsContainer = bespokeSection.querySelector('.space-y-4');
        if (!projectsContainer) return;
        
        if (requests.length === 0) {
            projectsContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-maroon/20 to-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-cocoa mb-2">No Bespoke Projects Yet</h3>
                    <p class="text-cocoa/70 mb-4">Start your first custom project with our master weavers.</p>
                    <a href="bespoke.html" class="bg-maroon hover:bg-maroon/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                        Start Your Project
                    </a>
                </div>
            `;
            return;
        }
        
        const statusColors = {
            'submitted': 'bg-blue/10 text-blue',
            'under_review': 'bg-yellow/10 text-yellow',
            'design_phase': 'bg-purple/10 text-purple',
            'production': 'bg-orange/10 text-orange',
            'quality_check': 'bg-indigo/10 text-indigo',
            'completed': 'bg-emerald/10 text-emerald',
            'cancelled': 'bg-red/10 text-red'
        };
        
        const statusLabels = {
            'submitted': 'Submitted',
            'under_review': 'Under Review',
            'design_phase': 'Design Phase',
            'production': 'In Production',
            'quality_check': 'Quality Check',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        
        const projectTypes = {
            'saree': 'Saree',
            'kurta': 'Kurta Set',
            'dupatta': 'Dupatta',
            'shawl': 'Shawl',
            'other': 'Other'
        };
        
        projectsContainer.innerHTML = requests.map(request => `
            <div class="border border-cocoa/20 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-semibold text-cocoa text-lg">${projectTypes[request.projectType] || request.projectType}</h3>
                        <p class="text-cocoa/70 text-sm">Project #${request.requestNumber}</p>
                        <p class="text-cocoa/70 text-sm">Started: ${new Date(request.createdAt).toLocaleDateString()}</p>
                        ${request.assignedWeaver ? `<p class="text-cocoa/70 text-sm">Weaver: ${request.assignedWeaver.weaverName}</p>` : ''}
                    </div>
                    <span class="inline-block px-3 py-1 ${statusColors[request.status] || 'bg-gray/10 text-gray'} text-sm rounded-full">
                        ${statusLabels[request.status] || request.status}
                    </span>
                </div>
                <p class="text-cocoa/70 mb-4">
                    ${request.description.length > 150 ? request.description.substring(0, 150) + '...' : request.description}
                </p>
                <div class="flex space-x-4">
                    <button onclick="viewBespokeDetails('${request.requestNumber}')" class="text-maroon hover:text-maroon/80 font-medium">View Details</button>
                    ${request.assignedWeaver ? `<button onclick="contactWeaver('${request.assignedWeaver.weaverId}')" class="text-cocoa/70 hover:text-cocoa font-medium">Contact Weaver</button>` : ''}
                </div>
            </div>
        `).join('');
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
    
    // Load bespoke requests
    dashboardManager.loadBespokeRequests();
    
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

// Helper functions for bespoke requests
function viewBespokeDetails(requestNumber) {
    // TODO: Implement detailed view modal
    alert(`Viewing details for project #${requestNumber}`);
}

function contactWeaver(weaverId) {
    // TODO: Implement weaver contact functionality
    alert(`Contacting weaver ${weaverId}`);
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'handloom.html';
}
