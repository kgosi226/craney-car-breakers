// Loading screen - Fixed version
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    // Hide loading screen after page loads
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Only prevent default for same-page anchor links
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
        // For external links, let them work normally
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.querySelector('nav');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
});

// Back to top button
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Car inquiry function
function inquireAboutCar(carModel) {
    const message = `Hello, I'm interested in parts from your ${carModel}. Could you please provide more information?`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/26776497944?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        this.reset();
    });
}

// Stats counter animation - FIXED VERSION
function animateStats() {
    const statItems = document.querySelectorAll('.stat-item h3');
    
    statItems.forEach(stat => {
        const originalText = stat.textContent;
        
        // Skip animation for non-numeric values like "Nationwide"
        if (isNaN(parseInt(originalText))) {
            return; // Don't animate text values
        }
        
        const target = parseInt(originalText);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = originalText; // Use original text to preserve "+" symbol
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + (originalText.includes('+') ? '+' : '');
            }
        }, 30);
    });
}

// Start animation when stats section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// Smart Part Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const partSearch = document.getElementById('partSearch');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Sample part database (in real implementation, this would come from a server)
    const partsDatabase = [
        { id: 1, name: 'Toyota Hilux 2.8 Engine', category: 'engine', car: 'Toyota Hilux 2018', condition: 'Excellent', price: 'BWP 4,500' },
        { id: 2, name: 'BMW 320i Transmission', category: 'transmission', car: 'BMW 320i 2015', condition: 'Good', price: 'BWP 3,200' },
        { id: 3, name: 'Mercedes C200 Interior Seats', category: 'interior', car: 'Mercedes C200 2016', condition: 'Like New', price: 'BWP 1,800' },
        { id: 4, name: 'Ford Ranger Body Door', category: 'body', car: 'Ford Ranger 2019', condition: 'Good', price: 'BWP 800' },
        { id: 5, name: 'Honda Civic Electrical System', category: 'electrical', car: 'Honda Civic 2017', condition: 'Working', price: 'BWP 1,200' },
        { id: 6, name: 'Nissan Navara Suspension', category: 'suspension', car: 'Nissan Navara 2016', condition: 'Good', price: 'BWP 950' },
        { id: 7, name: 'Toyota Corolla Engine', category: 'engine', car: 'Toyota Corolla 2019', condition: 'Excellent', price: 'BWP 3,800' },
        { id: 8, name: 'BMW X3 Transmission', category: 'transmission', car: 'BMW X3 2017', condition: 'Good', price: 'BWP 4,100' }
    ];

    // Show suggestions when input is focused
    if (partSearch) {
        partSearch.addEventListener('focus', function() {
            searchSuggestions.classList.add('show');
        });

        // Search when button is clicked
        searchButton.addEventListener('click', performSearch);

        // Search when Enter key is pressed
        partSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Auto-suggest while typing
        partSearch.addEventListener('input', function() {
            if (this.value.length > 2) {
                showAutoSuggestions(this.value);
            }
        });
    }

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (partSearch && !partSearch.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('show');
        }
    });

    // Quick search from suggestion tags
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.getAttribute('data-search');
            partSearch.value = searchTerm;
            performSearch();
            searchSuggestions.classList.remove('show');
        });
    });

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            searchByCategory(category);
        });
    });

    function performSearch() {
        const searchTerm = partSearch.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Please enter a search term');
            return;
        }

        const results = partsDatabase.filter(part => 
            part.name.toLowerCase().includes(searchTerm) ||
            part.car.toLowerCase().includes(searchTerm) ||
            part.category.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(results, searchTerm);
        searchSuggestions.classList.remove('show');
    }

    function showAutoSuggestions(input) {
        // Simple auto-suggestion logic
        // In a real app, this would make API calls
        console.log('Showing suggestions for:', input);
    }

    function searchByCategory(category) {
        const results = partsDatabase.filter(part => 
            part.category === category
        );

        displaySearchResults(results, category);
    }

    function displaySearchResults(results, searchTerm) {
        // Remove existing results if any
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.innerHTML = `
            <div class="results-header">
                <div class="results-count">
                    Found ${results.length} parts for "${searchTerm}"
                </div>
                <button class="clear-search" onclick="clearSearch()">
                    <i class="fas fa-times"></i> Clear Search
                </button>
            </div>
            <div class="results-grid">
                ${results.length > 0 ? 
                    results.map(part => `
                        <div class="result-card">
                            <div class="result-info">
                                <h4>${part.name}</h4>
                                <p class="result-car">From: ${part.car}</p>
                                <p class="result-condition">Condition: ${part.condition}</p>
                                <p class="result-price">${part.price}</p>
                            </div>
                            <div class="result-actions">
                                <button class="btn-inquire" onclick="inquireAboutPart('${part.name}')">
                                    Inquire About Part
                                </button>
                                <a href="tel:+26776497944" class="btn-call">
                                    <i class="fas fa-phone"></i>
                                </a>
                            </div>
                        </div>
                    `).join('') :
                    `<div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No parts found for "${searchTerm}"</h3>
                        <p>Try searching for different terms or <a href="contact.html">contact us</a> for special requests.</p>
                    </div>`
                }
            </div>
        `;

        // Add styles for results
        const resultsStyles = `
            <style>
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px;
                }
                
                .result-card {
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }
                
                .result-info h4 {
                    color: #1d3557;
                    margin-bottom: 10px;
                }
                
                .result-car {
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .result-condition {
                    color: #2a9d8f;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .result-price {
                    color: #e63946;
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                
                .result-actions {
                    display: flex;
                    gap: 10px;
                    flex-shrink: 0;
                }
                
                .no-results {
                    text-align: center;
                    padding: 60px 20px;
                    grid-column: 1 / -1;
                }
                
                .no-results i {
                    font-size: 4rem;
                    color: #e0e0e0;
                    margin-bottom: 20px;
                }
                
                .no-results h3 {
                    color: #666;
                    margin-bottom: 10px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', resultsStyles);
        document.querySelector('.part-search').appendChild(resultsContainer);
        
        // Show results with animation
        setTimeout(() => {
            resultsContainer.classList.add('show');
        }, 100);
    }
});

// Global function to clear search
function clearSearch() {
    const results = document.querySelector('.search-results');
    if (results) {
        results.remove();
    }
    
    const searchInput = document.getElementById('partSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
}

// Global function to inquire about a part
function inquireAboutPart(partName) {
    const message = `Hello, I'm interested in the ${partName}. Could you please provide more information and availability?`;
    const whatsappUrl = `https://wa.me/26776497944?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== IMPROVED QUICK VIEW FUNCTIONALITY =====
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeQuickViewBtn = document.querySelector('.close-quick-view');
    
    if (!quickViewModal) {
        console.error('Quick View modal not found!');
        return;
    }
    
    // Open Quick View when button is clicked
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carId = this.getAttribute('data-car');
            console.log('Opening Quick View for car:', carId);
            openQuickView(carId);
        });
    });
    
    // Close Quick View
    if (closeQuickViewBtn) {
        closeQuickViewBtn.addEventListener('click', closeQuickView);
    }
    
    // Close when clicking outside modal
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            closeQuickView();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickViewModal.style.display === 'block') {
            closeQuickView();
        }
    });
}

function openQuickView(carId) {
    const quickViewModal = document.getElementById('quickViewModal');
    const carElement = document.querySelector(`[data-car="${carId}"]`);
    
    if (!carElement) {
        console.error('Car element not found for ID:', carId);
        return;
    }
    
    const carListing = carElement.closest('.car-listing');
    
    if (!carListing) {
        console.error('Car listing not found');
        return;
    }
    
    try {
        // Get car data with fallbacks
        const carTitle = carListing.querySelector('h3')?.textContent || 'Vehicle';
        const carYear = carListing.querySelector('.car-year')?.textContent || '';
        const carImage = carListing.querySelector('.car-main-image')?.src || 'Images/default-car.jpg';
        const carDescription = carListing.querySelector('.car-condition-desc')?.textContent || 'No description available';
        
        // Get specs with fallbacks
        const specs = carListing.querySelectorAll('.spec-item span');
        const mileage = specs[0]?.textContent || 'Not specified';
        const fuel = specs[1]?.textContent || 'Not specified';
        const transmission = specs[2]?.textContent || 'Not specified';
        
        const conditionBadge = carListing.querySelector('.badge.condition');
        const condition = conditionBadge?.textContent || 'Used';
        
        // Get parts
        const parts = Array.from(carListing.querySelectorAll('.part-tag')).map(tag => tag.textContent);
        
        console.log('Car data loaded:', { carTitle, carYear, carImage, parts });
        
        // Populate Quick View modal
        document.getElementById('quickViewTitle').textContent = carTitle;
        document.getElementById('quickViewYear').textContent = carYear;
        document.getElementById('quickViewMainImage').src = carImage;
        document.getElementById('quickViewMainImage').alt = carTitle;
        document.getElementById('quickViewMileage').textContent = mileage;
        document.getElementById('quickViewFuel').textContent = fuel;
        document.getElementById('quickViewTransmission').textContent = transmission;
        document.getElementById('quickViewCondition').textContent = condition;
        document.getElementById('quickViewDescription').textContent = carDescription;
        
        // Populate parts
        const partsContainer = document.getElementById('quickViewParts');
        if (partsContainer) {
            partsContainer.innerHTML = parts.map(part => 
                `<span class="part-tag">${part}</span>`
            ).join('');
        }
        
        // Set up WhatsApp button
        const whatsappBtn = document.getElementById('quickViewWhatsApp');
        if (whatsappBtn) {
            const whatsappMessage = `Hello, I'm interested in parts from your ${carTitle} (${carYear}). Could you please provide more information about available parts and prices?`;
            const whatsappUrl = `https://wa.me/26776497944?text=${encodeURIComponent(whatsappMessage)}`;
            whatsappBtn.onclick = function() {
                window.open(whatsappUrl, '_blank');
            };
        }
        
        // Setup thumbnails
        const thumbnailsContainer = document.getElementById('quickViewThumbnails');
        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = `
                <img src="${carImage}" alt="${carTitle}" class="thumbnail active" onclick="changeQuickViewImage('${carImage}')">
            `;
        }
        
        // Show modal
        quickViewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('Quick View opened successfully');
        
    } catch (error) {
        console.error('Error opening Quick View:', error);
        // Fallback: Show basic alert with car info
        const carTitle = carListing.querySelector('h3')?.textContent || 'Vehicle';
        alert(`Quick View for ${carTitle}\n\nImage: Loaded\nParts: ${parts.join(', ')}`);
    }
}

function changeQuickViewImage(src) {
    const mainImage = document.getElementById('quickViewMainImage');
    if (mainImage) {
        mainImage.src = src;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    event.target.classList.add('active');
}

function closeQuickView() {
    const quickViewModal = document.getElementById('quickViewModal');
    if (quickViewModal) {
        quickViewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== LOAD MORE VEHICLES FUNCTION =====
function loadMoreVehicles() {
    const moreVehicles = [
        {
            name: "Golf 5 GTI 2008",
            km: "65,000 km",
            fuel: "Petrol", 
            transmission: "Automatic",
            description: "Transmission problems. Engine and body in perfect condition.",
            parts: ["Engine", "Body Parts", "Suspension", "Interior"],
            image: "Images/Golf 5 GTI.jpg",
            year: "2008",
            brand: "volkswagen",
            condition: "mechanical"
        },
        {
            name: "Golf 7 TSI 2013",
            km: "45,000 km", 
            fuel: "Petrol",
            transmission: "Automatic",
            description: "Electrical issues. Interior and body in excellent condition.",
            parts: ["Interior", "Body Parts", "Electronics", "Wheels", "Lights"],
            image: "Images/Golf 7 TSI.jpg",
            year: "2013",
            brand: "volkswagen", 
            condition: "electrical"
        },
        {
            name: "Ford Ranger 2017",
            km: "95,000 km",
            fuel: "Diesel",
            transmission: "Manual", 
            description: "Transmission failure. Well-maintained vehicle with many usable parts.",
            parts: ["Transmission", "Engine Parts", "Body Panels", "Suspension", "Interior"],
            image: "Images/Ford Ranger.jpg",
            year: "2017",
            brand: "ford",
            condition: "mechanical"
        },
               {
            name: "Honda CRV K24",
            km: "105,000 km",
            fuel: "Petrol",
            transmission: "Automatic", 
            description: "Failed Transmission. Well-maintained vehicle with many usable parts.",
            parts: ["Wheels", "Engine Parts", "Body Panels", "Suspension", "Interior"],
            image: "Images/Honda Crv.jpg",
            year: "2010",
            brand: "honda",
            condition: "mechanical"
        },
                {
            name: "Honda Fit 1.3",
            km: "150,000 km",
            fuel: "Petrol",
            transmission: "Automatic", 
            description: "Transmission Problems. Well-maintained vehicle with many usable parts.",
            parts: ["Engine Parts", "Body Panels", "Suspension", "Interior"],
            image: "Images/Honda Fit 1.3.jpg",
            year: "2010",
            brand: "honda",
            condition: "mechanical"
        },
        {
            name: "Audi Q5",
            km: "160,000 km",
            fuel: "Diesel",
            transmission: "Manual", 
            description: "Engine Overheated. Well-maintained vehicle with many usable parts.",
            parts: ["Transmission", "Some Engine Parts", "Body Panels", "Suspension", "Interior"],
            image: "Images/Audi Q5.jpg",
            year: "2009",
            brand: "audi",
            condition: "mechanical"
        },

                {
            name: "Mercedes Benz C63",
            km: "180,000 km",
            fuel: "Petrol",
            transmission: "Automatic", 
            description: "Accident Damaged. Many usable parts available.",
            parts: ["Transmission", "Engine", "Body Panels", "Suspension", "Interior"],
            image: "Images/Mercedes Benz C63.jpg",
            year: "2012",
            brand: "mercedes benz",
            condition: "accident"
        }



    ];

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const carsContainer = document.getElementById('carsContainer');
    
    moreVehicles.forEach(vehicle => {
        const carId = vehicle.name.toLowerCase().replace(/ /g, '-');
        const vehicleHTML = `
            <div class="car-listing" data-brand="${vehicle.brand}" data-condition="${vehicle.condition}" data-date="2024-01-20">
                <div class="car-image">
                    <img src="${vehicle.image}" alt="${vehicle.name}" class="car-main-image" data-car="${carId}">
                    <div class="car-badges">
                        <span class="badge new">NEW</span>
                        <span class="badge condition">${vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}</span>
                    </div>
                    <div class="car-overlay">
                        <button class="quick-view" data-car="${carId}">Quick View</button>
                        <button class="zoom-image" data-car="${carId}">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                
                <div class="car-details">
                    <div class="car-header">
                        <h3>${vehicle.name}</h3>
                        <span class="car-year">${vehicle.year}</span>
                    </div>
                    
                    <div class="car-specs">
                        <div class="spec-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${vehicle.km}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-gas-pump"></i>
                            <span>${vehicle.fuel}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-cog"></i>
                            <span>${vehicle.transmission}</span>
                        </div>
                    </div>
                    
                    <p class="car-condition-desc">${vehicle.description}</p>
                    
                    <div class="parts-available">
                        <h4>Available Parts:</h4>
                        <div class="parts-tags">
                            ${vehicle.parts.map(part => `<span class="part-tag">${part}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="car-actions">
                        <button class="btn-primary" onclick="inquireAboutCar('${vehicle.name}')">
                            <i class="fas fa-info-circle"></i> Inquire About Parts
                        </button>
                        <div class="action-buttons">
                            <a href="tel:+26776497944" class="btn-call" title="Call Now">
                                <i class="fas fa-phone"></i>
                            </a>
                            <a href="https://wa.me/26776497944?text=Hi, I'm interested in parts from ${vehicle.name}" class="btn-whatsapp" title="WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to the cars container
        carsContainer.insertAdjacentHTML('beforeend', vehicleHTML);
    });

    // Re-initialize lightbox for new images
    setTimeout(() => {
        initializeLightboxForNewCars();
    }, 100);

    // Re-initialize Quick View for new cars
    setTimeout(() => {
        initializeQuickView();
    }, 150);

    // Hide the button after loading
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Function to initialize lightbox for newly loaded cars
function initializeLightboxForNewCars() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDescription');
    
    if (!lightbox) return;
    
    // Get ALL car images (including newly loaded ones)
    const carImages = document.querySelectorAll('.car-main-image');
    const zoomButtons = document.querySelectorAll('.zoom-image');
    
    let currentImageIndex = 0;
    const images = Array.from(carImages);
    
    function openLightbox(index) {
        currentImageIndex = index;
        const img = images[currentImageIndex];
        const carCard = img.closest('.car-listing');
        const carTitle = carCard.querySelector('h3').textContent;
        const carDesc = carCard.querySelector('.car-condition-desc').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = carTitle;
        lightboxDesc.textContent = carDesc;
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Add event listeners to NEW images only (ones that don't have existing listeners)
    carImages.forEach((img, index) => {
        // Check if this image already has a click handler
        if (!img.hasAttribute('data-lightbox-initialized')) {
            img.setAttribute('data-lightbox-initialized', 'true');
            img.addEventListener('click', () => openLightbox(index));
        }
    });
    
    // Add event listeners to NEW zoom buttons only
    zoomButtons.forEach((btn, index) => {
        if (!btn.hasAttribute('data-lightbox-initialized')) {
            btn.setAttribute('data-lightbox-initialized', 'true');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });
        }
    });
}

// Contact buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactButtons();
});

function initializeContactButtons() {
    const phoneNumber = '+26776497944';
    const formattedPhoneNumber = '+267 764 97944';
    
    // Modern contact buttons functionality
    const callButtons = document.querySelectorAll('.btn-modern-primary');
    const whatsappButtons = document.querySelectorAll('.btn-modern-whatsapp');
    const copyButtons = document.querySelectorAll('.btn-modern-outline');
    
    // Call buttons
    callButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = `tel:${phoneNumber}`;
        });
    });
    
    // WhatsApp buttons
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = "Hello! I'm interested in auto parts. Can you help me find what I need?";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
    
    // Copy phone number buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            navigator.clipboard.writeText(formattedPhoneNumber).then(function() {
                showToast('Phone number copied to clipboard!');
            }).catch(function() {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = formattedPhoneNumber;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Phone number copied to clipboard!');
            });
        });
    });
    
    // Existing car inquiry buttons
    const inquireButtons = document.querySelectorAll('.btn-primary');
    inquireButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const carTitle = this.closest('.car-listing').querySelector('h3').textContent;
            inquireAboutCar(carTitle);
        });
    });
    
    // Toast notification function
    function showToast(message) {
        // Create toast if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Add ripple effect to all modern buttons
    const modernButtons = document.querySelectorAll('.btn-modern');
    modernButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
    });
}

function createRippleEffect(button, e) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Remove existing ripples
    const existingRipples = button.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.querySelector('nav');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && !e.target.closest('.mobile-menu')) {
            nav.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Grid/List View Toggle for Cars Page
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const carsContainer = document.getElementById('carsContainer');
    
    if (!viewButtons.length || !carsContainer) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const viewType = this.getAttribute('data-view');
            
            if (viewType === 'list') {
                carsContainer.classList.add('list-view');
                carsContainer.classList.remove('grid-view');
            } else {
                carsContainer.classList.remove('list-view');
                carsContainer.classList.add('grid-view');
            }
            
            // Save user preference
            localStorage.setItem('carsViewPreference', viewType);
        });
    });
    
    // Load saved preference
    const savedView = localStorage.getItem('carsViewPreference');
    if (savedView === 'list') {
        document.querySelector('[data-view="list"]').click();
    }
}

// Filter functionality for cars page
function initializeCarFilters() {
    const brandFilter = document.getElementById('brandFilter');
    const conditionFilter = document.getElementById('conditionFilter');
    const sortFilter = document.getElementById('sortFilter');
    const carsSearch = document.getElementById('carsSearch');
    const carsSearchBtn = document.getElementById('carsSearchBtn');
    const carsCount = document.getElementById('carsCount');

    // Check if we're on cars page
    if (!brandFilter) return;

    console.log('Initializing car filters...');

    function filterCars() {
        const brandValue = brandFilter.value;
        const conditionValue = conditionFilter.value;
        const searchValue = carsSearch ? carsSearch.value.toLowerCase().trim() : '';
        const sortValue = sortFilter ? sortFilter.value : 'newest';

        const carListings = document.querySelectorAll('.car-listing');
        let visibleCount = 0;

        carListings.forEach(car => {
            const carBrand = car.getAttribute('data-brand');
            const carCondition = car.getAttribute('data-condition');
            const carTitle = car.querySelector('h3').textContent.toLowerCase();
            const carDescription = car.querySelector('.car-condition-desc').textContent.toLowerCase();

            // Brand filter
            const brandMatch = brandValue === 'all' || carBrand === brandValue;
            
            // Condition filter
            const conditionMatch = conditionValue === 'all' || carCondition === conditionValue;
            
            // Search filter
            const searchMatch = !searchValue || 
                               carTitle.includes(searchValue) || 
                               carDescription.includes(searchValue);

            if (brandMatch && conditionMatch && searchMatch) {
                car.style.display = 'block';
                visibleCount++;
            } else {
                car.style.display = 'none';
            }
        });

        // Update cars count
        if (carsCount) {
            carsCount.textContent = `Showing ${visibleCount} Vehicle${visibleCount !== 1 ? 's' : ''}`;
        }

        // Sort cars
        sortCars(sortValue);
    }

    function sortCars(sortBy) {
        const container = document.getElementById('carsContainer');
        const visibleCars = Array.from(container.querySelectorAll('.car-listing[style="display: block"], .car-listing:not([style])'));

        visibleCars.sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                case 'oldest':
                    return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                case 'make':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                default:
                    return 0;
            }
        });

        // Reappend sorted cars
        visibleCars.forEach(car => container.appendChild(car));
    }

    // Event listeners
    if (brandFilter) brandFilter.addEventListener('change', filterCars);
    if (conditionFilter) conditionFilter.addEventListener('change', filterCars);
    if (sortFilter) sortFilter.addEventListener('change', filterCars);
    
    if (carsSearch) {
        carsSearch.addEventListener('input', filterCars);
        if (carsSearchBtn) {
            carsSearchBtn.addEventListener('click', filterCars);
        }
    }

    // Initial filter to set count
    setTimeout(filterCars, 100);
}

// Load More functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Simulate loading more cars
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            // In a real app, this would fetch more data from a server
            alert('In a real implementation, this would load more cars from your database.');
            
            this.innerHTML = '<i class="fas fa-plus"></i> Load More Vehicles';
            this.disabled = false;
        }, 1500);
    });
}

// Initialize all car page functionality when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing car filters...');
    
    // Initialize Quick View
    initializeQuickView();
    
    // Initialize car filters
    initializeCarFilters();
    
    // Initialize view toggle if it exists
    if (typeof initializeViewToggle === 'function') {
        initializeViewToggle();
    }
    
    // Initialize load more if it exists
    if (typeof initializeLoadMore === 'function') {
        initializeLoadMore();
    }
    
    // Load More button event listener
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreVehicles);
    }
});

// Global lightbox re-initialization function
function reinitializeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDescription');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox) return;
    
    let currentImageIndex = 0;
    let images = [];
    
    function updateImages() {
        images = Array.from(document.querySelectorAll('.car-main-image'));
    }
    
    function openLightbox(index) {
        currentImageIndex = index;
        const img = images[currentImageIndex];
        const carCard = img.closest('.car-listing');
        const carTitle = carCard.querySelector('h3').textContent;
        const carDesc = carCard.querySelector('.car-condition-desc').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = carTitle;
        lightboxDesc.textContent = carDesc;
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Update images list
    updateImages();
    
    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigation
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openLightbox(currentImageIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openLightbox(currentImageIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                openLightbox(currentImageIndex);
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                openLightbox(currentImageIndex);
            }
        }
    });
    
    // Re-export for global access
    window.reinitializeLightbox = reinitializeLightbox;
}

// Call this after Load More to update lightbox
window.updateLightbox = function() {
    reinitializeLightbox();
};