(() => {
  const statement = document.querySelector('.home-page .hero-statement');
  if (!statement) return;
  const paragraphs = [...statement.querySelectorAll('.hero-tagline, .hero-subtitle')];
  if (paragraphs.length !== 2) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = paragraphs.map(paragraph => {
    const text = paragraph.textContent.trim();
    const source = document.createElement('span');
    source.className = 'hero-type-source';
    source.textContent = text;
    const overlay = document.createElement('span');
    overlay.className = 'hero-typed';
    overlay.setAttribute('aria-hidden', 'true');
    const typed = document.createElement('span');
    typed.className = 'hero-typed-text';
    overlay.append(typed);
    // The complete source keeps its layout and accessible text throughout.
    paragraph.replaceChildren(source, overlay);
    paragraph.classList.add('hero-type-line');
    return {text, characters: Array.from(text), typed};
  });

  const TYPE_MS = 120;
  const ERASE_MS = 24;
  const firstEnd = lines[0].characters.length * TYPE_MS;
  const secondStart = firstEnd + 300;
  const secondEnd = secondStart + lines[1].characters.length * TYPE_MS;
  const eraseStart = secondEnd + 1400;
  const eraseSecondEnd = eraseStart + lines[1].characters.length * ERASE_MS;
  const eraseEnd = eraseSecondEnd + lines[0].characters.length * ERASE_MS;
  const cycleDuration = eraseEnd + 400;
  let elapsed = 0;
  let previousTime = performance.now();
  let timer;
  let visible = true;
  const intro = document.querySelector('.site-intro');
  let introDone = !intro || getComputedStyle(intro).display === 'none';

  function paint(counts, active = -1) {
    lines.forEach((line, index) => {
      const text = line.characters.slice(0, counts[index]).join('');
      if (line.typed.textContent !== text) line.typed.textContent = text;
      line.typed.classList.toggle('is-typing', index === active);
    });
  }

  function frame(now) {
    const time = now % cycleDuration;
    const lengths = lines.map(line => line.characters.length);
    if (time < firstEnd) paint([Math.floor(time / TYPE_MS), 0], 0);
    else if (time < secondStart) paint([lengths[0], 0], 0);
    else if (time < secondEnd) paint([lengths[0], Math.floor((time - secondStart) / TYPE_MS)], 1);
    else if (time < eraseStart) paint(lengths);
    else if (time < eraseSecondEnd) paint([lengths[0], lengths[1] - Math.floor((time - eraseStart) / ERASE_MS)], 1);
    else if (time < eraseEnd) paint([lengths[0] - Math.floor((time - eraseSecondEnd) / ERASE_MS), 0], 0);
    else paint([0, 0]);
  }

  function tick() {
    const now = performance.now();
    elapsed += now - previousTime;
    previousTime = now;
    frame(elapsed);
    timer = setTimeout(tick, ERASE_MS);
  }

  function sync() {
    clearTimeout(timer);
    if (reducedMotion.matches) {
      paint(lines.map(line => line.characters.length));
      return;
    }
    frame(elapsed);
    if (visible && !document.hidden && introDone) {
      previousTime = performance.now();
      timer = setTimeout(tick, ERASE_MS);
    }
  }

  if (!introDone) {
    const introObserver = new MutationObserver(() => {
      if (intro.style.display === 'none') {
        introDone = true;
        introObserver.disconnect();
        sync();
      }
    });
    introObserver.observe(intro, {attributes:true, attributeFilter:['style']});
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(statement);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
})();
