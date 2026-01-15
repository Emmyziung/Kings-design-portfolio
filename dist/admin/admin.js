// Test if script is loading
console.log('Admin script loading');
import { auth, onAuthStateChanged, signOut } from "../firebase.js";
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    try {
        // Get DOM elements
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
          const logoutBtn=  document.getElementById('logoutBtn')
            
            logoutBtn.addEventListener('click', () => signOut(auth));

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        
          window.location.replace("./index.html");
         }
     
    });
        
        if (!imageUpload || !imagePreview || !imagePreviewContainer) {
            console.error('Required elements not found');
            return;
        }
        
        console.log('Elements found:', { imageUpload, imagePreview, imagePreviewContainer });
        
        // Handle image selection and preview
        imageUpload.addEventListener('change', function(e) {
            console.log('File input changed');
            const files = e.target.files;
            console.log('Number of files:', files.length);
            
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
        
        console.log('Event listeners added');
    } catch (error) {
        console.error('Error in admin script:', error);
    }
});