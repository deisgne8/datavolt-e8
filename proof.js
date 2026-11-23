(() => {
  const numbers = [...document.querySelectorAll('.proof-number[data-count]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!numbers.length || reduced.matches || !('IntersectionObserver' in window)) return;

  const running = new Map();
  const finish = (number) => {
    cancelAnimationFrame(running.get(number));
    running.delete(number);
    number.textContent = number.dataset.count;
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      const number = target.querySelector('.proof-number');
      const total = Number(number.dataset.count);
      const delay = Math.min(numbers.indexOf(number) * 85, 300);
      const start = performance.now() + delay;
      const frame = (now) => {
        const progress = Math.max(0, Math.min(1, (now - start) / 1600));
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = String(progress === 1 ? total : Math.floor(total * eased));
        if (progress < 1) running.set(number, requestAnimationFrame(frame));
        else finish(number);
      };
      running.set(number, requestAnimationFrame(frame));
    });
  }, { threshold: .2 });

  numbers.forEach((number) => {
    number.textContent = '0';
    observer.observe(number.closest('.proof-figure'));
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    numbers.forEach(finish);
  });
})();
