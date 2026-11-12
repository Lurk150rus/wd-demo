import { initializeOpening } from './occasion-opening.js';

const month = document.querySelector('.pi-month');
function renderCalendar() {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(document.body.dataset.date);
  if (!match) return;
  const [, year, value, day] = match.map(Number);
  const first = new Date(year, value - 1, 1);
  const days = new Date(year, value, 0).getDate();
  const label = document.createElement('span');
  label.textContent = first.toLocaleDateString('ru-RU', {month: 'long', year: 'numeric'});
  const grid = document.createElement('div');
  for (const text of ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']) {
    const item = document.createElement('span');
    item.textContent = text;
    grid.append(item);
  }
  for (let i = 0; i < (first.getDay() + 6) % 7; i++) grid.append(document.createElement('span'));
  for (let i = 1; i <= days; i++) {
    const item = document.createElement(i === day ? 'mark' : 'span');
    item.textContent = i;
    grid.append(item);
  }
  month.replaceChildren(label, grid);
}
renderCalendar();
new MutationObserver(renderCalendar).observe(document.body, {attributes: true, attributeFilter: ['data-date']});

initializeOpening(dialog => {
  const get = selector => dialog.querySelector(selector);
  if (document.body.classList.contains('ribbon-lace') && window.gsap) {
    let complete;
    const finished = new Promise(resolve => { complete = resolve; });
    const timeline = window.gsap.timeline({onComplete: complete});
    timeline
      .to(get('.pi-tie i'), {xPercent: -46, rotation: -22, scaleX: .62, opacity: 0, duration: .56, ease: 'power2.inOut'})
      .to(get('.pi-tie b'), {xPercent: 48, rotation: 17, scaleX: .58, opacity: 0, duration: .62, ease: 'power2.inOut'}, 0)
      .to(get('.pi-band'), {scaleX: 1.25, y: 24, opacity: 0, duration: .4}, .28)
      .to(get('.pi-insert'), {rotateX: -49, y: -65, scale: 1.06, opacity: 0, duration: .72, ease: 'power2.inOut'}, .58)
      .to(dialog, {opacity: 0, duration: .42}, .96);
    return {finished, cancel() {
      timeline.kill();
      for (const selector of ['.pi-tie i', '.pi-tie b', '.pi-band', '.pi-insert']) {
        get(selector).style.removeProperty('transform');
        get(selector).style.removeProperty('opacity');
      }
      dialog.style.removeProperty('opacity');
    }};
  }

  const isHeirloom = Boolean(get('.mail-envelope'));
  return dialog.animate([
    {opacity: 1}, {opacity: 1, offset: isHeirloom ? .83 : 0.05}, {opacity: 0},
  ], {duration: isHeirloom ? 1980 : 430, easing: 'ease-in-out', fill: 'forwards'});
});
