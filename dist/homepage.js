import { fetchProjects } from "./portfolio.js";
fetchProjects()


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

