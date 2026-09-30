/* ─────────────────────────────────────────────
   DOODLES POPUP
   A gallery wall of framed doodles from DOODLES (data/doodles.js) with All / Drawings /
   Animated filters. Click one to open it larger; ← or the back tag returns.
   Styles: css/features/popups/doodles.css.
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

  // The picture, video or placeholder for a doodle. `big` is the opened view.
  function _media(doodle, big) {
    if (doodle.video) {
      const video = popupEl('video', '', 'doodle-media');
      video.muted = true; // browsers only autoplay silent video
      video.loop = true;
      video.playsInline = true;
      video.poster = doodle.image || '';
      if (doodle.alt) video.setAttribute('aria-label', doodle.alt);
      popupReserveShape(video, doodle, 'loadedmetadata');
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
      popupReserveShape(img, doodle, 'load');
      return img;
    }
    const blank = popupEl('div', 'coming soon', 'doodle-blank');
    blank.setAttribute('aria-hidden', 'true');
    popupReserveShape(blank, doodle); // keeps its shape like a real doodle
    return blank;
  }

  // The wall label under a piece: title, what kind it is, and (when opened) the caption
  function _label(doodle, withCaption) {
    const label = popupEl('span', '', 'doodle-label');
    label.append(
      popupEl('span', doodle.title, 'doodle-title'),
      popupEl('span', doodle.type === 'animated' ? 'Animated' : 'Drawing', 'doodle-type')
    );
    if (withCaption && doodle.caption)
      label.appendChild(popupEl('span', doodle.caption, 'doodle-caption'));
    return label;
  }

  /* ── Opened view ── */

  const detailView = popupEl('div', '', 'popup-view doodle-detail');
  detailView.hidden = true;
  const gridView = popupEl('div', '', 'popup-view');

  function _open(doodle, tile) {
    const scroll = popupEl('div', '', 'popup-scroll');
    const frame = popupEl('div', '', 'doodle-frame');
    frame.appendChild(_media(doodle, true));
    scroll.append(frame, _label(doodle, true));

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
    if (doodle.type === 'animated') frame.appendChild(popupEl('span', '▶', 'doodle-play'));
    tile.append(frame, _label(doodle, false));
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
      filters
        .querySelectorAll('.doodle-filter')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
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

  /* ── Exhibition heading ── */

  // The title is decoration; the dialog's hidden title names it for screen readers
  const head = popupEl('header', '', 'doodles-head');
  const headTitle = popupEl('span', popup.title, 'doodles-head-title');
  headTitle.setAttribute('aria-hidden', 'true');
  head.appendChild(headTitle);
  if (popup.intro) head.appendChild(popupEl('p', popup.intro, 'doodles-head-intro'));

  popupOnLeftKey(() => !detailView.hidden, _close);
  popupOnClose(() => detailView.querySelector('video')?.pause());

  return [head, gridView, detailView];
};
