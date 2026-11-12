import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const panels = select('.ad-panels > div');
  timeline
    .to(select('.ad-opening-copy'), {opacity: 0, y: -6, duration: .38, ease: 'power2.in'}, .08)
    .to(panels, {xPercent: index => index ? 105 : -105, yPercent: -3, duration: 1.13, ease: 'power3.inOut'}, .24)
    .to(dialog, {opacity: 0, duration: .52, ease: 'sine.inOut'}, .97);
}));
