const end = new Date(window.weddingDate || document.body.dataset.date).getTime();
const units = document.querySelectorAll('[data-unit]');
function updateCountdown() {
  const total = Math.max(0, Math.floor((new Date(window.weddingDate || end).getTime() - Date.now()) / 1000));
  const values = [Math.floor(total / 86400), Math.floor(total % 86400 / 3600), Math.floor(total % 3600 / 60), total % 60];
  units.forEach((el, i) => { el.textContent = String(values[i]).padStart(2, '0'); });
}
updateCountdown();
setInterval(updateCountdown, 1000);
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('.response-status');
  status.hidden = false;
  status.textContent = 'Спасибо! Это демонстрация: ответ не был отправлен.';
});
