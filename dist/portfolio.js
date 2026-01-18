           import { db } from "./firebase.js";
  import {

    collection, getDocs, query, orderBy
    
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        ; 
const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const projectButtons = document.querySelectorAll('[data-project-id]');
    const projectModal = document.getElementById('projectModal');
    const closeProjectBtn = document.getElementById('closeProject');
    const portfolioGrid = document.getElementById('portfolioGrid');

    const PROJECTS_CACHE_KEY = "cachedProjects";
    const CACHE_DURATION_MIN = 10; // minutes
    // Guard: only run on portfolio page when elements exist
    
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
function goToProject(projectId) {
  window.location.href = `./projects.html?id=${projectId}`;
}

    
                
                // Fetch projects from Firestore
                async function fetchProjects() {
                    const now = Date.now()
                    console.log("fetching projects")

                      const cachedData = localStorage.getItem(PROJECTS_CACHE_KEY);
  if (cachedData) {
    const { projects, timestamp } = JSON.parse(cachedData);

    // If cache is still valid
    if (now - timestamp < CACHE_DURATION_MIN * 60 * 1000) {
      console.log("Loaded projects from cache:", projects);
      if(portfolioGrid){
      generatePortfolioCards(projects);
      initializePortfolioItems();
      return;
      }else{
        return projects
      }
    }
  }               try {
    console.log("Fetching from Firestore")
                        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
                        console.log(q)
                        const querySnapshot = await getDocs(q);
                        console.log(querySnapshot)
                        const projects = [];
                        
                        querySnapshot.forEach((doc) => {
                            projects.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
console.log(projects)
                    if (projects.length >0){
                          localStorage.setItem(
      PROJECTS_CACHE_KEY,
      JSON.stringify({ projects, timestamp: now })
    );}

                      if(portfolioGrid){
                        // Generate portfolio cards dynamically
                        generatePortfolioCards(projects);
                        
                        // Initialize portfolio items with animation
                        initializePortfolioItems();
                      }else{
                        return projects
                      }
                    } catch (error) {
                        console.error("Error fetching projects: ", error);
                    }
                }
                
                // Generate portfolio cards dynamically
                function generatePortfolioCards(projects) {
                    console.log("generating card")
                    
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
                        card.className = 'portfolio-card bg-white  shadow-[#1311a354] overflow-hidden';
                        card.setAttribute('data-category', project.catgory);
                        
                       
                        card.innerHTML = `
                            <div class="relative overflow-hidden">
                                <img src="${project.coverImage}" alt="${project.title}" class="portfolio-image w-full aspect-square  object-cover">
                           
                    
    <div class="absolute portfolio-image-overlay bottom-0 left-0 h-full w-full  " style="background: rgba(0,0,0,0.7);" data-project-id="${project.id}">
     <p class="text-white text-lg mb-4">View catalog</p>
    </div>
              
                        
                               
                            </div>
                          <!-- <div class="p-6">
                                <h3 class="text-xl font-semibold text-slate-800 mb-2">${project.title}</h3>
                                <p class="text-slate-600 text-sm mb-4">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                                <button data-project-id="${project.id}" class="w-full border-2 border-[#1311a3f3] text-[#1311a3f3] py-2 rounded-lg font-medium hover:bg-[#1311a3f3] hover:text-white transition-all duration-300">
                                    View Project
                                </button>
                            </div> -->
                        `;
                     
                        console.log(card)
                        portfolioGrid.appendChild(card);
                    });
                    
                 const cards = document.querySelectorAll('.portfolio-card');

cards.forEach(card => {
  const overlay = card.querySelector('.portfolio-image-overlay');
  const projectId = overlay.dataset.projectId;

  card.addEventListener('click', (e) => {
      e.stopPropagation(); 
    console.log("hd")
    document.querySelectorAll('.portfolio-card.overlay-active')
    .forEach(c => {
      if (c !== card) c.classList.remove('overlay-active');
    });
    // If overlay is already visible → open project
    if (card.classList.contains('overlay-active')) {
         console.log("s")
      
     goToProject(projectId)
       card.classList.remove('overlay-active');
      return;
    }
      console.log('a')
    // First tap (mobile) → show overlay only
    card.classList.add('overlay-active');
    
  
  });

  // Prevent accidental bubbling when clicking overlay text
   overlay.addEventListener('click', (e) => {
    console.log('d')
    e.stopPropagation();
     goToProject(projectId)
     card.classList.remove('overlay-active');
  }); 
});
document.addEventListener('click', () => {
  document.querySelectorAll('.portfolio-card.overlay-active')
    .forEach(card => card.classList.remove('overlay-active'));
});

                }
                
// Initialize portfolio items with animation             
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
            
        

        // Add hover effects for portfolio cards
        portfolioCards.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
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


export {fetchProjects};