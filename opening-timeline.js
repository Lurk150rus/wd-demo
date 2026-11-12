const gsap = window.gsap ?? await new Promise(resolve => {
  const script = document.createElement('script');
  script.src = new URL('./experiments/gsap-3.15.0.min.js', import.meta.url);
  script.onload = () => resolve(window.gsap);
  script.onerror = () => resolve(null);
  document.head.append(script);
});

export function playOpeningTimeline(dialog, build) {
  if (!gsap) return dialog.animate([{opacity: 1}, {opacity: 0}], {
    duration: 240, fill: 'forwards'
  });
  const select = gsap.utils.selector(dialog);
  let complete;
  const finished = new Promise(resolve => { complete = resolve; });
  dialog.dataset.gsapMotion = '';
  const context = gsap.context(() => {
    const timeline = gsap.timeline({paused: true, onComplete: complete});
    build(timeline, select);
    timeline.play();
  }, dialog);
  return {
    finished,
    cancel() {
      context.revert();
      delete dialog.dataset.gsapMotion;
      complete();
    }
  };
}
