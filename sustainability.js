(() => {
  const section = document.querySelector('#sustainability');
  if (!section) return;
  const scenes = [...section.querySelectorAll('.sustainability-scene')];
  const desktop = matchMedia('(min-width: 701px) and (min-height: 650px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = false;
  let frame = 0;
  let active = -1;
  const clamp = value => Math.max(0, Math.min(1, value));
  function setSegments(element, progress) {
    scenes.forEach((_, i) => {
      element.style.setProperty(`--progress-${i + 1}`, clamp(progress * scenes.length - i).toFixed(4));
    });
  }
  function update() {
    frame = 0;
    if (reduced.matches) return;
    if (!enabled) {
      scenes.forEach((scene, i) => {
        const top = scene.querySelector('.sustainability-feature').getBoundingClientRect().top;
        const reveal = clamp((innerHeight * .85 - top) / (innerHeight * .5));
        setSegments(scene, (i + reveal) / scenes.length);
        scene.style.setProperty('--text-reveal', `${(reveal * 100).toFixed(2)}%`);
      });
      return;
    }
    const distance = section.offsetHeight - innerHeight;
    const progress = clamp(-section.getBoundingClientRect().top / distance);
    const next = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
    setSegments(section, progress);
    scenes.forEach((scene, i) => {
      const reveal = clamp((progress * scenes.length - i) / .8);
      scene.style.setProperty('--text-reveal', `${(reveal * 100).toFixed(2)}%`);
    });
    if (next === active) return;
    active = next;
    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === active);
      scene.inert = i !== active;
    });
  }
  function schedule() {
    if (!reduced.matches && !frame) frame = requestAnimationFrame(update);
  }
  function configure() {
    enabled = desktop.matches && !reduced.matches;
    section.classList.toggle('is-scroll-scene', enabled);
    section.classList.toggle('has-scroll-reveal', !reduced.matches);
    active = -1;
    scenes.forEach(scene => {
      scene.inert = false;
      scene.classList.remove('is-active');
      scenes.forEach((_, i) => {
        scene.style.removeProperty(`--progress-${i + 1}`);
        section.style.removeProperty(`--progress-${i + 1}`);
      });
      scene.style.removeProperty('--text-reveal');
    });
    schedule();
  }
  desktop.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  configure();
})();
