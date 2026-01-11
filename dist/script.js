// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing mobile menu...');
    
    const mobileMenu = document.getElementById('mobileMenu');
    const openMenuBtn = document.getElementById('openMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const backToTopBtn = document.getElementById('backToTop');

    // Debug: Check if elements exist
    console.log('Mobile menu element:', mobileMenu);
    console.log('Open menu button:', openMenuBtn);
    console.log('Close menu button:', closeMenuBtn);

    if (!mobileMenu || !openMenuBtn || !closeMenuBtn) {
        console.error('Mobile menu elements not found!');
        return;
    }

    // Open mobile menu
    openMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Opening mobile menu...');
        mobileMenu.classList.add('show');
        const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
        if (slideElement) {
            // Small delay to ensure the display: block is applied first
            setTimeout(() => {
                slideElement.classList.add('show');
            }, 10);
        }
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    closeMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Closing mobile menu...');
        
        // Add closing class for smooth exit animation
        mobileMenu.classList.add('closing');
        const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
        if (slideElement) {
            slideElement.classList.remove('show');
        }
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            mobileMenu.classList.remove('show', 'closing');
            document.body.style.overflow = 'auto';
        }, 400); // Match the CSS transition duration
    });

/* ---------------- ELEMENTS ---------------- */
const parent = document.querySelector("#track");
const serviceCards = Array.from(parent.children);
const dotsContainer = document.getElementById("dots");

/* ---------------- STATE ---------------- */
let index = 0;
let autoSlideTimer = null;

/* ---------------- UTILITY ---------------- */
function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function visibleCount() {
  return isDesktop() ? 3 : 1;
}

function maxIndex() {
  return serviceCards.length - visibleCount();
}

/* ---------------- DOTS ---------------- */
function renderDots(activeIndex) {
  dotsContainer.innerHTML = "";
  const totalDots = maxIndex() + 1;

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("div");
    dot.className = `
      w-2 h-2 rounded-full
      ${i === activeIndex ? "bg-blue-600 w-4" : "bg-gray-400"}
    `;
    dotsContainer.appendChild(dot);
  }
}

/* ---------------- AUTO-SLIDE ---------------- */
function stopAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(slideNext, 6000);
}

/* ---------------- SLIDE LOGIC ---------------- */
function slideNext() {
  index = (index + 1) % (maxIndex() + 1);
  updateSlider();
}

function slidePrev() {
  index = index === 0 ? maxIndex() : index - 1;
  updateSlider();
}

function updateSlider() {
  const cardWidth = serviceCards[0].offsetWidth;
  parent.style.transform = `translateX(-${(cardWidth + 16) * index}px)`;
  renderDots(index);
}

/* ---------------- MOBILE SWIPE ---------------- */
if (!isDesktop()) {
  let startX = 0;
  let currentX = 0;
  const SWIPE_THRESHOLD = 50;
  let isDragging = false;

  const swipeArea = parent.parentElement; // wrapper of the slider

  swipeArea.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoSlide();
  });

  swipeArea.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  swipeArea.addEventListener("touchend", () => {
    if (!isDragging) return;

    const diff = currentX - startX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff < 0 ? slideNext() : slidePrev();
    }

    isDragging = false;
    startX = currentX = 0;

    // reset auto-slide after swipe
    startAutoSlide();
  });
}

/* ---------------- INIT ---------------- */
updateSlider();
startAutoSlide();

/* ---------------- RESIZE HANDLING ---------------- */
window.addEventListener("resize", () => {
  // recalc visible count and max index on resize
  updateSlider();
});

 
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            console.log('Closing menu - clicked outside');
            
            // Add closing class for smooth exit animation
            mobileMenu.classList.add('closing');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                mobileMenu.classList.remove('show', 'closing');
                document.body.style.overflow = 'auto';
            }, 400); // Match the CSS transition duration
        }
    });

    // Close menu when clicking on nav links
    const mobileNavLinks = mobileMenu.querySelectorAll('nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Closing menu - nav link clicked');
            
            // Add closing class for smooth exit animation
            mobileMenu.classList.add('closing');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                mobileMenu.classList.remove('show', 'closing');
                document.body.style.overflow = 'auto';
            }, 400); // Match the CSS transition duration
        });
    });

    // Test function for debugging
    window.testMobileMenu = function() {
        console.log('Test function called');
        if (mobileMenu.classList.contains('show')) {
            // Add closing class for smooth exit animation
            mobileMenu.classList.add('closing');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                mobileMenu.classList.remove('show', 'closing');
                document.body.style.overflow = 'auto';
            }, 400);
            console.log('Menu should now be hidden');
        } else {
            mobileMenu.classList.add('show');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                // Small delay to ensure the display: block is applied first
                setTimeout(() => {
                    slideElement.classList.add('show');
                }, 10);
            }
            console.log('Menu should now be visible');
        }
    };

    // Smooth scrolling for all anchor links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button functionality
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Testimonials carousel for desktop
        const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (carousel && prevBtn && nextBtn) {
        const testimonials = [
            {
                text: "Working with Kings Designs was an absolute pleasure. The attention to detail and creativity exceeded my expectations.",
                name: "Samuel A.",
                role: "Entrepreneur"
            },
            {
                text: "The design captured my brand perfectly. Communication was smooth and delivery was right on time.",
                name: "Amaka C.",
                role: "Social Media Manager"
            },
            {
                text: "Highly recommended! Professional, creative, and dedicated. I look forward to working together again.",
                name: "David K.",
                role: "Startup Founder"
            }
        ];

        let currentIndex = 0;

        function updateCarousel() {
            const testimonial = testimonials[currentIndex];
            carousel.innerHTML = `
                <div class="bg-white p-8 min-w-full shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl">
                    <div class="text-[#1311a3f3] text-6xl mb-6">❝</div>
                    <p class="text-slate-800 font-medium mb-8 text-lg max-w-3xl">
                        "${testimonial.text}"
                    </p>
                    <div>
                        <h4 class="font-semibold text-[#1311a3f3] text-xl">${testimonial.name}</h4>
                        <span class="text-slate-500">${testimonial.role}</span>
                    </div>
                </div>
            `;
        }

        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateCarousel();
        });

        // Auto-rotate testimonials every 5 seconds
        setInterval(function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateCarousel();
        }, 5000);
    }

    // Form submission handling
    const newsletterForm = document.querySelector('form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message (you can customize this)
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
    }
  });
}

    // Portfolio page specific behaviors (if present)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const projectButtons = document.querySelectorAll('[data-project-id]');
    const projectModal = document.getElementById('projectModal');
    const closeProjectBtn = document.getElementById('closeProject');
    const projectTitle = document.getElementById('projectTitle');
    const projectCategory = document.getElementById('projectCategory');
    const projectDescription = document.getElementById('projectDescription');
    const projectMainImage = document.getElementById('projectMainImage');
    const projectThumbs = document.getElementById('projectThumbs');
    const prevImageBtn = document.getElementById('prevImage');
    const nextImageBtn = document.getElementById('nextImage');
    const expandImageBtn = document.getElementById('expandImage');
    const imageLightbox = document.getElementById('imageLightbox');
    const closeLightboxBtn = document.getElementById('closeLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Guard: only run on portfolio page when elements exist
    if (portfolioCards.length) {
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBpmhtLdaoteX-7aV0m_1kMvuMTWuex-E4",
            authDomain: "kingsdesignn.firebaseapp.com",
            projectId: "kingsdesignn",
            storageBucket: "kingsdesignn.firebasestorage.app",
            messagingSenderId: "767602534908",
            appId: "1:767602534908:web:41cd5615909a3d0e5a2a79",
            measurementId: "G-EBD0V8S97L"
        };

        // Initialize Firebase
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js").then(({ initializeApp }) => {
            const app = initializeApp(firebaseConfig);
            
            // Import Firestore functions
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js").then(({ getFirestore, collection, getDocs, query, orderBy }) => {
                const db = getFirestore(app);
                
                // Fetch projects from Firestore
                async function fetchProjects() {
                    try {
                        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                        const querySnapshot = await getDocs(q);
                        const projects = [];
                        
                        querySnapshot.forEach((doc) => {
                            projects.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                        
                        // Generate portfolio cards dynamically
                        generatePortfolioCards(projects);
                        
                        // Initialize portfolio items with animation
                        initializePortfolioItems();
                    } catch (error) {
                        console.error("Error fetching projects: ", error);
                    }
                }
                
                // Generate portfolio cards dynamically
                function generatePortfolioCards(projects) {
                    const portfolioGrid = document.getElementById('portfolioGrid');
                    console.log(portfolioGrid)
                    if (!portfolioGrid) return;
                    
                    // Clear existing content
                    portfolioGrid.innerHTML = '';
                    
                    // Create portfolio cards
                    projects.forEach((project, index) => {
                        // Map category to color
                        let categoryColor = 'bg-[#116cd4]'; // Default blue for branding
                        switch(project.category) {
                            case 'social-media':
                                categoryColor = 'bg-[#ff7c01ea]';
                                break;
                            case 'ui-ux':
                                categoryColor = 'bg-[#00BCD4]';
                                break;
                            case 'print':
                                categoryColor = 'bg-[#8e44ad]';
                                break;
                        }
                        
                        // Create card element
                        const card = document.createElement('div');
                        card.className = 'portfolio-card bg-white rounded-xl shadow-lg shadow-[#1311a354] overflow-hidden';
                        card.setAttribute('data-category', project.category);
                        card.setAttribute('data-project-id', project.id);
                        
                        card.innerHTML = `
                            <div class="relative overflow-hidden">
                                <img src="${project.coverImage}" alt="${project.title}" class="portfolio-image w-full h-64 object-cover">
                                <div class="absolute top-4 left-4">
                                    <span class="category-badge ${categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium">${project.category.replace('-', ' ')}</span>
                                </div>
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-semibold text-slate-800 mb-2">${project.title}</h3>
                                <p class="text-slate-600 text-sm mb-4">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                                <button data-project-id="${project.id}" class="w-full border-2 border-[#1311a3f3] text-[#1311a3f3] py-2 rounded-lg font-medium hover:bg-[#1311a3f3] hover:text-white transition-all duration-300">
                                    View Project
                                </button>
                            </div>
                        `;
                        
                        portfolioGrid.appendChild(card);
                    });
                    
                    // Re-attach event listeners to new buttons
                    const newProjectButtons = document.querySelectorAll('[data-project-id]');
                    newProjectButtons.forEach(btn => {
                        btn.addEventListener('click', () => openProject(btn.dataset.projectId, projects));
                    });
                }
                
                // Project data for modal
                let projectData = [];
                
                // Open project modal
                function openProject(projectId, projects) {
                    // Find project by ID
                    const project = projects.find(p => p.id === projectId);
                    if (!project || !projectModal) return;
                    
                    projectTitle.textContent = project.title;
                    projectCategory.textContent = project.category.replace('-', ' ');
                    projectDescription.textContent = project.description;
                    currentImagesGlobal = project.images;
                    currentIndexGlobal = 0;
                    projectMainImage.src = currentImagesGlobal[0];
                    
                    projectThumbs.innerHTML = '';
                    currentImagesGlobal.forEach((src, idx) => {
                        const img = document.createElement('img');
                        img.src = src; 
                        img.alt = `Thumbnail ${idx+1}`;
                        img.className = 'w-full h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-[#1311a3f3]';
                        img.addEventListener('click', () => { 
                            currentIndexGlobal = idx; 
                            projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                        });
                        projectThumbs.appendChild(img);
                    });
                    
                    projectModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
                
                let currentImagesGlobal = [];
                let currentIndexGlobal = 0;

                function closeProject() { 
                    projectModal.classList.remove('show'); 
                    document.body.style.overflow = 'auto'; 
                    document.removeEventListener('keydown', escClose); 
                }
                
                prevImageBtn.onclick = () => { 
                    currentIndexGlobal = (currentIndexGlobal - 1 + currentImagesGlobal.length) % currentImagesGlobal.length; 
                    projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                };
                nextImageBtn.onclick = () => { 
                    currentIndexGlobal = (currentIndexGlobal + 1) % currentImagesGlobal.length; 
                    projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                };
                closeProjectBtn.onclick = closeProject;
                projectModal.onclick = (e) => { if (e.target === projectModal) closeProject(); };
                document.addEventListener('keydown', escClose);

                function escClose(e) { if (e.key === 'Escape') closeProject(); }
                
                // Fullscreen lightbox handlers
                function openLightbox() {
                    if (!currentImagesGlobal.length) return;
                    lightboxImage.src = currentImagesGlobal[currentIndexGlobal];
                    imageLightbox.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
                function closeLightbox() {
                    imageLightbox.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
                function nextLightbox() {
                    currentIndexGlobal = (currentIndexGlobal + 1) % currentImagesGlobal.length;
                    lightboxImage.src = currentImagesGlobal[currentIndexGlobal];
                }
                function prevLightbox() {
                    currentIndexGlobal = (currentIndexGlobal - 1 + currentImagesGlobal.length) % currentImagesGlobal.length;
                    lightboxImage.src = currentImagesGlobal[currentIndexGlobal];
                }

                if (expandImageBtn) expandImageBtn.addEventListener('click', openLightbox);
                if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
                if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
                if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
                if (imageLightbox) imageLightbox.addEventListener('click', (e) => { if (e.target === imageLightbox) closeLightbox(); });
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && imageLightbox && imageLightbox.classList.contains('show')) closeLightbox(); });

                // Initialize portfolio items
                function initializePortfolioItems() {
                    const newPortfolioCards = document.querySelectorAll('.portfolio-card');
                    newPortfolioCards.forEach((item, index) => {
                        setTimeout(() => item.classList.add('show'), index * 100);
                    });
                }

                // Filter portfolio items
                function filterPortfolio(category) {
                    const newPortfolioCards = document.querySelectorAll('.portfolio-card');
                    newPortfolioCards.forEach((item, index) => {
                        const itemCategory = item.getAttribute('data-category');
                        
                        if (category === 'all' || itemCategory === category) {
                            item.classList.remove('hidden');
                            setTimeout(() => item.classList.add('show'), index * 50);
                        } else {
                            item.classList.remove('show');
                            setTimeout(() => item.classList.add('hidden'), 300);
                        }
                    });
                }

                // Add click event listeners to filter buttons
                filterButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        // Remove active class from all buttons
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        
                        // Add active class to clicked button
                        this.classList.add('active');
                        
                        // Get filter category
                        const category = this.getAttribute('data-filter');
                        
                        // Filter portfolio items
                        filterPortfolio(category);
                    });
                });

                // Fetch projects from Firestore
                fetchProjects();
            });
        });

        // Add hover effects for portfolio cards
        portfolioCards.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        // Check if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
        } else {
            // Add load event listener
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Add error handler and fallback
            img.addEventListener('error', function() {
                this.style.opacity = '1';
            });
            
            // Fallback: show image after a timeout if load event doesn't fire
            setTimeout(() => {
                if (img.style.opacity === '0') {
                    img.style.opacity = '1';
                }
            }, 1000);
        }
    });

    // Add scroll reveal animation for sections (excluding hero)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections except hero for animation
    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach(section => {
        section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
        observer.observe(section);
    });

    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @media (max-width: 1023px) {
            .lg\\:hidden {
                display: block;
            }
        }
        
        @media (min-width: 1024px) {
            .lg\\:hidden {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);

    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
            // Add closing class for smooth exit animation
            mobileMenu.classList.add('closing');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                mobileMenu.classList.remove('show', 'closing');
                document.body.style.overflow = 'auto';
            }, 400);
        }
    });

    // Touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && mobileMenu.classList.contains('show')) {
                // Swipe left - close menu with smooth animation
                mobileMenu.classList.add('closing');
                const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
                if (slideElement) {
                    slideElement.classList.remove('show');
                }
                
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    mobileMenu.classList.remove('show', 'closing');
                    document.body.style.overflow = 'auto';
                }, 400);
            }
        }
    }

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            // Handle scroll-based animations here
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }, 16); // ~60fps
    });

    // Add focus management for accessibility
    const focusableElements = mobileMenu.querySelectorAll('a, button, input, textarea, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable && lastFocusable) {
        mobileMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    console.log('KingsDesign Portfolio - Mobile responsive version loaded successfully!');
});