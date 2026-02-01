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
    
    // Initialize thank you page if we're on it
    initThankYouPage();
    
    // Initialize shop page scroll reveal
    initShopScrollReveal();
    
    // Initialize cart page if we're on it
    initCartPage();
    
    // Initialize checkout page if we're on it
    initCheckoutPage();
    
    // Initialize contact page if we're on it
    initContactPage();
    
    // Initialize index page if we're on it
    initIndexPage();
    
    // Initialize project detail page if we're on it
    initProjectDetailPage();
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

// Thank You Page Functions
function initThankYouPage() {
    // Check if we're on the thank you page
    if (!document.querySelector('.bg-gradient-to-br')) return;
    
    // Generate random order number
    generateOrderNumber();
    
    // Add animation classes to elements
    addThankYouAnimations();
    
    // Start countdown timer
    startCountdown();
    
    // Add parallax effect
    initParallax();
}

function generateOrderNumber() {
    const orderNumberElement = document.querySelector('.text-2xl.font-bold.text-slate-900');
    if (orderNumberElement) {
        const randomNum = Math.floor(Math.random() * 9999) + 1;
        orderNumberElement.textContent = `#FAB-2024-${randomNum.toString().padStart(4, '0')}`;
    }
}

function addThankYouAnimations() {
    // Don't add reveal class to avoid animation conflicts
    // Add success icon animation
    const successIcon = document.querySelector('.w-24.h-24.bg-brand\\/20');
    if (successIcon) {
        successIcon.classList.add('success-icon');
    }
    
    // Add button hover effects
    const buttons = document.querySelectorAll('a[class*="rounded-full"]');
    buttons.forEach(button => {
        if (button.textContent.includes('Ana səhifəyə qayıt')) {
            button.classList.add('btn-brand');
        } else if (button.textContent.includes('Alış-verişə davam et')) {
            button.classList.add('btn-secondary');
        }
    });
    
    // Add step card classes
    const stepCardIcons = document.querySelectorAll('.text-center .w-16.h-16');
    stepCardIcons.forEach(icon => {
        icon.classList.add('step-icon');
        const card = icon.closest('.text-center');
        if (card) {
            card.classList.add('step-card');
        }
    });
    
    // Add contact card classes
    const contactCards = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm.p-6');
    contactCards.forEach(card => {
        card.classList.add('contact-card');
    });
}

function startCountdown() {
    const orderTime = new Date();
    const timerElement = document.createElement('div');
    timerElement.className = 'text-sm text-slate-500 mt-4';
    timerElement.innerHTML = 'Sifarişiniz <span id="countdown">0</span> dəqiqə əvvəl qəbul edildi';
    
    const orderNumberContainer = document.querySelector('.bg-white.rounded-lg.shadow-sm.p-6');
    if (orderNumberContainer && !document.getElementById('countdown')) {
        orderNumberContainer.appendChild(timerElement);
        
        setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - orderTime) / 60000); // minutes
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = diff;
            }
        }, 60000); // update every minute
    }
}

function initParallax() {
    // Disable parallax effect for thank you page
    return;
}

// Shop Page Scroll Reveal
function initShopScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
}

// Cart Page Functions
function initCartPage() {
    // Quantity controls
    document.querySelectorAll('.fa-plus').forEach(btn => {
        btn.parentElement.addEventListener('click', () => {
            const quantitySpan = btn.parentElement.nextElementSibling;
            const currentQuantity = parseInt(quantitySpan.textContent);
            quantitySpan.textContent = currentQuantity + 1;
            updateCartTotal();
        });
    });

    document.querySelectorAll('.fa-minus').forEach(btn => {
        btn.parentElement.addEventListener('click', () => {
            const quantitySpan = btn.parentElement.nextElementSibling;
            const currentQuantity = parseInt(quantitySpan.textContent);
            if (currentQuantity > 1) {
                quantitySpan.textContent = currentQuantity - 1;
                updateCartTotal();
            }
        });
    });
}

// Update cart total
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let itemCount = 0;
    
    cartItems.forEach(item => {
        const price = parseInt(item.dataset.price);
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        subtotal += price * quantity;
        itemCount += quantity;
    });
    
    const shipping = 50;
    const tax = Math.round(subtotal * 0.02); // 2% tax
    const total = subtotal + shipping + tax;
    
    // Update summary
    const summaryElements = document.querySelectorAll('.flex.justify-between.text-slate-600');
    if (summaryElements[0]) {
        summaryElements[0].innerHTML = `
            <span>Məhsulların dəyəri (${itemCount})</span>
            <span>₼${subtotal.toLocaleString()}</span>
        `;
    }
    
    if (summaryElements[1]) {
        summaryElements[1].innerHTML = `
            <span>Çatdırılma</span>
            <span>₼${shipping}</span>
        `;
    }
    
    if (summaryElements[2]) {
        summaryElements[2].innerHTML = `
            <span>Vergi</span>
            <span>₼${tax}</span>
        `;
    }
    
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = `₼${total.toLocaleString()}`;
    }
}

// Update quantity
function updateQuantity(button, change) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    const currentQuantity = parseInt(quantitySpan.textContent);
    const newQuantity = Math.max(1, currentQuantity + change);
    quantitySpan.textContent = newQuantity;
    updateCartTotal();
}

// Remove item
function removeItem(button) {
    const cartItem = button.closest('.cart-item');
    cartItem.remove();
    updateCartTotal();
    
    // Check if cart is empty
    const remainingItems = document.querySelectorAll('.cart-item');
    if (remainingItems.length === 0) {
        const flexContainer = document.querySelector('.flex-1');
        if (flexContainer) {
            flexContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-sm p-12 text-center">
                    <i class="fas fa-shopping-cart text-6xl text-slate-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-slate-900 mb-2">Səbətiniz boşdur</h3>
                    <p class="text-slate-500 mb-6">Alış-verişə davam etmək üçün mağazaya qayıdın</p>
                    <a href="shop.html" class="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brandDark transition">
                        <i class="fas fa-arrow-left"></i>
                        Mağazaya qayıt
                    </a>
                </div>
            `;
        }
    }
}

// Checkout Page Functions
function initCheckoutPage() {
    // Form validation
    const submitButton = document.querySelector('button[class*="bg-brand"]');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get all required fields
            const requiredFields = document.querySelectorAll('input[required], input[placeholder*="*"], textarea[placeholder*="*"]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('border-red-500');
                    isValid = false;
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                // Show success message
                alert('Sifarişiniz uğurla qəbul edildi! Tezliklə sizinlə əlaqə saxlanılacaq.');
                // Redirect to success page or home
                window.location.href = 'thank-you.html';
            } else {
                alert('Zəhmət olmasa, bütün vacib sahələri doldurun.');
            }
        });
    }

    // Add required attribute to required fields
    document.querySelectorAll('input[placeholder*="*"], textarea[placeholder*="*"]').forEach(field => {
        field.setAttribute('required', '');
    });
}

// Contact Page Functions
function initContactPage() {
    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin w-4 h-4"></i> Göndərilir...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                formStatus.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle w-4 h-4"></i> Mesajınız uğurla göndərildi!</span>';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            }, 2000);
        });
    }
}

// Index Page Functions
function initIndexPage() {
    // --- SLIDER LOGIC ---
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
            title: "Premium mebel istehsalı: Estetika və funksionallığın sərhədsiz harmoniyası",
            nextTitle: "Mətbəx Həlləri"
        },
        {
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop",
            title: "Mətbəxiniz üçün mükəmməl həllər: Dad və dizaynın görüşdüyü məkan",
            nextTitle: "Yataq Otağı"
        },
        {
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
            title: "Rahatlıq və şıklığın ünvanı: Yuxularınızı bəzəyən yataq otaqları",
            nextTitle: "Premium Dizayn"
        }
    ];

    let currentSlide = 0;
    let progress = 0;
    let sliderInterval;
    const duration = 5000; // 5 seconds per slide
    const updateInterval = 50; // Update progress bar every 50ms

    const heroBg = document.getElementById('hero-bg');
    const heroTitle = document.getElementById('hero-title');
    const nextSlideImg = document.getElementById('next-slide-img');
    const nextSlideTitle = document.getElementById('next-slide-title');
    const progressBar = document.getElementById('slider-progress');

    // SYNC HEIGHTS FUNCTION
    function syncHeights() {
        const textPanel = document.getElementById('hero-text-panel');
        const slideCard = document.getElementById('next-slide-card');
        if(textPanel && slideCard) {
            slideCard.style.height = `${textPanel.offsetHeight}px`;
        }
    }

    function startSlider() {
        clearInterval(sliderInterval);
        progress = 0;
        updateNextSlidePreview();
        syncHeights(); // Sync initially
        
        sliderInterval = setInterval(() => {
            progress += (updateInterval / duration) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                changeSlide();
                progress = 0;
                if (progressBar) progressBar.style.width = '0%';
            }
        }, updateInterval);
    }

    function changeSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        const slide = slides[currentSlide];

        // Fade out
        if (heroBg) heroBg.style.opacity = '0';
        
        setTimeout(() => {
            // Change Content
            if (heroBg) heroBg.src = slide.image;
            if (heroTitle) heroTitle.textContent = slide.title;
            
            // Fade in
            if (heroBg) {
                heroBg.onload = () => {
                    heroBg.style.opacity = '1';
                };
                
                // Fallback if cached
                if(heroBg.complete) heroBg.style.opacity = '1';
            }

            updateNextSlidePreview();
            
            // Sync heights after text content change
            setTimeout(syncHeights, 50); 
        }, 500); // Wait for fade out
    }

    function forceNextSlide() {
        progress = 100; // Force trigger
    }

    function updateNextSlidePreview() {
        const nextIndex = (currentSlide + 1) % slides.length;
        const nextSlide = slides[nextIndex];
        
        if (nextSlideImg) nextSlideImg.src = nextSlide.image;
        if (nextSlideTitle) nextSlideTitle.textContent = nextSlide.nextTitle;
    }

    // --- NUMBER COUNTER ANIMATION ---
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the slower

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    
                    const updateCount = () => {
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Start slider and other animations
    if (heroBg || heroTitle) {
        startSlider();
        initCounters();
        window.onresize = syncHeights; // Sync on resize
    }
}

// Project Detail Page Functions
function initProjectDetailPage() {
    // --- GALLERY SLIDER ---
    let currentSlide = 0;
    const totalSlides = 4;

    function updateSlider() {
        const slider = document.getElementById('gallery-slider');
        if (slider) {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update thumbnails
            const thumbnails = document.querySelectorAll('[onclick^="goToSlide"]');
            thumbnails.forEach((thumb, index) => {
                if (index === currentSlide) {
                    thumb.classList.remove('opacity-60');
                    thumb.classList.add('opacity-100', 'border-brand');
                    thumb.classList.remove('border-transparent');
                } else {
                    thumb.classList.add('opacity-60');
                    thumb.classList.remove('opacity-100', 'border-brand');
                    thumb.classList.add('border-transparent');
                }
            });
        }
    }

    // Make slider functions global for onclick handlers
    window.nextSlide = function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    };

    window.previousSlide = function() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    };

    window.goToSlide = function(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    };

    // Initialize slider if on project detail page
    if (document.getElementById('gallery-slider')) {
        updateSlider();
    }
}


// Export functions for global use
window.Fabbrica = {
    switchLanguage,
    showNotification,
    cart,
    formatPrice,
    debounce,
    generateOrderNumber,
    addThankYouAnimations
};
