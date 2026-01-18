import { auth, onAuthStateChanged, signOut, db } from "../firebase.js";

import { addDoc, collection, serverTimestamp ,getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { fetchProjects } from "../portfolio.js";

    
    const deleteModal= document.getElementById('deleteModal')
    const confirmDelete= document.getElementById('confirmDelete')
    const cancelDelete= document.getElementById('cancelDelete')
    function goToProject(type, id){
        window.location.href = `./update.html?type=${type}&id=${id}`
    }
    
    let selectedProjectId = null;




        
      async function renderProjects() {
                  try{
                    const projects= await fetchProjects()
      generateProjectsCards(projects);
      initializeProjectItems();

                    } catch (error) {
                        console.error("Error renderin projects: ", error);
                    }
                }
                
                // Generate project cards dynamically
                function generateProjectsCards(projects) {
                    console.log("generating card")
                    const projectGrid = document.getElementById('projectGrid');
                    console.log(projectGrid)
                    if (!projectGrid) return;
                    
                      projectGrid.innerHTML = "";
                  
                    
                    // Create project cards
                    projects.forEach((project, index) => {
                        // Map category to color
                        let categoryColor = 'bg-[#116cd4]'; // Default blue for branding
                        switch(project.catgory) {
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
                        card.className = 'project-card bg-white  shadow-gray-300 shadow-md border border-gray-300 overflow-hidden';
                        card.setAttribute('data-category', project.catgory);
                        card.setAttribute('data-project-id', project.id)
                       
                        card.innerHTML = `
                            <div class="relative overflow-hidden">
                                <img src="${project.coverImage}" alt="${project.title}" class="project-image w-full aspect-square object-cover object-top">
                           
                    
   
              
                        
                               
                            </div>
                           <div class=" flex justify-between">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  class="delete m-2 text-red-600 hover:text-red-700 hover:scale-105 lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                               
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  class="m-2 edit text-slate-700 hover:text-gray-800  hover:scale-105 lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                              
                            </div> 
                        `;
                     
                        console.log(card)
                        projectGrid.appendChild(card);
                    });
                    
                 const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
  
  const projectId = card.dataset.projectId;
const deleteBtn = card.querySelector('.delete')
const editBtn = card.querySelector('.edit')
deleteBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  selectedProjectId = projectId;     // <- set the chosen one
  deleteModal.classList.remove("hidden");
});


  editBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
    console.log("hs")

  
     goToProject("edit", projectId)
       
      return;
    })
      
    
  
  });

 

                }
                   function initializeProjectItems() {
                    const newProjectCards = document.querySelectorAll('.project-card');
                    newProjectCards.forEach((item, index) => {
                        setTimeout(() => item.classList.add('show'), index * 100);
                    });
                }
                renderProjects()

                const deleteProject = async(id)=>{
         await deleteDoc(doc(db, "projects", id))
        
    }


                confirmDelete.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (!selectedProjectId) return;

  console.log(selectedProjectId);
  
 await deleteProject(selectedProjectId);
  localStorage.removeItem("cachedProjects");
    deleteModal.classList.add("hidden");
  renderProjects()

  selectedProjectId = null;
});

cancelDelete.addEventListener("click", (e) => {
  e.stopPropagation();
  deleteModal.classList.add("hidden");
  selectedProjectId = null;
});
    


export {renderProjects}