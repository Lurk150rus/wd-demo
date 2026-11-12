import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  timeline
    .to(select('.nw-opening-stage > button'), {opacity: 0, duration: .24}, 0)
    .to(select('.nw-fold'), {rotationX: -174, duration: .82, ease: 'power2.inOut'}, .12)
    .to(select('.nw-fold'), {opacity: 0, duration: .24}, .70)
    .to(select('.nw-paper'), {scale: 1.17, y: -8, duration: .68, ease: 'power2.inOut'}, .69)
    .to(dialog, {opacity: 0, duration: .49, ease: 'sine.inOut'}, 1.08);
}));
