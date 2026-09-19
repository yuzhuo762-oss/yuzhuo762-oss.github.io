(() => {
  const hero = document.querySelector('.home-page .hero');
  if (!hero) return;
  const cards = [...hero.querySelectorAll('.orbit-work')];
  if (!cards.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const turn = Math.PI * 2;
  const cycleSeconds = 40;
  const pathSteps = 2048;
  let width = hero.clientWidth;
  const statement = hero.querySelector('.hero-statement');
  let centerY = 0;
  let radiusX = 0;
  let radiusY = 0;
  let pathLength = 0;
  const distances = new Float64Array(pathSteps + 1);
  let cardHeight = cards[0]?.offsetHeight || 0;
  let progress = 0;
  let visible = true;
  let previousTime;

  function ellipseLength(horizontal, vertical) {
    const h = ((horizontal - vertical) / (horizontal + vertical)) ** 2;
    return Math.PI * (horizontal + vertical) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  }

  function layout() {
    width = hero.clientWidth;
    cardHeight = cards[0]?.offsetHeight || 0;
    const textCenter = statement.offsetTop;
    const upperExtent = textCenter * 2 * .28;
    const foregroundHalfHeight = cardHeight * 1.75 / 2;
    const lowerExtent = Math.max(upperExtent, statement.offsetHeight / 2 + foregroundHalfHeight + 40);
    centerY = textCenter + (lowerExtent - upperExtent) / 2;
    radiusY = (lowerExtent + upperExtent) / 2;
    hero.style.setProperty('--orbit-stage-height', `${Math.max(textCenter * 2, textCenter + lowerExtent + foregroundHalfHeight + 24)}px`);

    // Set spacing through the track length, never by slowing cards down.
    // Keep the foreground edge-to-edge gap near 20% of the card width,
    // while leaving the horizontal turns outside the frame.
    const foregroundWidth = cards[0].offsetWidth * 1.75;
    const targetLength = cards.length * foregroundWidth * 1.2;
    let low = Math.max(width * .56, radiusY * 1.4);
    let high = Math.max(low, targetLength / 4);
    for (let step = 0; step < 24; step++) {
      const middle = (low + high) / 2;
      if (ellipseLength(middle, radiusY) < targetLength) low = middle;
      else high = middle;
    }
    radiusX = (low + high) / 2;

    // Build an arc-length lookup only on resize. Equal elapsed time then
    // means equal screen distance, including the lower middle and loop seam.
    let previousX = 0;
    let previousY = -radiusY;
    distances[0] = 0;
    for (let step = 1; step <= pathSteps; step++) {
      const phase = -Math.PI / 2 + step / pathSteps * turn;
      const x = radiusX * Math.cos(phase);
      const y = radiusY * Math.sin(phase);
      distances[step] = distances[step - 1] + Math.hypot(x - previousX, y - previousY);
      previousX = x;
      previousY = y;
    }
    pathLength = distances[pathSteps];
  }

  function phaseAt(distance) {
    let low = 0;
    let high = pathSteps;
    while (high - low > 1) {
      const middle = (low + high) >>> 1;
      if (distances[middle] <= distance) low = middle;
      else high = middle;
    }
    const fraction = (distance - distances[low]) / (distances[high] - distances[low]);
    return -Math.PI / 2 + (low + fraction) / pathSteps * turn;
  }

  const observer = new ResizeObserver(layout);
  observer.observe(hero);
  observer.observe(statement);
  window.addEventListener('resize', layout);
  document.addEventListener('visibilitychange', () => { previousTime = undefined; });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previousTime = undefined;
  });
  visibilityObserver.observe(hero);
  layout();
  function render(time) {
    const elapsed = previousTime === undefined ? 0 : (time - previousTime) / 1000;
    previousTime = time;
    // Positive angles move clockwise in screen coordinates (positive y points down).
    if (!reducedMotion.matches && !document.hidden && visible) {
      progress = (progress + elapsed / cycleSeconds) % 1;
    }
    cards.forEach((card, index) => {
      const distance = ((progress + index / cards.length) % 1) * pathLength;
      const phase = phaseAt(distance);
      const vertical = Math.sin(phase);
      const depth = (vertical + 1) / 2;
      card.style.setProperty('--card-x', `${width / 2 + radiusX * Math.cos(phase)}px`);
      card.style.setProperty('--card-y', `${centerY + radiusY * vertical}px`);
      // Keep the distant upper cards small; emphasize the lower foreground arc.
      card.style.setProperty('--card-scale', (.55 + .8 * depth + .4 * Math.max(0, vertical)).toFixed(4));
      card.style.setProperty('--card-opacity', (.25 + .75 * depth).toFixed(4));
    });
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
