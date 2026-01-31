// Fabbrica Mebel - Main JavaScript File

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Initialize all functionality
    initMobileMenu();
    initScrollReveal();
    initDropdowns();
    initFormValidation();
    initAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    
    // Function to open mobile menu
    window.toggleMenu = function() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.toggle('translate-x-full');
        }
    };
    
    // Close menu button functionality
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function() {
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('translate-x-full');
            }
        });
    }
    
    // Close menu when clicking on overlay background
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('translate-x-full');
            }
        });
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// Dropdown Menu Functionality
function initDropdowns() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('[id$="-dropdown"]') && !event.target.closest('[id$="-menu"]')) {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    const allMenus = document.querySelectorAll('[id$="-menu"]');
    const overlay = document.getElementById('dropdown-overlay');
    
    allMenus.forEach(menu => {
        menu.classList.add('hidden');
    });
    
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Show error message
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message text-red-500 text-sm mt-1';
                        field.parentNode.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'Bu xana mütləq doldurulmalıdır';
                } else {
                    field.classList.remove('border-red-500');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Mesajınız uğurla göndərildi!', 'success');
                form.reset();
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Animations
function initAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Language Switcher
function switchLanguage(lang) {
    // Store language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Update UI (you would implement actual translation logic here)
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('bg-brand', 'text-white');
        btn.classList.add('text-slate-600');
    });
    
    const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-600');
        activeBtn.classList.add('bg-brand', 'text-white');
    }
    
    // Reload page with new language (in production, you'd translate content)
    window.location.reload();
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchResults();
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#search-input') && !e.target.closest('#search-results')) {
                hideSearchResults();
            }
        });
    }
}

function performSearch(query) {
    // Mock search results (in production, this would be an API call)
    const mockResults = [
        { title: 'TV şkafı Model A', price: '1,200 AZN', image: 'tv-shkaf.jpg' },
        { title: 'Divar dəsti Model B', price: '800 AZN', image: 'divar-dest.jpg' },
        { title: 'Yazı stolu Model C', price: '450 AZN', image: 'yazi-stolu.jpg' }
    ];
    
    displaySearchResults(mockResults);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    searchResults.classList.remove('hidden');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-4 text-slate-500">Heç nə tapılmadı</div>';
        return;
    }
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'p-4 hover:bg-slate-50 cursor-pointer border-b';
        resultItem.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="images/products/${result.image}" alt="${result.title}" class="w-12 h-12 object-cover rounded">
                <div>
                    <div class="font-medium">${result.title}</div>
                    <div class="text-brand font-semibold">${result.price}</div>
                </div>
            </div>
        `;
        
        resultItem.addEventListener('click', () => {
            // Navigate to product page
            window.location.href = `product.html?id=${result.id}`;
        });
        
        searchResults.appendChild(resultItem);
    });
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.add('hidden');
    }
}

// Cart Management
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartUI();
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartUI();
        showNotification('Məhsul səbətə əlavə edildi', 'success');
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        if (cartTotal) {
            cartTotal.textContent = `${this.getTotal()} AZN`;
        }
    }
}

// Initialize cart
const cart = new CartManager();

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('az-AZ', {
        style: 'currency',
        currency: 'AZN'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.Fabbrica = {
    switchLanguage,
    showNotification,
    cart,
    formatPrice,
    debounce
};
