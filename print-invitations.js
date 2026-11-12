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

  const animations = [];
  function animate(selector, frames, duration, delay = 0) {
    animations.push((selector ? get(selector) : dialog).animate(frames, {
      duration, delay, fill: 'both', easing: 'cubic-bezier(.38,.05,.23,1)'
    }));
  }
  if (get('.pi-flap')) {
    animate('.pi-pearl', [{opacity: 1}, {opacity: 0}], 220);
    animate('.pi-flap', [{transform: 'rotateX(0deg)'}, {transform: 'rotateX(171deg)'}], 580);
    animate('.pi-insert', [
      {transform: 'translateY(0)'}, {transform: 'translateY(-65%) scale(1.02)', offset: .59},
      {transform: 'translateY(-54%) scale(1.24)'}
    ], 940, 390);
    for (const part of ['.pi-envelope-back', '.pi-envelope-front', '.pi-flap']) {
      animate(part, [{opacity: 1}, {opacity: 0}], 460, 840);
    }
  }
  animate(null, [{opacity: 1}, {opacity: 0}], 430, get('.pi-flap') ? 1050 : 0);
  return {finished: Promise.all(animations.map(animation => animation.finished)), cancel() {
    animations.forEach(animation => animation.cancel());
  }};
});
