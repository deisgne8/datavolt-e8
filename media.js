(() => {
  const section = document.querySelector('#news');
  if (!section) return;
  const track = section.querySelector('.media-track');
  const previous = section.querySelector('.media-previous');
  const next = section.querySelector('.media-next');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => reduced.matches ? 'instant' : 'smooth';
  function update() {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  function move(direction) {
    const card = track.querySelector('.media-card');
    track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: behavior() });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  new ResizeObserver(update).observe(track);
  update();
})();
