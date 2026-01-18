// Test if script is loading
console.log('Admin script loading');
import { auth, onAuthStateChanged, signOut, db } from "../firebase.js";
import {renderProjects} from './update.js'
import { addDoc, collection, serverTimestamp ,getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import uploadImagesToCloudinary from "./uploadImagesToCloudinary.js";
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    try {
        // Get DOM elements
        const adminPage = document.getElementById('adminContent')
        const uploadTab = document.getElementById('upload')
        const updateTab = document.getElementById('update')
        const uploadPage = document.getElementById('uploadPage')
        const updatePage = document.getElementById('updatePage')
        const uploadForm = document.getElementById('uploadForm');
        const projectTitle = document.getElementById('projectTitle');
        const category = document.getElementById('category');
        const description = document.getElementById('description');
        const photosInfo = document.getElementById('photosInfo')
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const uploadStatus = document.getElementById('uploadStatus');
        const uploadStatusText = document.getElementById('uploadStatusText');
        const submitBtn = document.getElementById('submitBtn');
          const logoutBtn=  document.getElementById('logoutBtn')
          const desktopLogoutBtn = document.getElementById('desktopLogoutBtn')  
            logoutBtn.addEventListener('click', () => signOut(auth));
            desktopLogoutBtn.addEventListener('click', () => {
                signOut(auth)
            console.log('hdjh')
    });

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        
          window.location.replace("./index.html");
         }
     
    });
        
        if (!uploadForm || !projectTitle || !category || !description || !imageUpload || !imagePreview || !imagePreviewContainer || !uploadStatus || !uploadStatusText || !submitBtn) {
            console.error('Required elements not found');
            return;
        }
        
        console.log('Elements found:', { imageUpload, imagePreview, imagePreviewContainer });
        

        //Handle Tab change
function showUpload() {
  uploadPage.hidden = false;
  updatePage.hidden = true;
}

function showUpdate() {
  uploadPage.hidden = true;
  updatePage.hidden = false;
}
function highlightTab(activeTab) {
  const tabs = document.querySelectorAll(".admin-tab");

  tabs.forEach(tab => {
    tab.classList.remove(
      "text-[#1311a3f3]",
      "border-b-2",
      "border-b-[#1311a3f3]",
      "bg-blue-50"
    );

    tab.classList.add("text-slate-700");
  });

  activeTab.classList.remove("text-slate-700");

  activeTab.classList.add(
    "text-[#1311a3f3]",
    "border-b-2",
    "border-b-[#1311a3f3]",
    "bg-blue-50"
  );
}
highlightTab(uploadTab)

        uploadTab.addEventListener('click', ()=>{
            showUpload()
            highlightTab(uploadTab)
        })
        updateTab.addEventListener('click', ()=>{
            showUpdate()
            highlightTab(updateTab)
        })
       
  
       







        // Handle image selection and preview
        imageUpload.addEventListener('change', function(e) {
            console.log('File input changed');
            const files = e.target.files;
            console.log('Number of files:', files.length);
photosInfo.textContent= files.length > 0
            ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
            : "No file chosen"
            
            if (files.length > 0) {
                // Show image preview container
                imagePreviewContainer.classList.remove('hidden');
                imagePreview.innerHTML = '';
              
                // Create preview for each selected image
                Array.from(files).forEach((file, index) => {
                    console.log('Processing file:', index);
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        console.log('File loaded:', index);
                        
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'image-preview relative cursor-move border-2 border-transparent';
                        imgContainer.dataset.index = index;
                        
                        imgContainer.innerHTML = `
                            <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-lg">
                            ${index === 0 ? '<div class="absolute top-2 left-2 bg-[#1311a3f3] text-white text-xs px-2 py-1 rounded">Cover</div>' : ''}
                        `;
                        
                        console.log('Before appending to imagePreview');
                        imagePreview.appendChild(imgContainer);
                        console.log('Image container added:', index);
                        console.log('imagePreview child count:', imagePreview.children.length);
                    };
                    reader.onerror = function(e) {
                        console.error('Error reading file:', e);
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                imagePreviewContainer.classList.add('hidden');
            }
        });

        uploadForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const files = imageUpload.files;
            if (!files || files.length === 0) {
                uploadStatusText.textContent = 'Please select at least one image.';
                uploadStatus.classList.remove('hidden');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            uploadStatusText.textContent = 'Uploading images...';
            uploadStatus.classList.remove('hidden');

            try {
                const uploadedUrls = await uploadImagesToCloudinary(files);
                const payload = {
                    catgory: category.value,
                    coverImage: uploadedUrls[0] || '',
                    createdAt: serverTimestamp(),
                    description: description.value.trim(),
                    title: projectTitle.value.trim(),
                    images: uploadedUrls,
                };

                await addDoc(collection(db, 'projects'), payload);

                uploadStatusText.textContent = 'Upload complete.';
                uploadStatus.classList.add('hidden')
                uploadForm.reset();
                photosInfo.textContent = 'No file chosen';
                imagePreview.innerHTML = '';
                imagePreviewContainer.classList.add('hidden');
                localStorage.removeItem("cachedProjects");
                renderProjects()
            } catch (error) {
                console.error('Upload failed:', error);
                uploadStatusText.textContent = 'Upload failed. Please try again.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload Project';
            }
        });
        
        console.log('Event listeners added');
    } catch (error) {
        console.error('Error in admin script:', error);
    }
});
