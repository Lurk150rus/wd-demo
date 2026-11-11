import {initializeOpening} from './occasion-opening.js';

const label = document.querySelector('[data-opening-names]');
const monogram = document.querySelector('.om-monogram');

if (label && monogram) {
  const observer = new MutationObserver(() => {
    const names = document.querySelectorAll('main h1 span');
    monogram.textContent = Array.from(names, name => {
      const [initial = ''] = Array.from(name.textContent.trim());
      return initial.toLocaleUpperCase('ru');
    }).join(' ');
  });
  observer.observe(label, {childList: true});
}

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .69},
  {opacity: 0},
], {duration: 1780, easing: 'ease-in-out', fill: 'forwards'}));
