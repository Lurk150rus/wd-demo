(() => {
  const dialog = document.getElementById('ni-opening');
  if (!dialog || typeof dialog.showModal !== 'function' ||
      getComputedStyle(dialog).getPropertyValue('--ni-ready').trim() !== '1') return;

  const title = document.querySelector('.ni-cover h1');
  const button = dialog.querySelector('.ni-open');
  const nameLabel = dialog.querySelector('#ni-opening-names');
  const published = Boolean(document.getElementById('published-data'));
  const preview = !published && new URLSearchParams(location.search).has('preview');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = () => Array.from(title.querySelectorAll('span'), span => span.textContent.trim());
  let key, fallback, replay, active = false;

  function finish(restoreFocus = !location.hash) {
    if (!active) return;
    active = false;
    clearTimeout(fallback);
    if (dialog.open) dialog.close();
    dialog.hidden = true;
    dialog.classList.remove('is-revealing');
    button.disabled = false;
    try { sessionStorage.setItem(key, 'opened'); } catch { /* Storage is optional. */ }
    if (restoreFocus) {
      title.tabIndex = -1;
      title.focus({preventScroll: true});
    }
  }

  function show(force = false) {
    if (active || reduced.matches || location.hash) return;
    if (!force) {
      try { if (sessionStorage.getItem(key) === 'opened') return; } catch { /* Storage is optional. */ }
    }
    nameLabel.textContent = names().join(' & ');
    const date = dialog.querySelector('.ni-opening-date');
    if (date) date.textContent = document.querySelector('.ni-cover .cover-date').textContent.trim();
    dialog.hidden = false;
    try { dialog.showModal(); active = true; }
    catch { dialog.hidden = true; }
  }

  button.addEventListener('click', () => {
    if (!active || button.disabled) return;
    if (reduced.matches) { finish(); return; }
    fallback = setTimeout(finish, 1900);
    button.disabled = true;
    dialog.classList.add('is-revealing');
  });
  dialog.addEventListener('animationend', event => {
    if (event.target === dialog && event.animationName === 'ni-reveal') finish();
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
    const values = names();
    if (values.length !== 2 || values.some(name => !name) || ((published || preview) && !window.weddingDate)) return false;
    const controls = preview && document.querySelector('.personal-toolbar .pt-controls');
    if (preview && !controls) return false;
    key = JSON.stringify(['invitation-opening', location.pathname, values, window.weddingDate || document.body.dataset.date]);
    if (controls) {
      replay = document.createElement('button');
      replay.type = 'button';
      replay.className = 'pt-button';
      replay.textContent = 'Повторить вступление';
      replay.hidden = reduced.matches;
      replay.addEventListener('click', () => {
        if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
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
})();
