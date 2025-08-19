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
        // Demo data to be replaced by Firebase
        const demoProjects = {
            'branding-1': { title: 'Modern Brand Identity', category: 'Branding', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg', 'b img/InShot_20250813_143504912.png', 'b img/IMG-20250729-WA0005.jpg'], description: 'Complete brand identity design including logo, palette, and guidelines for a tech startup.' },
            'social-1': { title: 'Instagram Campaign', category: 'Social Media', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'Cohesive campaign visuals and content for engagement growth.' },
            'uiux-1': { title: 'Mobile App Interface', category: 'UI/UX Design', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'User-centered flows and components designed for clarity and speed.' },
            'print-1': { title: 'Business Card Collection', category: 'Print Design', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'Premium stocks and finishes across multiple industries.' },
            'uiux-2': { title: 'Dashboard Interface', category: 'UI/UX Design', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'Data-dense screens optimized for quick scanning and decision-making.' },
            'branding-2': { title: 'Restaurant Logo Design', category: 'Branding', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'Memorable iconography and custom type for hospitality.' },
            'social-2': { title: 'Facebook Ad Campaign', category: 'Social Media', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'High-converting ad variations and messaging tests.' },
            'uiux-3': { title: 'Admin Dashboard', category: 'UI/UX Design', images: ['b img/520273986_18018343349725904_6642175494957712061_n.jpg'], description: 'Clean components and accessible color system for enterprise.' }
        };

        function initializePortfolioItems() {
            portfolioCards.forEach((item, index) => {
                setTimeout(() => item.classList.add('show'), index * 100);
            });
        }

        function filterPortfolio(category) {
            portfolioCards.forEach((item, index) => {
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

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterPortfolio(this.getAttribute('data-filter'));
            });
        });

        let currentImagesGlobal = [];
        let currentIndexGlobal = 0;

        function openProject(projectId) {
            const data = demoProjects[projectId];
            if (!data || !projectModal) return;
            projectTitle.textContent = data.title;
            projectCategory.textContent = data.category;
            projectDescription.textContent = data.description;
            currentImagesGlobal = data.images;
            currentIndexGlobal = 0;
            projectMainImage.src = currentImagesGlobal[0];
            projectThumbs.innerHTML = '';
            currentImagesGlobal.forEach((src, idx) => {
                const img = document.createElement('img');
                img.src = src; img.alt = `Thumbnail ${idx+1}`;
                img.className = 'w-full h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-[#1311a3f3]';
                img.addEventListener('click', () => { currentIndexGlobal = idx; projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; });
                projectThumbs.appendChild(img);
            });
            projectModal.classList.add('show');
            document.body.style.overflow = 'hidden';

            prevImageBtn.onclick = () => { currentIndexGlobal = (currentIndexGlobal - 1 + currentImagesGlobal.length) % currentImagesGlobal.length; projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; };
            nextImageBtn.onclick = () => { currentIndexGlobal = (currentIndexGlobal + 1) % currentImagesGlobal.length; projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; };
            closeProjectBtn.onclick = closeProject;
            projectModal.onclick = (e) => { if (e.target === projectModal) closeProject(); };
            document.addEventListener('keydown', escClose);

            function escClose(e) { if (e.key === 'Escape') closeProject(); }
            function closeProject() { projectModal.classList.remove('show'); document.body.style.overflow = 'auto'; document.removeEventListener('keydown', escClose); }
        }

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

        projectButtons.forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.projectId)));
        initializePortfolioItems();
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