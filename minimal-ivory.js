import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => {
  const card = dialog.querySelector('.iv-fold');
  const cover = document.querySelector('.iv-cover-copy');
  const from = card.getBoundingClientRect();
  const to = cover.getBoundingClientRect();
  dialog.style.setProperty('--iv-x', (to.left - from.left) + 'px');
  dialog.style.setProperty('--iv-y', (to.top - from.top) + 'px');
  dialog.style.setProperty('--iv-scale', Math.min(2.25, to.width / Math.max(1, from.width)));
  return dialog.animate([
    {opacity: 1, offset: 0},
    {opacity: 1, offset: .50},
    {opacity: 0},
  ], {duration: 1670, easing: 'ease-in-out', fill: 'forwards'});
});
