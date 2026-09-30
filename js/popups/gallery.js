/* ─────────────────────────────────────────────
   GALLERY POPUP
   A corkboard with polaroids and postcards pinned on it, from GALLERY in data/gallery.js.
   Clicking a print opens it larger with the story behind it; ← (or the back tag) returns to
   the board. Looks live in css/features/popups/gallery.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.gallery = function (popup) {
  let lastPrint = null; // so focus can return to the print after it closes

  // A print: white polaroid or airmail postcard around the picture, with the caption on it.
  // `big` is the opened view (a plain block instead of a button).
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

  /* ── Opened view ── */

  const detailView = popupEl('div', '', 'popup-view gallery-detail');
  detailView.hidden = true;
  const boardView = popupEl('div', '', 'popup-view');

  function _open(photo, button) {
    const story = popupEl('div', '', 'gallery-story');
    if (photo.date) story.appendChild(popupEl('p', photo.date, 'gallery-date'));
    story.appendChild(popupEl('h3', photo.title, 'gallery-story-title'));
    if (photo.story) story.appendChild(popupEl('p', photo.story, 'gallery-story-text'));

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.append(_print(photo, true), story);

    const back = popupBackTag('back to the board', _close);
    const footer = popupEl('div', '', 'gallery-footer');
    footer.appendChild(back);

    lastPrint = button;
    detailView.replaceChildren(scroll, footer);
    boardView.hidden = true;
    detailView.hidden = false;
    back.focus();
  }

  function _close() {
    detailView.hidden = true;
    boardView.hidden = false;
    lastPrint?.focus();
  }

  /* ── The board ── */

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
  boardView.appendChild(scroll);

  // The title is a pinned paper label; the dialog's own hidden title names it for screen readers
  const head = popupEl('header', '', 'gallery-head');
  const label = popupEl('span', popup.title, 'paper-tag gallery-tag');
  label.setAttribute('aria-hidden', 'true');
  head.appendChild(label);
  if (popup.intro) head.appendChild(popupEl('p', popup.intro, 'gallery-intro'));

  popupOnLeftKey(() => !detailView.hidden, _close);

  return [head, boardView, detailView];
};
