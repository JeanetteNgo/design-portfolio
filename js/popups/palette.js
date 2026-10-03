/* ─────────────────────────────────────────────
   PALETTE POPUP
   An open colour-chip book. The right page holds a chip per theme
   (POPUPS.palette.themes); clicking one previews it on the left page (a mini
   home page, its shades and an Apply button) without touching the site.
   Apply calls setTheme (js/theme.js), and the theme in use is circled in red.
   Each chip and the preview read a family's own colours from Layer 1 of
   css/tokens.css, so they show true whichever theme is on.
   Styles: css/features/popups/palette.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.palette = function (popup) {
  const themes = popup.themes;
  const SHADES = ['25', '50', '200', '300', '400', '500'];
  let previewing = currentTheme();

  // Point a set of short vars (--c25 … --c500) at one family's Layer 1 colours
  function _paint(el, id) {
    SHADES.concat('100').forEach((s) => el.style.setProperty(`--c${s}`, `var(--${id}-${s})`));
  }

  // A hand-drawn loop, drawn round the chip in use
  function _circle() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'pal-circle');
    svg.setAttribute('viewBox', '0 0 100 140');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute(
      'd',
      'M54 4 C 88 2, 98 30, 97 72 C 96 118, 82 137, 48 136 C 12 135, 3 110, 4 66 C 5 26, 18 6, 60 8'
    );
    path.setAttribute('pathLength', '100');
    svg.appendChild(path);
    return svg;
  }

  /* ── Left page: title, preview, shades, Apply ── */

  const left = popupEl('div', '', 'pal-page pal-left');
  const title = popupEl('p', popup.title, 'pal-title');
  title.setAttribute('aria-hidden', 'true'); // the dialog's hidden title names it
  const intro = popupEl('p', popup.intro, 'popup-intro pal-intro');

  // A mini sketch of the home page: nav, greeting, and the dock strip
  const preview = popupEl('div', '', 'pal-preview');
  preview.setAttribute('aria-hidden', 'true');
  const nav = popupEl('span', '', 'pal-mini-nav');
  nav.append(popupEl('b'), popupEl('i'), popupEl('i'), popupEl('i'));
  const dock = popupEl('span', '', 'pal-mini-dock');
  for (let i = 0; i < 5; i++) dock.appendChild(popupEl('i'));
  preview.append(
    nav,
    popupEl('span', 'Hi! I am Jeanette.', 'pal-mini-hi'),
    popupEl('span', 'I dabble in design', 'pal-mini-sub'),
    dock
  );

  const details = popupEl('div', '', 'pal-details');
  const name = popupEl('p', '', 'pal-name');
  const ramp = popupEl('div', '', 'pal-ramp');
  ramp.setAttribute('aria-hidden', 'true');
  SHADES.forEach((s) => ramp.appendChild(popupEl('span', s)));
  details.append(name, ramp);

  const apply = popupEl('button', '', 'pal-apply');
  apply.type = 'button';
  const status = popupEl('p', '', 'pal-status');
  status.setAttribute('aria-live', 'polite');

  const footer = popupEl('div', '', 'popup-footer pal-footer');
  footer.appendChild(popupCloseTag());

  /* ── Right page: the chips ── */

  const right = popupEl('div', '', 'pal-page pal-right');
  const chips = popupEl('ul', '', 'pal-chips');
  const buttons = themes.map((theme) => {
    const li = popupEl('li');
    const chip = popupEl('button', '', 'pal-chip');
    chip.type = 'button';
    chip.dataset.theme = theme.id;
    _paint(chip, theme.id);
    const swatch = popupEl('span', '', 'pal-swatch');
    const tints = popupEl('span', '', 'pal-tints');
    tints.append(popupEl('i'), popupEl('i'), popupEl('i'));
    swatch.appendChild(tints);
    const caption = popupEl('span', '', 'pal-caption');
    caption.append(
      popupEl('span', 'Jeanette', 'pal-brand'),
      popupEl('span', theme.code, 'pal-code'),
      popupEl('span', theme.name, 'pal-chip-name')
    );
    chip.append(swatch, caption, _circle());
    chip.addEventListener('click', () => {
      previewing = theme.id;
      _update();
    });
    li.appendChild(chip);
    chips.appendChild(li);
    return chip;
  });
  const slot = popupEl('li', 'more soon…', 'pal-slot');
  slot.setAttribute('aria-hidden', 'true');
  chips.appendChild(slot);

  /* ── State ── */

  function _update() {
    const inUse = currentTheme();
    const theme = themes.find((t) => t.id === previewing);
    _paint(left, theme.id);
    name.replaceChildren(popupEl('strong', theme.name), popupEl('span', `Jeanette ${theme.code}`));

    const isCurrent = previewing === inUse;
    apply.textContent = isCurrent ? 'in use ✓' : `Apply ${theme.name}`;
    apply.classList.toggle('is-current', isCurrent);
    apply.setAttribute('aria-disabled', String(isCurrent));

    buttons.forEach((chip) => {
      const t = themes.find((x) => x.id === chip.dataset.theme);
      chip.setAttribute('aria-pressed', String(t.id === previewing));
      chip.classList.toggle('is-in-use', t.id === inUse);
      chip.setAttribute('aria-label', t.id === inUse ? `${t.name}, in use` : t.name);
    });
  }

  apply.addEventListener('click', () => {
    if (previewing === currentTheme()) return;
    const id = previewing;
    const swap = () => {
      setTheme(id);
      _update();
    };
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The cross-fade can be skipped (e.g. tab hidden); the swap still runs
    if (document.startViewTransition && !calm)
      document.startViewTransition(swap).ready.catch(() => {});
    else swap();
    status.textContent = `${themes.find((t) => t.id === id).name} applied`;
  });

  _update();

  left.append(title, intro, preview, details, apply, status, footer);
  right.appendChild(chips);
  const book = popupEl('div', '', 'pal-book');
  book.append(left, right);
  return [book];
};
