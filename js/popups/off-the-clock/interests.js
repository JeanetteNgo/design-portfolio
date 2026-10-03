/* ─────────────────────────────────────────────
   OFF THE CLOCK: INTERESTS
   Polaroids and postcards from INTERESTS (data/interests.js), stuck on the page
   with a short caption each. The spot shows the first three in a small pile.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'interests',
  label: 'Likes',
  title: 'Likes',
  build() {
    function _print(item, withCaption) {
      const print = popupEl('figure', '', `print print--${item.kind}`);
      let picture;
      if (item.image) {
        picture = popupEl('img', '', 'print-photo');
        picture.src = item.image;
        picture.alt = item.alt || '';
        picture.loading = 'lazy';
        picture.decoding = 'async';
        popupReserveShape(picture, item, 'load');
      } else {
        picture = popupEl('span', 'coming soon', 'print-photo print-blank');
        picture.setAttribute('aria-hidden', 'true');
        popupReserveShape(picture, item);
      }
      print.appendChild(picture);
      if (withCaption && item.caption)
        print.appendChild(popupEl('figcaption', item.caption, 'print-caption'));
      return print;
    }

    const board = popupEl('ul', '', 'interests-board');
    INTERESTS.forEach((item) => {
      const entry = popupEl('li');
      entry.appendChild(_print(item, true));
      board.appendChild(entry);
    });

    const pile = popupEl('ul', '', 'otc-spot-items otc-pile');
    INTERESTS.slice(0, 3).forEach((item) => {
      const entry = popupEl('li');
      entry.appendChild(_print(item, false));
      pile.appendChild(entry);
    });

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(board);
    return { preview: pile, view: scroll, more: `${INTERESTS.length} likes` };
  },
});
