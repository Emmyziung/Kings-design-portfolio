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
            slideElement.classList.add('show');
        }
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    closeMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Closing mobile menu...');
        mobileMenu.classList.remove('show');
        const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
        if (slideElement) {
            slideElement.classList.remove('show');
        }
        document.body.style.overflow = 'auto';
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            console.log('Closing menu - clicked outside');
            mobileMenu.classList.remove('show');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking on nav links
    const mobileNavLinks = mobileMenu.querySelectorAll('nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Closing menu - nav link clicked');
            mobileMenu.classList.remove('show');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            document.body.style.overflow = 'auto';
        });
    });

    // Test function for debugging
    window.testMobileMenu = function() {
        console.log('Test function called');
        if (mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.remove('show');
            }
            console.log('Menu should now be hidden');
        } else {
            mobileMenu.classList.add('show');
            const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
            if (slideElement) {
                slideElement.classList.add('show');
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

    // Add hover effects for portfolio items
    const portfolioItems = document.querySelectorAll('#portfolio .aspect-\\[4\\/5\\]');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

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
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
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
            if (diff > 0 && !mobileMenu.classList.contains('hidden')) {
                // Swipe left - close menu
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
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