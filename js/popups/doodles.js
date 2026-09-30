/* ─────────────────────────────────────────────
   DOODLES POPUP
   An app-style window: a title bar, All / Drawings / Animated filters, and a masonry grid (every
   doodle keeps its own shape) of doodles from DOODLES in data/doodles.js. Clicking a doodle opens it larger, with its
   caption; ← (or the back tag) returns to the grid. Looks live in
   css/features/popups/doodles.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.doodles = function (popup) {
  const FILTERS = [
    ['all', 'All'],
    ['drawing', 'Drawings'],
    ['animated', 'Animated'],
  ];
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lastTile = null; // so focus can return to the doodle after it closes

  /* ── Pictures ── */

  // The shape to reserve for a doodle before its picture has loaded (width / height from the
  // data, or 4 / 3 if not given). Once the real picture arrives its own shape takes over.
  function _reserve(el, doodle, loadedEvent) {
    el.style.aspectRatio = doodle.width && doodle.height ? `${doodle.width} / ${doodle.height}` : '4 / 3';
    if (loadedEvent) el.addEventListener(loadedEvent, () => (el.style.aspectRatio = ''), { once: true });
  }

  // The picture, video or placeholder for a doodle. `big` is the opened view.
  function _media(doodle, big) {
    if (doodle.video) {
      const video = popupEl('video', '', 'doodle-media');
      video.muted = true; // browsers only autoplay silent video
      video.loop = true;
      video.playsInline = true;
      video.poster = doodle.image || '';
      if (doodle.alt) video.setAttribute('aria-label', doodle.alt);
      _reserve(video, doodle, 'loadedmetadata');
      if (big) {
        // Opened: plays by itself (unless motion is reduced) and can be paused
        video.src = doodle.video;
        video.controls = true;
        video.autoplay = !calmMotion;
      } else {
        // In the grid: just the cover frame, so a dozen clips don't all load and play at once
        video.src = `${doodle.video}#t=0.1`;
        video.preload = 'metadata';
      }
      return video;
    }
    if (doodle.image) {
      const img = popupEl('img', '', 'doodle-media');
      img.src = doodle.image;
      img.alt = doodle.alt || '';
      img.loading = 'lazy'; // only downloaded when it scrolls near view
      img.decoding = 'async';
      _reserve(img, doodle, 'load');
      return img;
    }
    const blank = popupEl('div', 'coming soon', 'doodle-blank');
    blank.setAttribute('aria-hidden', 'true');
    _reserve(blank, doodle); // a placeholder keeps its shape, so the empty grid looks like the real one
    return blank;
  }

  /* ── Opened view ── */

  const detailView = popupEl('div', '', 'doodle-view doodle-detail');
  detailView.hidden = true;
  const gridView = popupEl('div', '', 'doodle-view');

  function _open(doodle, tile) {
    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.append(_media(doodle, true), popupEl('h3', doodle.title, 'doodle-title'));
    if (doodle.caption) scroll.appendChild(popupEl('p', doodle.caption, 'doodle-caption'));

    const back = popupBackTag('back to all doodles', _close);
    const footer = popupEl('div', '', 'doodle-footer');
    footer.appendChild(back);

    lastTile = tile;
    detailView.replaceChildren(scroll, footer);
    gridView.hidden = true;
    detailView.hidden = false;
    back.focus();
  }

  // Stops any playing clip, then shows the grid again
  function _close() {
    detailView.querySelector('video')?.pause();
    detailView.hidden = true;
    gridView.hidden = false;
    lastTile?.focus();
  }

  /* ── The grid ── */

  const grid = popupEl('ul', '', 'doodle-grid');
  const tiles = DOODLES.map((doodle) => {
    const item = popupEl('li');
    item.dataset.type = doodle.type;

    const tile = popupEl('button', '', 'doodle');
    tile.type = 'button';
    tile.setAttribute(
      'aria-label',
      doodle.type === 'animated' ? `${doodle.title} (animated)` : doodle.title
    );
    const frame = popupEl('span', '', 'doodle-frame');
    frame.appendChild(_media(doodle, false));
    if (doodle.type === 'animated') frame.appendChild(popupEl('span', 'animated', 'doodle-badge'));
    tile.appendChild(frame);
    if (doodle.caption) tile.appendChild(popupEl('span', doodle.caption, 'doodle-tile-caption'));
    tile.addEventListener('click', () => _open(doodle, tile));

    item.appendChild(tile);
    grid.appendChild(item);
    return item;
  });

  /* ── Filters ── */

  const filters = popupEl('div', '', 'doodle-filters');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Show');
  const status = popupEl('p', '', 'visually-hidden'); // tells screen readers how many are showing
  status.setAttribute('role', 'status');

  FILTERS.forEach(([type, label]) => {
    const button = popupEl('button', label, 'doodle-filter');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(type === 'all'));
    button.addEventListener('click', () => {
      filters.querySelectorAll('.doodle-filter').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      let shown = 0;
      tiles.forEach((item) => {
        item.hidden = type !== 'all' && item.dataset.type !== type;
        if (!item.hidden) shown++;
      });
      status.textContent = `Showing ${shown} ${shown === 1 ? 'doodle' : 'doodles'}`;
    });
    filters.appendChild(button);
  });

  const scroll = popupEl('div', '', 'popup-scroll');
  scroll.appendChild(grid);
  gridView.append(filters, status, scroll);

  /* ── Window title bar ── */

  // Decoration only: the dialog's own (hidden) title names it for screen readers
  const bar = popupEl('div', '', 'doodles-bar');
  bar.setAttribute('aria-hidden', 'true');
  const dots = popupEl('span', '', 'doodles-dots');
  dots.append(popupEl('span'), popupEl('span'), popupEl('span'));
  bar.append(dots, popupEl('span', popup.title, 'doodles-bar-title'));

  popupOnLeftKey(() => !detailView.hidden, _close);
  popupOnClose(() => detailView.querySelector('video')?.pause());

  return [bar, gridView, detailView];
};
