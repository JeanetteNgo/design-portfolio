/* ─────────────────────────────────────────────
   OFF THE CLOCK: PLAYLIST
   Record sleeves from MUSIC (data/music.js), with a note scribbled under each. A record with a
   preview clip gets a play button; one plays at a time and it stops when the popup closes
   or the tab changes.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'listening',
  label: 'Playlist',
  build() {
    const audio = new Audio();
    audio.preload = 'none'; // nothing downloads until someone presses play
    let playing = null; // { button, item } for the record that is playing

    function _stop() {
      audio.pause();
      if (!playing) return;
      playing.button.setAttribute('aria-pressed', 'false');
      playing.button.setAttribute('aria-label', `Play ${playing.title}`);
      playing.item.classList.remove('is-playing');
      playing = null;
    }
    audio.addEventListener('ended', _stop);
    audio.addEventListener('error', _stop);

    function _toggle(record, button, item) {
      const wasThis = playing?.button === button;
      _stop();
      if (wasThis) return;
      audio.src = record.preview;
      audio.play().catch(_stop);
      playing = { button, item, title: record.title };
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', `Pause ${record.title}`);
      item.classList.add('is-playing', 'has-played');
    }

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
        sleeve.setAttribute('aria-hidden', 'true');
      }
      art.prepend(popupEl('span', '', 'record-disc'));
      art.appendChild(sleeve);
      if (record.preview) {
        const play = popupEl('button', '', 'record-play');
        play.type = 'button';
        play.setAttribute('aria-label', `Play ${record.title}`);
        play.setAttribute('aria-pressed', 'false');
        play.addEventListener('click', () => _toggle(record, play, item));
        play.appendChild(popupEl('span', '', 'record-play-icon'));
        art.appendChild(play);
      }
      item.append(
        art,
        popupEl('span', record.title, 'record-title'),
        popupEl('span', record.artist, 'record-artist')
      );
      if (record.note) item.appendChild(popupEl('span', record.note, 'record-note'));
      shelf.appendChild(item);
    });

    // Stop when the popup closes or another tab is chosen
    popupOnClose(_stop);
    document
      .getElementById('popup')
      .addEventListener('click', (e) => e.target.closest('.otc-tab') && _stop());

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(shelf);
    return scroll;
  },
});
