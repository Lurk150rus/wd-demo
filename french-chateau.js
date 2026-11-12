import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const doors = select('.fc-door');
  timeline
    .to(select('.fc-opening-copy'), {opacity: 0, y: -8, duration: .35, ease: 'power2.in'}, 0)
    .to(doors, {rotationY: index => index ? 96 : -96, duration: 1.26, ease: 'power2.inOut', stagger: .065}, .12)
    .to(dialog, {opacity: 0, duration: .54, ease: 'sine.inOut'}, .97);
}));
