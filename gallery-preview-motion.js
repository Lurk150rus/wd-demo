const cards = document.querySelectorAll('.gallery .card[data-preview-motion]');
const motion = matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('preview-playing', entry.isIntersecting && !motion.matches);
    }
  }, {rootMargin: '0px 0px -18% 0px'});

  function syncMotion() {
    observer.disconnect();
    for (const card of cards) {
      card.classList.remove('preview-playing');
      if (!motion.matches) observer.observe(card);
    }
  }

  motion.addEventListener('change', syncMotion);
  syncMotion();
}
