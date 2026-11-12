/* Royal Classic: progressive enhancement, independent of Italian Summer. */
(() => {
  const dialog = document.getElementById('royal-curtain');
  const title = document.querySelector('.royal-classic .cover h1');
  if (!dialog || !title || typeof dialog.showModal !== 'function') return;
  if (getComputedStyle(dialog).getPropertyValue('--rc-ready').trim() !== '1') return;
  const published = !!document.getElementById('published-data');
  const preview = !published && new URLSearchParams(location.search).has('preview');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const button = dialog.querySelector('.rc-open');
  const rightPanel = dialog.querySelector('.rc-panel-right');
  let active = false, opening = false, sessionKey = '', fallback, replay;

  function seen() {
    try { return sessionStorage.getItem(sessionKey) === 'opened'; }
    catch { return false; }
  }
  function finish(focus = !location.hash) {
    if (!active) return;
    active = false;
    opening = false;
    clearTimeout(fallback);
    if (dialog.open) dialog.close();
    dialog.hidden = true;
    dialog.classList.remove('rc-is-opening');
    try { sessionStorage.setItem(sessionKey, 'opened'); } catch { /* Optional storage. */ }
    if (focus) {
      title.setAttribute('tabindex', '-1');
      title.setAttribute('data-rc-focus', '');
      title.focus({preventScroll:true});
    }
  }
  // A native method=dialog form supplies Skip even if animation handling fails.
  dialog.addEventListener('close', () => { if (!dialog.open) finish(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); });
  addEventListener('hashchange', () => { if (location.hash) finish(false); });
  addEventListener('pagehide', () => finish(false));
  motion.addEventListener('change', () => {
    if (motion.matches) finish(false);
    if (replay) replay.hidden = motion.matches;
  });
  rightPanel.addEventListener('animationend', event => {
    if (opening && event.target === rightPanel && event.animationName === 'rc-curtain-draw') finish();
  });
  button.addEventListener('click', () => {
    if (!active || opening) return;
    if (motion.matches) { finish(); return; }
    opening = true;
    button.disabled = true;
    // Also releases the page if CSS animations are unavailable or interrupted.
    fallback = setTimeout(() => finish(), 1800);
    try { dialog.classList.add('rc-is-opening'); } catch { finish(); }
  });

  function show(force = false) {
    if (active || motion.matches || (!force && (location.hash || seen()))) return;
    const names = [...title.querySelectorAll('span')].map(el => el.textContent.trim());
    if (names.length !== 2 || names.some(name => !name)) return;
    dialog.querySelector('[data-rc-first]').textContent = names[0];
    dialog.querySelector('[data-rc-second]').textContent = names[1];
    dialog.querySelector('[data-rc-date]').textContent = document.querySelector('.cover .cover-date')?.textContent.trim() ?? '';
    dialog.toggleAttribute('data-rc-long', names.some(name => name.length > 16));
    dialog.classList.remove('rc-is-opening');
    button.disabled = false;
    dialog.hidden = false;
    try {
      dialog.showModal();
      active = true;
      button.focus({preventScroll:true});
    } catch { dialog.hidden = true; }
  }
  function ready() {
    const names = [...title.querySelectorAll('span')].map(el => el.textContent.trim());
    if (names.length !== 2 || names.some(name => !name)) return false;
    if ((preview || published) && !window.weddingDate) return false;
    const controls = preview && document.querySelector('.personal-toolbar .pt-controls');
    if (preview && !controls) return false;
    sessionKey = 'royal-curtain:v1:' + location.pathname + ':' + names.join('|') + ':' + (window.weddingDate || document.body.dataset.date);
    if (controls && !replay) {
      replay = document.createElement('button');
      replay.type = 'button';
      replay.className = 'pt-button rc-replay';
      replay.textContent = 'Повторить вступление';
      replay.hidden = motion.matches;
      replay.addEventListener('click', () => {
        window.scrollTo({top:0,behavior:'instant'});
        show(true);
      });
      controls.append(replay);
    }
    show();
    return true;
  }
  if (!ready()) {
    const observer = new MutationObserver(() => {
      if (ready()) { observer.disconnect(); clearTimeout(timeout); }
    });
    observer.observe(document.body, {childList:true,subtree:true});
    const timeout = setTimeout(() => observer.disconnect(), 9500);
  }
})();
