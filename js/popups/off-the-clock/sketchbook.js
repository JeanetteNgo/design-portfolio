/* ─────────────────────────────────────────────
   OFF THE CLOCK: SKETCHBOOK
   Loose doodles on a notebook page, from DOODLES (data/doodles.js). Click one to open it
   larger with its caption; ← or the back tag returns.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'sketchbook',
  label: 'Sketchbook',
  build(shell) {
    const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
          // On the page: just the cover frame, so a dozen clips don't all load and play at once
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

    function _open(doodle, tile) {
      const sheet = popupEl('div', '', 'doodle-sheet');
      sheet.appendChild(_media(doodle, true));
      const note = popupEl('div', '', 'otc-note');
      note.appendChild(popupEl('h3', doodle.title, 'gallery-story-title'));
      if (doodle.caption) note.appendChild(popupEl('p', doodle.caption, 'doodle-caption'));
      shell.open([sheet, note], 'back to the sketchbook', tile);
    }

    const grid = popupEl('ul', '', 'doodle-grid');
    DOODLES.forEach((doodle) => {
      const item = popupEl('li');
      const tile = popupEl('button', '', 'doodle');
      tile.type = 'button';
      tile.setAttribute(
        'aria-label',
        doodle.type === 'animated' ? `${doodle.title} (animated)` : doodle.title
      );
      tile.appendChild(_media(doodle, false));
      if (doodle.type === 'animated') tile.appendChild(popupEl('span', '▶', 'doodle-play'));
      tile.addEventListener('click', () => _open(doodle, tile));
      item.appendChild(tile);
      grid.appendChild(item);
    });

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(grid);
    return scroll;
  },
});
