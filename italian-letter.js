/* Progressive enhancement for Italian Summer only. No guest data or network requests. */
(() => {
  const dialog = document.getElementById('italian-letter');
  const title = document.getElementById('couple-names');
  const preview = new URLSearchParams(location.search).has('preview');
  const personalized = preview || !!document.getElementById('published-data');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!dialog || !title || typeof dialog.showModal !== 'function') return;
  const openButton = dialog.querySelector('.letter-open');
  const card = dialog.querySelector('.letter-card');
  const flap = dialog.querySelector('.letter-flap');
  const wax = dialog.querySelector('.letter-wax');
  let active = false, opening = false, key = '', watchdog, animations = [], replay;

  function remember() { try { sessionStorage.setItem(key, 'opened'); } catch { /* Storage may be disabled. */ } }
  function seen() { try { return sessionStorage.getItem(key) === 'opened'; } catch { return false; } }
  function finish(focus = true) {
    if (!active) return;
    active = false;
    opening = false;
    clearTimeout(watchdog);
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (dialog.open) dialog.close();
    dialog.hidden = true;
    if (key) remember();
    if (focus && !location.hash) {
      title.setAttribute('tabindex', '-1');
      title.focus({preventScroll:true});
    }
  }
  // The skip button is a native method=dialog form: it still closes if animation JS fails.
  dialog.addEventListener('close', () => finish(!location.hash));
  dialog.addEventListener('cancel', () => finish(!location.hash));
  addEventListener('hashchange', () => { if (location.hash) finish(false); });
  addEventListener('pagehide', () => finish(false));
  reduced.addEventListener('change', () => { if (reduced.matches) finish(false); if (replay) replay.hidden = reduced.matches; });

  function animate(element, frames, options) {
    const animation = element.animate(frames, {fill:'forwards', easing:'cubic-bezier(.22,.68,.18,1)', ...options});
    animations.push(animation);
    return animation.finished;
  }
  async function openLetter() {
    if (!active || opening) return;
    if (reduced.matches || typeof card.animate !== 'function') { finish(); return; }
    opening = true;
    openButton.disabled = true;
    watchdog = setTimeout(() => finish(), 5500);
    try {
      await Promise.all([
        animate(wax, [{opacity:1,transform:'rotate(-12deg) scale(1)'},{opacity:0,transform:'rotate(-18deg) scale(.82) translateY(9px)'}], {duration:320}),
        animate(dialog.querySelector('.letter-heading'), [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}], {duration:320})
      ]);
      await animate(flap, [{transform:'rotateX(0deg)'},{transform:'rotateX(-178deg)'}], {duration:650});
      if (!active) return;
      flap.style.zIndex = '1';
      const rise = -dialog.querySelector('.letter-envelope').offsetHeight * .62;
      await animate(card, [{transform:'translateY(0) rotate(0)'},{transform:`translateY(${rise}px) rotate(-2deg)`}], {duration:760});
      if (!active) return;
      const from = dialog.querySelector('.letter-card-names').getBoundingClientRect();
      const to = title.getBoundingClientRect();
      const dx = to.x + to.width / 2 - from.x - from.width / 2;
      const dy = to.y + to.height / 2 - from.y - from.height / 2;
      const scale = Math.min(2.5, Math.max(.7, to.height / from.height));
      const fading = [...dialog.querySelectorAll('.letter-actions,.letter-shell,.letter-flap,.letter-card-label,.letter-card-date,.letter-card-signature,.letter-card-rule')];
      await Promise.all([
        ...fading.map(el => animate(el, [{opacity:1},{opacity:0}], {duration:430})),
        animate(dialog.querySelector('.letter-backdrop'), [{opacity:1},{opacity:0}], {duration:850,delay:100}),
        animate(card, [{transform:`translateY(${rise}px) rotate(-2deg)`,opacity:1},{transform:`translate(${dx}px,${rise + dy}px) rotate(0) scale(${scale})`,opacity:0,background:'transparent',boxShadow:'0 0 0 transparent',borderColor:'transparent'}], {duration:950})
      ]);
      finish();
    } catch { finish(); } // Cancellation, disabled animations, or an interrupted rendering process.
  }
  openButton.addEventListener('click', openLetter);

  function show(force = false) {
    if (active || reduced.matches || (!force && (location.hash || seen()))) return;
    if (getComputedStyle(dialog).getPropertyValue('--letter-ready').trim() !== '1') return;
    dialog.querySelector('[data-letter-first]').textContent = title.querySelectorAll('span')[0].textContent;
    dialog.querySelector('[data-letter-second]').textContent = title.querySelectorAll('span')[1].textContent;
    dialog.querySelector('[data-letter-address]').textContent = [...title.querySelectorAll('span')].map(el => el.textContent).join(' & ');
    dialog.querySelector('.letter-card-date').textContent = document.querySelector('.cover-date').textContent;
    dialog.toggleAttribute('data-long-letter', [...title.querySelectorAll('span')].some(el => el.textContent.length > 14));
    // Reset inline state from the preceding performance (preview replay).
    flap.style.zIndex = '';
    openButton.disabled = false;
    dialog.hidden = false;
    try {
      dialog.showModal();
      active = true;
      openButton.focus({preventScroll:true});
    } catch { dialog.hidden = true; }
  }
  function ready() {
    const names = [...title.querySelectorAll('span')].map(el => el.textContent.trim());
    if (names.length !== 2 || names.some(name => !name) || (personalized && !window.weddingDate)) return false;
    key = 'italian-letter:v1:' + location.pathname + ':' + names.join('|') + ':' + (window.weddingDate || document.body.dataset.date);
    if (preview) {
      const controls = document.querySelector('.personal-toolbar .pt-controls');
      if (!controls) return false;
      replay = document.createElement('button');
      replay.type = 'button'; replay.className = 'pt-button letter-replay'; replay.textContent = 'Повторить вступление'; replay.hidden = reduced.matches;
      replay.addEventListener('click', () => { window.scrollTo({top:0,behavior:'instant'}); show(true); });
      controls.append(replay);
    }
    show();
    return true;
  }
  if (!ready()) {
    const observer = new MutationObserver(() => { if (ready()) { observer.disconnect(); clearTimeout(timeout); } });
    observer.observe(document.body, {childList:true,subtree:true});
    const timeout = setTimeout(() => observer.disconnect(), 9500); // Failed personalization never creates an overlay.
  }
})();
