/* ─────────────────────────────────────────────
   OFF THE CLOCK: LISTENING
   Record sleeves from MUSIC (data/music.js), with a note scribbled under each.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'listening',
  label: 'Listening',
  build() {
    const shelf = popupEl('ul', '', 'record-shelf');
    MUSIC.forEach((record) => {
      const item = popupEl('li', '', 'record');
      const art = popupEl('span', '', 'record-art');
      const sleeve = popupEl('span', '', 'record-sleeve');
      if (record.image) {
        const cover = popupEl('img', '', 'record-cover');
        cover.src = record.image;
        cover.alt = record.alt || '';
        cover.loading = 'lazy';
        cover.decoding = 'async';
        sleeve.appendChild(cover);
      } else {
        sleeve.appendChild(popupEl('span', '', 'record-ring'));
        art.setAttribute('aria-hidden', 'true');
      }
      art.prepend(popupEl('span', '', 'record-disc'));
      art.appendChild(sleeve);
      item.append(
        art,
        popupEl('span', record.title, 'record-title'),
        popupEl('span', record.artist, 'record-artist')
      );
      if (record.note) item.appendChild(popupEl('span', record.note, 'record-note'));
      shelf.appendChild(item);
    });

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(shelf);
    return scroll;
  },
});
