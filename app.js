/* ===================================================
   CARESATHI — Slide Deck Presentation Controller
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const totalSlides = 11;
  let currentSlide = 1;

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');

  function showSlide(index) {
    if (index < 1) index = 1;
    if (index > totalSlides) index = totalSlides;

    currentSlide = index;

    document.querySelectorAll('.slide-card').forEach((card, idx) => {
      card.classList.toggle('active', idx + 1 === currentSlide);
    });

    slideCounter.textContent = `Slide ${currentSlide} / ${totalSlides}`;

    prevBtn.disabled = (currentSlide === 1);
    nextBtn.disabled = (currentSlide === totalSlides);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

  // Keyboard Navigation (Left / Right arrow keys)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Space') {
      showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      showSlide(currentSlide - 1);
    }
  });

  showSlide(1);

});
