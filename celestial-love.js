import {initializeOpening} from './occasion-opening.js';
import {playOpeningTimeline} from './opening-timeline.js';

initializeOpening(dialog => playOpeningTimeline(dialog, (timeline, select) => {
  const [line] = select('.ce-constellation path');
  const length = line.getTotalLength();
  timeline
    .set(line, {strokeDasharray: length, strokeDashoffset: length}, 0)
    .to(select('[data-opening-names]'), {opacity: .24, y: 5, duration: .23}, 0)
    .to(select('.ce-constellation circle'), {x: 0, y: 0, duration: .59, stagger: .045, ease: 'power2.inOut'}, .04)
    .to(line, {strokeDashoffset: 0, duration: .57, ease: 'power1.inOut'}, .62)
    .to(select('[data-opening-names]'), {opacity: 1, y: 0, duration: .42, ease: 'power2.out'}, .94)
    .to(dialog, {opacity: 0, duration: .44, ease: 'sine.inOut'}, 1.47);
}));
