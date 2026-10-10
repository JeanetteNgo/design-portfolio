/* ─────────────────────────────────────────────
   SITE SHELL
   Builds the nav bar and footer from SITE in data/site.js.

   Each page needs:
     <body data-page="projects">          → which nav tab is active
     <nav id="site-nav"></nav>            → nav is rendered here
     <script src=".../data/site.js"></script>
     <script src=".../js/site-shell.js"></script>
     <footer id="site-footer"></footer>   → footer is rendered here

   Case study pages also add:
     <body data-case-study="Page name">   → breadcrumb above the cover + reading progress in the nav
     <div id="back-to-top"></div>         → floating "Back to top" rocket

   Add data-logo="top" to <body> to make the logo scroll back to the
   top of the page instead of linking to Home.
────────────────────────────────────────────── */

(function () {
  // Site root, from this script's own address, so links resolve from any folder depth
  const ROOT = new URL('../', document.currentScript.src);

  /* ── Helpers ───────────────────────────────── */

  const _isExternal = (href) => /^https?:\/\//.test(href);

  /** Resolve a root-relative page link; leave full URLs as they are. */
  const _url = (href) => (_isExternal(href) ? href : new URL(href, ROOT).href);

  /** Extra attributes so external links open in a new tab. */
  const _target = (href) => (_isExternal(href) ? ' target="_blank" rel="noopener"' : '');

  /* ── Nav ───────────────────────────────────── */

  function _renderNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const { page, logo, caseStudy } = document.body.dataset;
    const logoLink =
      logo === 'top'
        ? '<a href="#" class="logo" aria-label="Back to top">'
        : `<a href="${_url('index.html')}" class="logo" aria-label="Home">`;

    const links = SITE.nav
      .map((item) => {
        const active = item.id === page ? ' class="active"' : '';
        return `<li><a${active} href="${_url(item.href)}"${_target(item.href)}>${item.label}</a></li>`;
      })
      .join('');

    nav.innerHTML = `
      <div class="nav-container">
        ${logoLink}<img src="${_url('img/logo.svg')}" alt="Logo" /></a>
        <ul class="nav-links">${links}</ul>
      </div>
      ${caseStudy ? '<span class="nav-progress" aria-hidden="true"></span>' : ''}`;

    if (logo === 'top') {
      nav.querySelector('.logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Nav blends into the page at the top; show its background and line once scrolled
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // The spacer grows by however much the nav shrinks, so the page underneath doesn't jump
    nav.insertAdjacentHTML('afterend', '<div class="nav-spacer" aria-hidden="true"></div>');

    if (caseStudy) _trackProgress(nav.querySelector('.nav-progress'));
  }

  /* ── Case study breadcrumb ─────────────────── */

  /** Breadcrumb list. Starts from Home if that's where the reader came from. */
  function _crumbs(title) {
    const { home, projects } = SITE.caseStudy.crumbs;
    let from = projects;
    try {
      const ref = new URL(document.referrer);
      const homePath = new URL(home.href, ROOT).pathname;
      if (ref.origin === location.origin && [ROOT.pathname, homePath].includes(ref.pathname)) from = home;
    } catch {}

    return `
      <ol class="crumb-list" aria-label="Breadcrumb">
        <li><a href="${_url(from.href)}">${from.label}</a></li>
        <li class="crumb-sep" aria-hidden="true">&gt;</li>
        <li><span aria-current="page">${title}</span></li>
      </ol>`;
  }

  /** Fills the nav's progress line as the reader scrolls through the page. */
  function _trackProgress(bar) {
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const queue = () => {
      if (!queued) requestAnimationFrame(update);
      queued = true;
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', queue);
    update();
  }

  /* ── Footer ────────────────────────────────── */

  function _renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const { heading, text, links, copyright } = SITE.footer;
    const buttons = links
      .map((l) => `<a class="cta-button" href="${_url(l.href)}"${_target(l.href)}>${l.label}</a>`)
      .join('');

    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-text">
            <h2>${heading}</h2>
            <p>${text}</p>
          </div>
          <div class="footer-cta">${buttons}</div>
        </div>
        <p class="copyright">${copyright}</p>
      </div>`;
  }

  /* ── Case study breadcrumb + rocket ────────── */

  function _renderCaseStudy() {
    const { toTop } = SITE.caseStudy;

    // Breadcrumb sits at the top of the case study header, above the cover
    const { caseStudy } = document.body.dataset;
    const header = document.querySelector('.project-header');
    if (caseStudy && header) header.insertAdjacentHTML('afterbegin', _crumbs(caseStudy));

    const topSlot = document.getElementById('back-to-top');
    if (!topSlot) return;
    topSlot.innerHTML = `
      <button class="back-to-top" type="button" aria-label="${toTop.label}">
        <span class="back-to-top-tip" aria-hidden="true">${toTop.label}</span>
        <span class="back-to-top-puffs" aria-hidden="true">${'<span></span>'.repeat(7)}</span>
        <span class="back-to-top-rocket" aria-hidden="true">${ROCKET_SVG}</span>
      </button>`;

    const button = topSlot.firstElementChild;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let launching = false;

    // Shows once the reader is most of a screen down the page
    const onScroll = () => {
      if (!launching) button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // The rocket shakes and straightens, clouds puff, it blasts off, and the page shoots up after it.
    // Once at the top the button fades out, then resets for next time
    button.addEventListener('click', () => {
      if (reduceMotion.matches) return window.scrollTo({ top: 0, behavior: 'instant' });
      if (launching) return;
      launching = true;
      button.classList.add('is-launching');
      setTimeout(() => {
        _shootToTop(() => {
          launching = false;
          button.classList.remove('is-visible');
          setTimeout(() => button.classList.remove('is-launching'), 450);
        });
      }, 330);
    });
  }

  /** Scroll to the top fast: slow start, quick middle, soft landing. */
  function _shootToTop(done) {
    const start = window.scrollY;
    const duration = Math.min(1000, 450 + start / 12);
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo({ top: start * (1 - ease(t)), behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  }

  // Drawn like the dock icons in img/dock/: brown outline, fixed sticker colours
  const ROCKET_SVG = `
    <svg viewBox="0 0 64 64" fill="none" stroke="#4a2e25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <defs><clipPath id="rocket-body"><path d="M32 5c9 7 11 22 8 41H24c-3-19-1-34 8-41Z" /></clipPath></defs>
      <g class="rocket-flame">
        <path d="M25 46c0 8 4 12 7 15 3-3 7-7 7-15Z" fill="#ffd36e" />
        <path d="M29 46c0 5 1.5 7.5 3 9 1.5-1.5 3-4 3-9Z" fill="#ff8b84" stroke-width="2" />
      </g>
      <path d="M24.5 32 15 41v8l9.5-5M39.5 32 49 41v8l-9.5-5" fill="#ff8b84" />
      <path d="M32 5c9 7 11 22 8 41H24c-3-19-1-34 8-41Z" fill="#ffffff" />
      <path d="M20 4h24v14H20Z" fill="#ff8b84" stroke="none" clip-path="url(#rocket-body)" />
      <path d="M24.8 18h14.4" />
      <path d="M32 5c9 7 11 22 8 41H24c-3-19-1-34 8-41Z" />
      <circle cx="32" cy="29" r="5.5" fill="#8ec5e8" />
      <circle cx="30.2" cy="27.2" r="1.4" fill="#ffffff" stroke="none" />
      <path d="M32 39v7" stroke-width="2.5" />
    </svg>`;

  // The nav is already in the page; the rest is further down, so wait for it
  _renderNav();
  document.addEventListener('DOMContentLoaded', () => {
    _renderCaseStudy();
    _renderFooter();
  });

  /* ── Focus rings ───────────────────────────── */

  // Focus rings show only while Tab is in use (css/base.css reads [data-input='mouse'] on <html>)
  const html = document.documentElement;
  document.addEventListener('pointerdown', () => (html.dataset.input = 'mouse'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') delete html.dataset.input;
  });
})();
