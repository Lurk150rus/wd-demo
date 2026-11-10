/* Independent openings for Romantic and Editorial. Existing intro scripts stay untouched. */
(() => {
  const dialog = document.getElementById('modern-opening');
  const title = document.querySelector('.hero h1, .cover h1');
  if (!dialog || !title || typeof dialog.showModal !== 'function') return;
  if (getComputedStyle(dialog).getPropertyValue('--mi-ready').trim() !== '1') return;
  const editorial = dialog.dataset.miKind === 'editorial';
  const published = !!document.getElementById('published-data');
  const preview = !published && new URLSearchParams(location.search).has('preview');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const button = dialog.querySelector('.mi-open');
  const scene = dialog.querySelector(editorial ? '.mi-magazine' : '.mi-card');
  let active = false, opening = false, key = '', fallback, replay, gesture;
  const names = () => [...title.querySelectorAll('span')].map(el => el.textContent.trim());
  const dateText = () => (document.querySelector('.cover-date, .hero .date')?.innerText || '').replace(/\s+/g, ' ').trim();
  function seen() { try { return sessionStorage.getItem(key) === 'opened'; } catch { return false; } }
  function finish(focus = !location.hash) {
    if (!active) return;
    active = false; opening = false; gesture = null;
    clearTimeout(fallback);
    if (dialog.open) dialog.close();
    dialog.hidden = true;
    dialog.classList.remove('mi-is-opening');
    scene.style.removeProperty('--mi-drag');
    scene.style.removeProperty('--mi-turn-start');
    try { sessionStorage.setItem(key, 'opened'); } catch { /* Optional storage. */ }
    if (focus) {
      title.setAttribute('tabindex', '-1'); title.setAttribute('data-mi-focus', '');
      title.focus({preventScroll:true});
    }
  }
  dialog.addEventListener('close', () => { if (!dialog.open) finish(); });
  dialog.addEventListener('cancel', () => finish());
  addEventListener('pagehide', () => finish(false));
  addEventListener('hashchange', () => { if (location.hash) finish(false); });
  reduced.addEventListener('change', () => {
    if (reduced.matches) finish(false);
    if (replay) replay.hidden = reduced.matches;
  });
  scene.addEventListener('animationend', event => {
    if (opening && event.target === scene && ['mi-card-reveal','mi-page-turn'].includes(event.animationName)) finish();
  });
  function open() {
    if (!active || opening) return;
    if (reduced.matches) { finish(); return; }
    opening = true; button.disabled = true;
    fallback = setTimeout(() => finish(), editorial ? 1850 : 2150);
    try {
      if (editorial) scene.style.setProperty('--mi-turn-start', scene.style.getPropertyValue('--mi-drag') || '0deg');
      else {
        const from = dialog.querySelector('.mi-card-names').getBoundingClientRect();
        const to = title.getBoundingClientRect();
        scene.style.setProperty('--mi-dx', (to.x + to.width / 2 - from.x - from.width / 2) + 'px');
        scene.style.setProperty('--mi-dy', (to.y + to.height / 2 - from.y - from.height / 2) + 'px');
        scene.style.setProperty('--mi-scale', Math.min(2.4, Math.max(1.1, to.height / Math.max(1, from.height))));
      }
      dialog.classList.add('mi-is-opening');
    } catch { finish(); }
  }
  button.addEventListener('click', open);
  if (editorial) {
    scene.addEventListener('pointerdown', event => {
      if (opening || !event.isPrimary || event.button !== 0) return;
      gesture = {id:event.pointerId,x:event.clientX,y:event.clientY,dragging:false};
    });
    scene.addEventListener('pointermove', event => {
      if (!gesture || gesture.id !== event.pointerId || opening) return;
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      if (!gesture.dragging && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
      if (dx < -12 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (!gesture.dragging) { gesture.dragging = true; scene.setPointerCapture(event.pointerId); }
        scene.style.setProperty('--mi-drag', Math.max(-42, dx / scene.offsetWidth * 60) + 'deg');
      }
    });
    scene.addEventListener('pointerup', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const shouldOpen = gesture.dragging && dx < -Math.min(65, scene.offsetWidth * .16);
      gesture = null;
      if (shouldOpen) open(); else scene.style.removeProperty('--mi-drag');
    });
    scene.addEventListener('pointercancel', () => { gesture = null; if (!opening) scene.style.removeProperty('--mi-drag'); });
  }
  function show(force = false) {
    if (active || reduced.matches || (!force && (location.hash || seen()))) return;
    const values = names();
    if (values.length !== 2 || values.some(name => !name)) return;
    for (const [selector,value] of [['[data-mi-first]',values[0]],['[data-mi-second]',values[1]],['[data-mi-date]',dateText()]]) {
      dialog.querySelectorAll(selector).forEach(el => { el.textContent = value; });
    }
    if (editorial) {
      const photo = document.querySelector('.cover img');
      const src = photo?.getAttribute('src');
      if (src) dialog.querySelector('[data-mi-photo]').src = src;
    }
    dialog.toggleAttribute('data-mi-long', values.some(name => name.length > 16));
    dialog.classList.remove('mi-is-opening'); button.disabled = false;
    dialog.hidden = false;
    try { dialog.showModal(); active = true; button.focus({preventScroll:true}); }
    catch { dialog.hidden = true; }
  }
  function ready() {
    const values = names();
    if (values.length !== 2 || values.some(name => !name) || ((published || preview) && !window.weddingDate)) return false;
    const controls = preview && document.querySelector('.personal-toolbar .pt-controls');
    if (preview && !controls) return false;
    key = 'modern-opening:v1:' + dialog.dataset.miKind + ':' + location.pathname + ':' + values.join('|') + ':' + (window.weddingDate || dateText());
    if (!editorial && (published || preview)) {
      const logo = document.querySelector('header .logo');
      if (logo) {
        const ampersand = document.createElement('span'); ampersand.textContent = '&';
        logo.replaceChildren(values[0].slice(0,1),ampersand,values[1].slice(0,1));
      }
    }
    if (controls && !replay) {
      replay = document.createElement('button'); replay.type = 'button'; replay.className = 'pt-button mi-replay';
      replay.textContent = 'Повторить вступление'; replay.hidden = reduced.matches;
      replay.addEventListener('click', () => { window.scrollTo({top:0,behavior:'instant'}); show(true); });
      controls.append(replay);
    }
    show(); return true;
  }
  if (!ready()) {
    const observer = new MutationObserver(() => { if (ready()) { observer.disconnect(); clearTimeout(timeout); } });
    observer.observe(document.body, {childList:true,subtree:true});
    const timeout = setTimeout(() => observer.disconnect(), 9500);
  }
})();
