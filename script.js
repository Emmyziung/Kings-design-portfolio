const initHomePage = () => {  
        const carousel = document.getElementById('carousel');
        const indicatorsContainer = document.getElementById('indicators');

    const slides = carousel.children.length;
    let index = 1; // start with second slide centered

    
// create indicators
for (let i = 0; i < slides; i++) {
  const dot = document.createElement('div');
  dot.className = "w-3 h-3 bg-gray-400 rounded-full transition-all duration-500";
  indicatorsContainer.appendChild(dot);
}

// update indicators
function updateIndicators() {
  Array.from(indicatorsContainer.children).forEach((dot, i) => {
    if (i === index) {
      dot.className = "w-8 h-2 bg-[#1311a3f3] rounded-full transition-all duration-500";
    } else {
      dot.className = "w-2 h-2 bg-gray-400 rounded-full transition-all duration-500";
    }
  });
}
    function updateSlide() {
      const containerWidth = carousel.parentElement.offsetWidth;
      const slideWidth = carousel.children[0].offsetWidth;
      const margin = 16; // total horizontal margin from mx-2 (8px left + 8px right)
      const offset = (containerWidth - slideWidth) / 2;
      carousel.style.transform = `translateX(${-index * (slideWidth + margin) + offset}px)`;

      updateIndicators(); 
    }
    
      updateIndicators(); 
    document.getElementById('nextBtn').addEventListener('click', () => {
      index = (index + 1) % slides;
      resetAutoplay();
  requestAnimationFrame(updateSlide);
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
     index = (index - 1 + slides) % slides;
     resetAutoplay();
  requestAnimationFrame(updateSlide);
    });

    window.addEventListener('resize', updateSlide);
    updateSlide(); // initial centering

    function startAutoplay() {
  autoplayInterval = setInterval(() => {
    index = (index + 1) % slides;
    updateSlide();
  }, 5500); 
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
carousel.parentElement.addEventListener('mouseleave', startAutoplay);

startAutoplay();

}

document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
});