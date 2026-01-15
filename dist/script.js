// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing mobile menu...');
    
    const mobileMenu = document.getElementById('mobileMenu');
    const openMenuBtn = document.getElementById('openMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const backToTopBtn = document.getElementById('backToTop');


    // Open mobile menu
    openMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
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

        mobileMenu.classList.add('closing');
        const slideElement = mobileMenu.querySelector('.mobile-menu-slide');
        if (slideElement) {
            slideElement.classList.remove('show');
        }
        
        setTimeout(() => {
            mobileMenu.classList.remove('show', 'closing');
            document.body.style.overflow = 'auto';
        }, 400); 
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


    // Back to top button functionality
    window.addEventListener('scroll', function() {
        if(backToTopBtn){
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    }
    });
    if(backToTopBtn){
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}



   
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    mobileMenu.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

    console.log('KingsDesign Portfolio - Mobile responsive version loaded successfully!');
});