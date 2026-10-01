/* ─────────────────────────────────────────────
   OFF THE CLOCK: READING
   Book covers from BOOKS (data/books.js), with a one-line take scribbled under each.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'reading',
  label: 'Reading',
  build() {
    const STATUS_TEXT = { reading: 'Reading now', next: 'Up next' };

    const shelf = popupEl('ul', '', 'book-shelf');
    BOOKS.forEach((book) => {
      const item = popupEl('li', '', 'book');
      const cover = popupEl('span', '', 'book-cover');
      if (book.image) {
        const img = popupEl('img', '', 'book-image');
        img.src = book.image;
        img.alt = book.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        cover.appendChild(img);
      } else {
        cover.append(popupEl('span', book.title, 'book-spine-title'));
        cover.setAttribute('aria-hidden', 'true');
      }
      if (STATUS_TEXT[book.status])
        cover.appendChild(popupEl('span', STATUS_TEXT[book.status], 'book-status'));

      item.append(
        cover,
        popupEl('span', book.title, 'record-title'),
        popupEl('span', book.author, 'record-artist')
      );
      if (book.take) item.appendChild(popupEl('span', book.take, 'record-note'));
      shelf.appendChild(item);
    });

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(shelf);
    return scroll;
  },
});
