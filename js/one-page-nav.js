(() => {
  const nav = document.querySelector('.navbar');
  const menuButton = document.querySelector('.nav-hamburger');
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!nav || !sections.length) return;

  function closeMenu() {
    const menu = document.querySelector('.nav-links');
    menu?.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }

  links.forEach(link => link.addEventListener('click', closeMenu));
  menuButton?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      menuButton.setAttribute('aria-expanded', String(menuButton.classList.contains('open')));
    });
  });

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .15, .5] });
  sections.forEach(section => observer.observe(section));
})();
