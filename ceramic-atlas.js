import { initializeOpening } from './occasion-opening.js';

const route = document.querySelector('.wedding-atlas .schedule ol');
if (route) {
  const address = document.querySelector('.location-copy > p:not(.overline)');
  const directions = document.querySelector('[data-atlas-directions]');
  const pins = [...document.querySelectorAll('.ca-pin')];

  function updateRoute() {
    [...route.children].forEach((event, index) => { event.id = 'route-' + (index + 1); });
    pins.forEach((pin, index) => {
      const name = route.children[index]?.querySelector('h3')?.textContent;
      pin.hidden = !name;
      if (name) pin.setAttribute('aria-label', name);
    });
  }

  function updateDirections() {
    const query = address.textContent.trim();
    directions.hidden = !query;
    directions.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  }

  updateRoute();
  updateDirections();
  new MutationObserver(updateRoute).observe(route, {childList: true});
  new MutationObserver(updateDirections).observe(address, {childList: true, characterData: true, subtree: true});
}

initializeOpening(dialog => {
  if (dialog.querySelector('.mail-envelope')) {
    return dialog.animate([{opacity: 1}, {opacity: 1, offset: .83}, {opacity: 0}],
      {duration: 1980, easing: 'ease-in-out', fill: 'forwards'});
  }

  const gsap = window.gsap;
  if (!gsap) {
    const animation = dialog.animate([{opacity: 1}, {opacity: 0}], 280);
    return {finished: animation.finished, cancel: () => animation.cancel()};
  }

  const get = selector => dialog.querySelector(selector);
  const controls = [...dialog.querySelectorAll('button')];
  const animated = [...controls, dialog];
  let done;
  const finished = new Promise(resolve => { done = resolve; });
  const timeline = gsap.timeline({onComplete: done});
  timeline.to(controls, {opacity: 0, duration: .23}, 0);

  const [fold, left, right, label] = ['.ca-fold', '.left', '.right', '.ca-fold-label'].map(get);
  animated.push(fold, left, right, label);
  timeline
    .to(label, {opacity: 0, y: 10, duration: .32}, 0)
    .to(left, {rotateY: 180, opacity: .15, duration: .73, ease: 'power2.inOut'}, .16)
    .to(right, {rotateY: -180, opacity: .15, duration: .75, ease: 'power2.inOut'}, .27)
    .to(fold, {scale: 1.45, duration: .65, ease: 'power2.inOut'}, .75)
    .to(dialog, {opacity: 0, duration: .45}, 1.05);

  return {finished, cancel() {
    timeline.kill();
    gsap.set(animated, {clearProps: 'transform,opacity'});
  }};
});
