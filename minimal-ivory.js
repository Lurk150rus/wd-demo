import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const portrait = dialog.querySelector('.iv-opening-photo img');
  const coverPhoto = document.querySelector('.iv-cover img');
  if (portrait && coverPhoto) portrait.src = coverPhoto.src;

  timeline
    .to(select('.iv-opening-actions'), {opacity: 0, duration: .2}, 0)
    .to(select('.iv-opening-caption'), {y: -12, opacity: 0, duration: .45, ease: 'power2.in'}, 0)
    .to(select('.iv-opening-photo'), {clipPath: 'inset(0 0 100% 0)', duration: .65, ease: 'power2.inOut'}, .25)
    .to(dialog, {opacity: 0, duration: .45, ease: 'sine.inOut'}, .55);
}));
