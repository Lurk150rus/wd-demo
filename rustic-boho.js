import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  timeline
    .to(select('.rb-bow'), {y: -16, rotation: 19, opacity: 0, duration: .28}, 0)
    .to(select('.rb-ribbon'), {x: 54, opacity: 0, duration: .35}, .08)
    .to(select('.rb-paper-fold'), {rotationX: 166, duration: .78, ease: 'power2.inOut'}, .25)
    .to(select('.rb-paper-fold'), {opacity: 0, duration: .26}, .72)
    .to(select('.rb-scroll-paper'), {rotation: 0, y: -8, duration: .63, ease: 'power2.out'}, .55)
    .to(dialog, {opacity: 0, duration: .43, ease: 'sine.inOut'}, 1.22);
}));
