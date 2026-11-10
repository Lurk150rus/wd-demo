/* Only loaded by Italian Summer. Shared personalization and RSVP stay intact. */
(() => {
  const title = document.querySelector('.cover h1');
  const adaptNames = () => {
    const names = [...title.querySelectorAll('span')].map(el => el.textContent.trim());
    document.body.toggleAttribute('data-long-names', names.some(name => name.length > 12));
  };
  adaptNames();
  new MutationObserver(adaptNames).observe(title, {childList:true, subtree:true, characterData:true});

  const portrait = document.querySelector('.cover-portrait img');
  const adaptPhoto = () => {
    portrait.classList.toggle('is-landscape', portrait.naturalWidth > portrait.naturalHeight * 1.2);
    portrait.classList.toggle('is-personal-photo', !portrait.getAttribute('src').startsWith('/wd-demo/photos/'));
  };
  portrait.addEventListener('load', adaptPhoto);
  new MutationObserver(adaptPhoto).observe(portrait, {attributes:true, attributeFilter:['src']});
  if (portrait.complete) adaptPhoto();

  const storyPhoto = document.querySelector('.story-photo img');
  const adaptStoryPhoto = () => storyPhoto.classList.toggle('is-personal-photo', !storyPhoto.getAttribute('src').startsWith('/wd-demo/photos/'));
  adaptStoryPhoto();
  new MutationObserver(adaptStoryPhoto).observe(storyPhoto, {attributes:true, attributeFilter:['src']});

  const button = document.querySelector('.mobile-rsvp');
  if ('IntersectionObserver' in window) {
    let coverVisible = true;
    let formVisible = false;
    let footerVisible = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target.classList.contains('cover')) coverVisible = entry.isIntersecting;
        else if (entry.target.id === 'rsvp') formVisible = entry.isIntersecting;
        else footerVisible = entry.isIntersecting;
      });
      button.classList.toggle('is-hidden', coverVisible || formVisible || footerVisible);
    });
    observer.observe(document.querySelector('.cover'));
    observer.observe(document.getElementById('rsvp'));
    observer.observe(document.querySelector('footer'));
  }
})();
