/* ─────────────────────────────────────────────
   OFF THE CLOCK: HOBBIES
   A corkboard of polaroids and postcards from GALLERY (data/gallery.js). Click one to open
   it with its story; ← or the back tag returns.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'hobbies',
  label: 'Hobbies',
  build(shell) {
    // A polaroid or postcard print. `big` is the opened view (a block, not a button).
    function _print(photo, big) {
      const print = popupEl(big ? 'div' : 'button', '', `print print--${photo.kind}`);
      if (!big) {
        print.type = 'button';
        print.setAttribute('aria-label', photo.title);
      }
      let picture;
      if (photo.image) {
        picture = popupEl('img', '', 'print-photo');
        picture.src = photo.image;
        picture.alt = photo.alt || '';
        picture.loading = 'lazy'; // only downloaded when it scrolls near view
        picture.decoding = 'async';
        popupReserveShape(picture, photo, 'load');
      } else {
        picture = popupEl('span', 'coming soon', 'print-photo print-blank');
        picture.setAttribute('aria-hidden', 'true');
        popupReserveShape(picture, photo);
      }
      print.appendChild(picture);
      if (photo.caption) print.appendChild(popupEl('span', photo.caption, 'print-caption'));
      return print;
    }

    function _open(photo, button) {
      const story = popupEl('div', '', 'otc-note gallery-story');
      if (photo.date) story.appendChild(popupEl('p', photo.date, 'gallery-date'));
      story.appendChild(popupEl('h3', photo.title, 'gallery-story-title'));
      if (photo.story) story.appendChild(popupEl('p', photo.story, 'gallery-story-text'));
      shell.open([_print(photo, true), story], 'back to the board', button);
    }

    const board = popupEl('ul', '', 'gallery-board');
    GALLERY.forEach((photo) => {
      const item = popupEl('li');
      const button = _print(photo, false);
      button.addEventListener('click', () => _open(photo, button));
      item.append(popupEl('span', '', 'gallery-pin'), button);
      board.appendChild(item);
    });

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(board);
    return scroll;
  },
});
