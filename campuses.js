(() => {
  const section = document.querySelector('#campuses');
  const stage = section.querySelector('.campus-scroll-stage');
  const track = section.querySelector('.campus-scroll-track');
  const intro = section.querySelector('.campus-intro-slide');
  const cards = [...section.querySelectorAll('.campus-panel')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px) and (pointer: fine)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const cursor = document.createElement('div');
  cursor.className = 'campus-cursor';
  cursor.textContent = 'Explore';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  let visible = cards, width = 0, height = 0, cardWidth = 0;
  let start = 0, range = 0, travel = 0, distance = 0, frame = 0, lastTime = 0;
  let cardProgress = new Map(), active = false, scrollTimer, pointerFocusUntil = 0;
  let pointerX = 0, pointerY = 0, cursorX = 0, cursorY = 0;

  function hideCursor() {
    active = false;
    cursor.classList.remove('is-visible');
  }
  function updateCursorTarget() {
    const element = document.elementFromPoint(pointerX, pointerY);
    const enabled = desktop.matches && !reduced.matches && innerWidth >= 992;
    active = enabled && !!element?.closest('#campuses .campus-image-action') && !document.querySelector('dialog[open]');
    cursor.classList.toggle('is-visible', active);
  }
  function render(time = performance.now(), immediate = false) {
    frame = 0;
    const dt = Math.min(50, time - (lastTime || time - 16.7));
    lastTime = time;
    let moving = false;
    if (desktop.matches && !reduced.matches) {
      const progress = scrollY - start < 1 ? 0 : clamp((scrollY - start) / range);
      const target = progress * travel;
      // ~0.5 second scroll catch-up, followed by a slower image/row scrub.
      distance = immediate ? target : distance + (target - distance) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - distance) < .05) distance = target;
      moving = Math.abs(target - distance) > .05;
      track.style.transform = `translate3d(${-distance}px,0,0)`;
      intro.style.setProperty('--intro-shade', String(.6 * (1 - Math.pow(1 - clamp(progress * 4), 2))));
      intro.style.setProperty('--intro-opacity', progress > .9 ? '0' : '1');
      visible.forEach((card, index) => {
        const left = width + index * cardWidth - distance;
        const entry = width * .9 - cardWidth * .1;
        // The last card stops at the right edge, so finish its reveal there.
        const exit = index === visible.length - 1 ? width - cardWidth : width - cardWidth * 2.5;
        const targetProgress = clamp((entry - left) / (entry - exit));
        let p = cardProgress.get(card) || 0;
        p = immediate ? targetProgress : p + (targetProgress - p) * (1 - Math.exp(-dt / 220));
        if (Math.abs(p - targetProgress) < .0001) p = targetProgress;
        moving ||= Math.abs(p - targetProgress) > .0001;
        cardProgress.set(card, p);
        const rowEase = 1 - Math.pow(1 - clamp(p * 2), 2);
        card.style.setProperty('--image-height', `${height * .5 + (height * .5 - 285) * rowEase}px`);
        card.style.setProperty('--image-scale', String(1 + .3 * Math.pow(1 - p, 2)));
        card.style.setProperty('--card-light', index === 0 ? String(.5 + .5 * (1 - Math.pow(1 - clamp(p / .3), 3))) : '1');
        card.classList.toggle('is-revealed', p > .2);
      });
    } else if (!reduced.matches) {
      visible.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.classList.toggle('is-revealed', rect.top + rect.height * .15 < innerHeight * .8);
      });
    }
    if (active) {
      const x = Math.min(pointerX, innerWidth - 133) + 10;
      const y = pointerY + 10;
      const easing = 1 - Math.pow(.88, dt / 16.7);
      cursorX += (x - cursorX) * easing;
      cursorY += (y - cursorY) * easing;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      moving ||= Math.abs(x - cursorX) + Math.abs(y - cursorY) > .1;
    }
    if (moving) schedule();
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function measure() {
    cancelAnimationFrame(frame);
    frame = 0;
    const pinned = desktop.matches && !reduced.matches;
    section.classList.toggle('is-scroll-driven', pinned);
    section.classList.toggle('campus-mobile-motion', !desktop.matches && !reduced.matches);
    visible = cards.filter(card => !card.hidden);
    track.style.transform = '';
    intro.style.setProperty('--intro-shade', '0');
    intro.style.setProperty('--intro-opacity', '1');
    cards.forEach(card => {
      card.style.removeProperty('--image-height');
      card.style.removeProperty('--image-scale');
      card.style.removeProperty('--card-light');
      card.classList.toggle('is-revealed', reduced.matches);
    });
    width = section.clientWidth;
    height = stage.clientHeight;
    if (pinned) {
      cardWidth = Math.min(Math.max(500, height * 6 / 7), width * .8, 900);
      section.style.setProperty('--campus-viewport-width', `${width}px`);
      section.style.setProperty('--campus-card-width', `${cardWidth}px`);
      travel = cardWidth * visible.length;
      // Preserve the observed reference's horizontal travel per vertical pixel.
      const rate = cardWidth * 5.2 / (width * 3);
      range = travel / rate;
      // Keep the completed final card pinned before releasing to the next section.
      const finalHold = Math.max(600, height * .8);
      section.style.setProperty('--campus-scroll-height', `${height + range + finalHold}px`);
    } else {
      section.style.removeProperty('--campus-scroll-height');
    }
    start = section.getBoundingClientRect().top + scrollY;
    cardProgress.clear();
    hideCursor();
    render(performance.now(), true);
  }
  section.addEventListener('focusin', event => {
    if (!desktop.matches || reduced.matches || performance.now() < pointerFocusUntil) return;
    const card = event.target.closest('.campus-panel');
    const rect = card?.getBoundingClientRect();
    if (card && (rect.left < 0 || rect.right > width)) {
      const target = Math.min(travel, width + visible.indexOf(card) * cardWidth);
      window.scrollTo({top: start + target / travel * range, behavior: 'instant'});
      cardProgress.clear();
      render(performance.now(), true);
    } else if (event.target.closest('.campus-intro-slide') && scrollY > start + 20) {
      window.scrollTo({top: start, behavior: 'instant'});
      render(performance.now(), true);
    }
  });
  window.addEventListener('campus:filter', event => {
    cards.forEach(card => {card.hidden = event.detail !== 'all' && card.dataset.country !== event.detail});
    visible = cards.filter(card => !card.hidden);
    visible.forEach((card, i) => {card.querySelector('.campus-card-index').textContent = `${i + 1} / ${visible.length}`});
    measure();
  });
  document.addEventListener('pointerdown', () => {pointerFocusUntil = performance.now() + 250;}, {passive: true});
  document.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    const wasActive = active;
    updateCursorTarget();
    if (active && !wasActive) {cursorX = pointerX + 10; cursorY = pointerY + 10;}
    schedule();
  }, {passive: true});
  document.addEventListener('mouseleave', hideCursor);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(frame); frame = 0; hideCursor();} else schedule();
  });
  addEventListener('scroll', () => {
    cursor.classList.add('is-scrolling');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {cursor.classList.remove('is-scrolling'); updateCursorTarget(); schedule();}, 250);
    schedule();
  }, {passive: true});
  addEventListener('resize', measure);
  new ResizeObserver(measure).observe(stage);
  addEventListener('load', measure);
  reduced.addEventListener('change', measure);
  desktop.addEventListener('change', measure);
  document.fonts.ready.then(measure);
  measure();
})();
