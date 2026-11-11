export function initializeOpening(play) {
  const dialog = document.querySelector('[data-occasion-opening]');
  const title = document.querySelector('main h1');
  const date = document.querySelector('main .cover-date');
  if (!dialog || !title || !date || typeof dialog.showModal !== 'function' ||
      getComputedStyle(dialog).getPropertyValue('--opening-ready').trim() !== '1') return;

  const button = dialog.querySelector('[data-open]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const published = Boolean(document.getElementById('published-data'));
  const preview = !published && new URLSearchParams(location.search).has('preview');
  let active = false, key, fallback, animation, replay;

  function finish(focus = !location.hash) {
    if (!active) return;
    active = false;
    clearTimeout(fallback);
    animation?.cancel();
    animation = null;
    if (dialog.open) dialog.close();
    dialog.hidden = true;
    dialog.classList.remove('is-opening');
    button.disabled = false;
    try { sessionStorage.setItem(key, 'opened'); } catch { /* Storage is optional. */ }
    if (focus) {
      title.tabIndex = -1;
      title.focus({preventScroll: true});
    }
  }

  function show(force = false) {
    if (active || reduced.matches || (!force && location.hash)) return;
    if (!force) {
      try { if (sessionStorage.getItem(key) === 'opened') return; } catch { /* Storage is optional. */ }
    }
    dialog.querySelector('[data-opening-names]').textContent = Array.from(
      title.querySelectorAll('span'), span => span.textContent.trim()
    ).join(' & ');
    dialog.querySelector('[data-opening-date]').textContent = date.textContent.trim();
    dialog.hidden = false;
    try { dialog.showModal(); active = true; }
    catch { dialog.hidden = true; }
  }

  button.addEventListener('click', () => {
    if (!active || button.disabled) return;
    button.disabled = true;
    fallback = setTimeout(() => finish(), 2100);
    try {
      dialog.classList.add('is-opening');
      animation = play(dialog);
      animation.finished.then(() => finish(), () => {});
    } catch { finish(); }
  });
  dialog.addEventListener('close', () => { if (!dialog.open) finish(); });
  dialog.addEventListener('cancel', () => finish());
  addEventListener('hashchange', () => { if (location.hash) finish(false); });
  addEventListener('pagehide', () => finish(false));
  reduced.addEventListener('change', () => {
    if (reduced.matches) finish(false);
    if (replay) replay.hidden = reduced.matches;
  });

  function ready() {
    const names = Array.from(title.querySelectorAll('span'), span => span.textContent.trim());
    if (names.length !== 2 || names.some(name => !name) || ((preview || published) && !window.weddingDate)) return false;
    const controls = preview && document.querySelector('.personal-toolbar .pt-controls');
    if (preview && !controls) return false;
    key = JSON.stringify(['occasion-opening', location.pathname, names, window.weddingDate || date.textContent]);
    if (controls) {
      replay = document.createElement('button');
      replay.type = 'button';
      replay.className = 'pt-button';
      replay.textContent = 'Повторить вступление';
      replay.hidden = reduced.matches;
      replay.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'instant'});
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
    observer.observe(document.body, {childList: true, subtree: true});
    const timeout = setTimeout(() => observer.disconnect(), 9500);
  }
}
