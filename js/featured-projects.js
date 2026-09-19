(() => {
  const section = document.querySelector('.project-showcase');
  if (!section) return;

  const track = section.querySelector('.project-track');
  const cards = [...track.querySelectorAll('.project-story')];
  if (cards.length < 2) return;

  const prev = section.querySelector('.projects-prev');
  const next = section.querySelector('.projects-next');
  const toggle = section.querySelector('.projects-toggle');
  const position = section.querySelector('.projects-position');
  const hint = section.querySelector('#projects-hint');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const speed = 44;
  let cycle = 0, step = 0, offset = 0, renderedOffset = 0;
  let frame = 0, lastTime = 0, resumeTimer, holdUntil = 0, tween;
  let visible = false, hovered = false, focused = false, paused = false;
  let touching = false, drag, suppressClick = false;

  const modulo = (value, length) => ((value % length) + length) % length;

  function cloneGroup() {
    return cards.map(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.loopClone = '';
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      clone.querySelectorAll('a').forEach(link => {
        link.tabIndex = -1;
        link.removeAttribute('aria-labelledby');
      });
      return clone;
    });
  }

  // Neighboring duplicate groups let the list wrap at the same visual position.
  track.prepend(...cloneGroup());
  track.append(...cloneGroup());
  track.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  track.classList.add('is-looping');

  function writeOffset(value) {
    if (!cycle) return;
    offset = cycle + modulo(value - cycle, cycle);
    track.scrollLeft = offset;
    renderedOffset = track.scrollLeft;
    const active = modulo(Math.round((offset - cycle) / step), cards.length);
    const label = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    if (position.textContent !== label) position.textContent = label;
  }

  function canPlay() {
    return visible && !document.hidden && !reducedMotion.matches && !paused &&
      !hovered && !focused && !drag && !touching && performance.now() >= holdUntil;
  }

  function wake() {
    if (!frame && visible && !document.hidden && (tween || canPlay())) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function hold(duration = 1200) {
    holdUntil = performance.now() + duration;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(wake, duration + 20);
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) { tween = undefined; return; }
    const elapsed = lastTime ? Math.min(now - lastTime, 64) : 0;
    lastTime = now;
    if (tween) {
      const progress = Math.min(1, (now - tween.start) / 380);
      writeOffset(tween.from + (tween.to - tween.from) * (1 - Math.pow(1 - progress, 3)));
      if (progress === 1) { tween = undefined; hold(); }
    } else if (canPlay()) {
      writeOffset(offset + speed * elapsed / 1000);
    }
    if (tween || canPlay()) frame = requestAnimationFrame(tick);
  }

  function layout() {
    const phase = cycle ? (offset - cycle) / cycle : 0;
    const first = cards[0].getBoundingClientRect();
    step = cards[1].getBoundingClientRect().left - first.left;
    cycle = step * cards.length;
    tween = undefined;
    if (cycle > 0) writeOffset(cycle * (1 + phase));
    wake();
  }

  function moveTo(index, instant = false) {
    hold();
    const target = cycle + modulo(index, cards.length) * step;
    if (reducedMotion.matches || instant) {
      tween = undefined;
      writeOffset(target);
    } else {
      tween = {from: offset, to: target, start: performance.now()};
      wake();
    }
  }

  function moveBy(direction) {
    hold();
    const target = offset + direction * step;
    if (reducedMotion.matches) {
      tween = undefined;
      writeOffset(target);
    } else {
      tween = {from: offset, to: target, start: performance.now()};
      wake();
    }
  }

  prev.addEventListener('click', () => moveBy(-1));
  next.addEventListener('click', () => moveBy(1));
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? '开始自动轮播' : '暂停自动轮播');
    position.setAttribute('aria-live', paused ? 'polite' : 'off');
    wake();
  });

  track.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') hovered = true;
  });
  track.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') hovered = false;
    if (drag && !drag.moved) drag = undefined;
    wake();
  });
  track.addEventListener('focusin', event => {
    focused = true;
    const index = cards.findIndex(card => card.contains(event.target));
    if (index >= 0) moveTo(index, true);
  });
  track.addEventListener('focusout', () => {
    queueMicrotask(() => { focused = track.contains(document.activeElement); wake(); });
  });
  track.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const focusedCard = cards.findIndex(card => card.contains(document.activeElement));
    const current = focusedCard < 0 ? Math.round((offset - cycle) / step) : focusedCard;
    const target = {ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1}[event.key];
    if (target === undefined) return;
    event.preventDefault();
    if (focusedCard >= 0) cards[modulo(target, cards.length)].querySelector('a').focus({preventScroll: true});
    else moveTo(target);
  });

  track.addEventListener('scroll', () => {
    if (Math.abs(track.scrollLeft - renderedOffset) < .5) return;
    tween = undefined;
    writeOffset(track.scrollLeft);
    hold();
  }, {passive: true});
  track.addEventListener('wheel', () => { tween = undefined; hold(); }, {passive: true});
  track.addEventListener('pointerdown', event => {
    tween = undefined;
    hold();
    if (event.pointerType !== 'mouse') { touching = true; return; }
    if (event.button !== 0) return;
    drag = {id: event.pointerId, x: event.clientX, scroll: offset, moved: false};
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    writeOffset(drag.scroll - delta);
  });
  function endDrag() {
    touching = false;
    hold();
    if (!drag) return;
    const {id, moved} = drag;
    drag = undefined;
    if (track.hasPointerCapture(id)) track.releasePointerCapture(id);
    track.classList.remove('is-dragging');
    if (moved) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('lostpointercapture', endDrag);
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  function motionPreference() {
    toggle.hidden = reducedMotion.matches;
    position.setAttribute('aria-live', reducedMotion.matches || paused ? 'polite' : 'off');
    hint.textContent = reducedMotion.matches ? '左右滑动，探索项目背后的设计。' :
      '自动向左轮播 · 悬停暂停，也可左右滑动浏览';
    if (reducedMotion.matches) tween = undefined;
    wake();
  }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }).observe(track);
  new ResizeObserver(layout).observe(track);
  document.addEventListener('visibilitychange', wake);
  reducedMotion.addEventListener('change', motionPreference);
  section.querySelector('.projects-controls').hidden = false;
  layout();
  motionPreference();
})();
