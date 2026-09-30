/* ─────────────────────────────────────────────
   SITE SHELL
   Builds the nav bar and footer from SITE in data/site.js.

   Each page needs:
     <body data-page="projects">          → which nav tab is active
     <nav id="site-nav"></nav>            → nav is rendered here
     <script src=".../data/site.js"></script>
     <script src=".../js/site-shell.js"></script>
     <footer id="site-footer"></footer>   → footer is rendered here

   Add data-logo="top" to <body> to make the logo scroll back to the
   top of the page instead of linking to Home.
────────────────────────────────────────────── */

(function () {
  // Site root, worked out from this script's own address (…/js/site-shell.js),
  // so page links resolve correctly from any folder depth.
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

    const { page, logo } = document.body.dataset;
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
      </div>`;

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

  // Nav renders straight away (this script sits right after it), so it's there
  // before the first paint. The footer is further down, so wait for it to exist.
  _renderNav();
  document.addEventListener('DOMContentLoaded', _renderFooter);
})();
