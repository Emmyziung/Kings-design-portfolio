import { auth, onAuthStateChanged, signOut, db } from "../firebase.js";
import {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import uploadImagesToCloudinary from "./uploadImagesToCloudinary.js";

const projectEditID = new URLSearchParams(window.location.search).get("id");
if (!projectEditID) {
  // don’t hard-crash; just bounce out
  window.location.replace("./admin.html");
}

const updateForm = document.getElementById("updateForm");
const projectTitle = document.getElementById("projectTitle");
const category = document.getElementById("category");
const description = document.getElementById("description");
const photosInfo = document.getElementById("photosInfo");
const imageUpdate = document.getElementById("imageUpdate");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const projectThumbs = document.getElementById("projectThumbs");
const updateStatus = document.getElementById("updateStatus");
const updateStatusText = document.getElementById("updateStatusText");
const submitBtn = document.getElementById("submitBtn");
const logoutBtn = document.getElementById("logoutBtn");
const desktopLogoutBtn = document.getElementById("desktopLogoutBtn");

logoutBtn?.addEventListener("click", () => signOut(auth));
desktopLogoutBtn?.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.replace("./index.html");
});

function getProjectFromCache(projectId) {
  const raw = localStorage.getItem("cachedProjects");
  if (!raw) return null;

  const { projects, timestamp } = JSON.parse(raw);

  const MAX_AGE = 10 * 60 * 1000; // 10 minutes
  if (Date.now() - timestamp > MAX_AGE) return null;

  return projects.find((p) => p.id === projectId) || null;
}

imageUpdate?.addEventListener("change", (e) => {
  const files = e.target.files;

  if (photosInfo) {
    photosInfo.textContent =
      files && files.length > 0
        ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
        : "No file chosen";
  }

  if (!imagePreviewContainer || !imagePreview) return;

  if (files && files.length > 0) {
    imagePreviewContainer.classList.remove("hidden");
    imagePreview.innerHTML = "";

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgContainer = document.createElement("div");
        imgContainer.className =
          "image-preview relative cursor-move border-2 border-transparent";
        imgContainer.dataset.index = String(index);

        imgContainer.innerHTML = `
          <img src="${ev.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-lg">
        `;
        imagePreview.appendChild(imgContainer);
      };
      reader.onerror = (err) => console.error("Error reading file:", err);
      reader.readAsDataURL(file);
    });
  } else {
    imagePreviewContainer.classList.add("hidden");
    imagePreview.innerHTML = "";
  }
});

let currentImagesGlobal = [];
let currentIndexGlobal = 0;
let coverImag = "";
let project = null;

function populateForm(p) {
  if (!p) return;

  projectTitle.value = (p.title || "").trim();
  category.value = p.catgory || "";
  description.value = p.description || "";

  currentImagesGlobal = Array.isArray(p.images) ? p.images : [];
  currentIndexGlobal = 0;
  coverImag = p.coverImage || currentImagesGlobal[0] || "";

  if (!projectThumbs) return;
  projectThumbs.innerHTML = "";

  const thumbs = [];

  currentImagesGlobal.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Thumbnail ${idx + 1}`;
    img.className =
      "w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border-2 border-gray-300 hover:border-[#1311a3f3]";

    img.onclick = () => {
      // remove highlight from previous
      thumbs[currentIndexGlobal]?.classList.remove("border-[#1311a3f3]");
      thumbs[currentIndexGlobal]?.classList.add("border-gray-300");

      // update state
      currentIndexGlobal = idx;
      coverImag = currentImagesGlobal[idx];

      // add highlight
      img.classList.remove("border-gray-300");
      img.classList.add("border-[#1311a3f3]");
    };

    thumbs.push(img);
    projectThumbs.appendChild(img);
  });

  // highlight current cover if it matches one of the thumbs
  const initialIndex = currentImagesGlobal.indexOf(coverImag);
  const idxToHighlight = initialIndex >= 0 ? initialIndex : 0;

  if (thumbs[idxToHighlight]) {
    currentIndexGlobal = idxToHighlight;
    thumbs[idxToHighlight].classList.remove("border-gray-300");
    thumbs[idxToHighlight].classList.add("border-[#1311a3f3]");
  }
}

async function fetchProject(id) {
  const cached = getProjectFromCache(id);
  if (cached) {
    populateForm(cached);
    return cached;
  }

  try {
    const snap = await getDoc(doc(db, "projects", id));
    if (!snap.exists()) return null;

    const p = { id: snap.id, ...snap.data() };
    populateForm(p);
    return p;
  } catch (err) {
    console.error("Error fetching project:", err);
    return null;
  }
}

(async () => {
  project = await fetchProject(projectEditID);

  if (!project) {
    if (updateStatusText && updateStatus) {
      updateStatusText.textContent = "Project not found or failed to load.";
      updateStatus.classList.remove("hidden");
    }
  }
})();

updateForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!project) {
    updateStatusText.textContent = "Project not loaded yet.";
    updateStatus.classList.remove("hidden");
    return;
  }

  const files = imageUpdate?.files;

  submitBtn.disabled = true;
  submitBtn.textContent = "Updating...";
  updateStatusText.textContent = "Updating...";
  updateStatus.classList.remove("hidden");

  try {
    // ✅ only upload if user selected new images
    const uploadedUrls =
      files && files.length > 0 ? await uploadImagesToCloudinary(files) : [];

    const baseImages = Array.isArray(project.images) ? project.images : [];
    const mergedUrls = uploadedUrls.length > 0 ? [...baseImages, ...uploadedUrls] : baseImages;

    // ✅ if coverImag is empty, keep old cover (don’t overwrite with "")
    const safeCover = coverImag || project.coverImage || mergedUrls[0] || "";

    const payload = {
      catgory: category.value,
      coverImage: safeCover,
      updatedAt: serverTimestamp(),
      description: description.value.trim(),
      title: projectTitle.value.trim(),
      images: mergedUrls,
    };

    await updateDoc(doc(db, "projects", projectEditID), payload);

    // keep local project in sync
    Object.assign(project, payload, { images: mergedUrls, coverImage: safeCover });

    updateStatusText.textContent = "Update complete.";
    updateStatus.classList.add("hidden");

    // reset only the file-selection UI (don’t wipe text fields if you don’t want)
    if (imageUpdate) imageUpdate.value = "";
    if (photosInfo) photosInfo.textContent = "No file chosen";
    if (imagePreview) imagePreview.innerHTML = "";
    if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");

    localStorage.removeItem("cachedProjects");
  } catch (err) {
    console.error("Update failed:", err);
    updateStatusText.textContent = "Update failed. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Update Project";
  }
});
