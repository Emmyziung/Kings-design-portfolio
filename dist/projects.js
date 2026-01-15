          import { db } from "./firebase.js";
  import {

    getDoc,
    doc,
    
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        ;

        const projectId = new URLSearchParams(window.location.search).get("id");
if (!projectId) throw new Error("Missing ?id= in URL");
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

function getProjectFromCache(projectId) {
  const raw = localStorage.getItem("cachedProjects");
  if (!raw) return null;

  const { projects, timestamp } = JSON.parse(raw);

  // OPTIONAL: expiry check (remove if you don’t want it here)
  const MAX_AGE = 10 * 60 * 1000; // 10 minutes
  if (Date.now() - timestamp > MAX_AGE) return null;

  return projects.find(p => p.id === projectId) || null;
}
let currentImagesGlobal = [];
                let currentIndexGlobal = 0;
const renderProject = (project)=> {
        projectTitle.textContent = project.title;
                    projectCategory.textContent = project.catgory.replace('-', ' ');
                    projectDescription.textContent = project.description;
                    currentImagesGlobal = project.images;
                    currentIndexGlobal = 0;
                    projectMainImage.src = currentImagesGlobal[0];
                    
                    projectThumbs.innerHTML = '';
                    currentImagesGlobal.forEach((src, idx) => {
                        const img = document.createElement('img');
                        img.src = src; 
                        img.alt = `Thumbnail ${idx+1}`;
                        img.className = 'w-16 h-16 md:w-20 md:h-20 object-cover rounded  cursor-pointer border-2 border-gray-300 hover:border-[#1311a3f3]';
                        img.addEventListener('click', () => { 
                            currentIndexGlobal = idx; 
                            projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                        });
                        projectThumbs.appendChild(img);
                    });
}
prevImageBtn.onclick = () => { 
                    currentIndexGlobal = (currentIndexGlobal - 1 + currentImagesGlobal.length) % currentImagesGlobal.length; 
                    projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                };
                nextImageBtn.onclick = () => { 
                    currentIndexGlobal = (currentIndexGlobal + 1) % currentImagesGlobal.length; 
                    projectMainImage.src = currentImagesGlobal[currentIndexGlobal]; 
                };
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

  async function fetchProject(id) {
    const cacheProject = getProjectFromCache(id)
    if (cacheProject){
        console.log("fetched project from cache: ", cacheProject)
        renderProject(cacheProject)
        return
    }
    try {
                      
                        const querySnapshot = await getDoc(doc(db, "projects", id));
                        const project = {id: querySnapshot.id,...querySnapshot.data()};
                        
                        
console.log("The project has been fetched from firestore: ",project)
renderProject(project)
                    } catch (error) {
                        console.error("Error fetching project:", error);
                    }
    }
    fetchProject(projectId);