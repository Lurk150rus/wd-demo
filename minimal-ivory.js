import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const [card] = select('.iv-fold');
  const from = card.getBoundingClientRect();
  const to = document.querySelector('.iv-cover-copy').getBoundingClientRect();
  timeline
    .to(select('.iv-opening-actions'), {opacity: 0, duration: .25}, 0)
    .to(select('.iv-leaf'), {rotationY: 165, duration: .65, ease: 'power2.inOut'}, .06)
    .to(select('.iv-leaf'), {opacity: 0, duration: .22}, .48)
    .to(card, {
      x: to.left - from.left,
      y: to.top - from.top,
      scale: Math.min(2.25, to.width / Math.max(1, from.width)),
      duration: .74,
      ease: 'power2.inOut'
    }, .57)
    .to(dialog, {opacity: 0, duration: .46, ease: 'sine.inOut'}, 1.06);
}));
