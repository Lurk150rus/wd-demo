import { initializeOpening } from './occasion-opening.js';

const heading = document.querySelector('main h1');
function updateInitials() {
  const initials = [...heading.querySelectorAll('span')]
    .map(span => Array.from(span.textContent.trim())[0] || '')
    .join('');
  document.querySelectorAll('.ill-monogram').forEach(mark => { mark.textContent = initials; });
}
updateInitials();
new MutationObserver(updateInitials).observe(heading, {childList: true, subtree: true});

const calendar = document.querySelector('.ill-month');
if (calendar) {
  function updateCalendar() {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(document.body.dataset.date);
    if (!match) return;
    const [, year, month, day] = match.map(Number);
    const start = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0).getDate();
    const label = document.createElement('strong');
    label.textContent = start.toLocaleDateString('ru', {month: 'long', year: 'numeric'});
    const grid = document.createElement('div');
    function append(text, active = false) {
      const cell = document.createElement(active ? 'mark' : 'span');
      cell.textContent = text;
      grid.append(cell);
    }
    ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(label => append(label));
    for (let i = 0; i < (start.getDay() + 6) % 7; i++) append('');
    for (let i = 1; i <= last; i++) append(i, i === day);
    calendar.replaceChildren(label, grid);
  }
  updateCalendar();
  new MutationObserver(updateCalendar).observe(document.body, {attributes: true, attributeFilter: ['data-date']});
}

initializeOpening(dialog => {
  const gsap = window.gsap;
  if (!gsap) {
    const animation = dialog.animate([{opacity: 1}, {opacity: 0}], 280);
    return {finished: animation.finished, cancel: () => animation.cancel()};
  }

  const book = dialog.querySelector('.ill-book');
  const controls = dialog.querySelectorAll('button');
  const parts = book
    ? [...book.children]
    : [...dialog.querySelector('.ill-sketch').children];
  let resolve;
  const finished = new Promise(done => { resolve = done; });
  const timeline = gsap.timeline({onComplete: resolve});
  timeline.to(controls, {opacity: 0, duration: .24}, 0);
  if (book) {
    timeline
      .to(parts[0], {rotateY: -18, duration: .48, ease: 'power2.inOut'}, .12)
      .to(parts[1], {rotateY: -157, duration: .87, ease: 'power2.inOut'}, 0)
      .to(parts[0], {rotateY: -148, duration: .7, ease: 'power2.inOut'}, .56)
      .to(book, {xPercent: 19, scale: 1.16, duration: 1.2, ease: 'power2.inOut'}, .05);
  } else {
    timeline
      .to(parts[0], {yPercent: -44, scale: 1.44, rotation: -12, opacity: 0, duration: .73}, 0)
      .to(parts[1], {xPercent: 54, yPercent: 24, rotation: 17, opacity: 0, duration: .77}, .07)
      .to(parts.slice(2), {y: 48, opacity: 0, duration: .6, stagger: .08}, .11);
  }
  timeline.to(dialog, {opacity: 0, duration: .46}, book ? .95 : .44);
  return {finished, cancel() {
    timeline.kill();
    gsap.set([dialog, ...controls, ...parts, ...(book ? [book] : [])], {clearProps: 'transform,opacity'});
  }};
});
