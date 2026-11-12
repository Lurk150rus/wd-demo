import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const loops = select('.cr-ribbon i');
  timeline
    .to(loops, {x: index => index ? 64 : -64, scaleY: .2, duration: .44, stagger: .07, ease: 'power2.in'}, 0)
    .to(select('.cr-ribbon'), {xPercent: 72, rotation: 9, opacity: 0, duration: .52, ease: 'power2.in'}, .34)
    .to(select('.cr-gift'), {scale: 1.12, y: -7, duration: .68, ease: 'power2.inOut'}, .65)
    .to(dialog, {opacity: 0, duration: .48, ease: 'sine.inOut'}, 1.08);
}));
