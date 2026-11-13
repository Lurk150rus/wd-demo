import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const portrait = dialog.querySelector('.nw-opening-photo img');
  const currentPhoto = document.querySelector('.nw-front-grid img');
  if (portrait && currentPhoto) portrait.src = currentPhoto.getAttribute('src');
  timeline
    .to(select('.nw-opening-actions'), {opacity: 0, duration: .22}, 0)
    .to(select('.nw-press-mask'), {yPercent: 103, duration: .85, ease: 'power3.inOut'}, .08)
    .to(dialog, {opacity: 0, duration: .45, ease: 'sine.inOut'}, 1.18);
}));
