/* ─────────────────────────────────────────────
   OFF THE CLOCK: BOOKS
   Book covers from BOOKS (data/books.js), with a one-line take scribbled under each.
   The clipping is the first one on the shelf.
────────────────────────────────────────────── */

OFF_CLOCK_SECTIONS.push({
  id: 'reading',
  label: 'Books',
  build() {
    const STATUS_TEXT = { reading: 'Reading now', next: 'Up next' };
    const SHELF_ORDER = ['reading', 'next', 'read'];
    const rank = (book) =>
      SHELF_ORDER.includes(book.status) ? SHELF_ORDER.indexOf(book.status) : SHELF_ORDER.length;

    function _book(book) {
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
      return item;
    }

    const books = [...BOOKS].sort((a, b) => rank(a) - rank(b));
    const shelf = popupEl('ul', '', 'book-shelf');
    books.forEach((book) => shelf.appendChild(_book(book)));
    const first = popupEl('ul', '', 'otc-spot-items');
    first.appendChild(_book(books[0]));

    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.appendChild(shelf);
    const LEAD = {
      reading: 'reading now',
      next: 'next on my list',
      read: 'just finished',
    };
    return {
      preview: first,
      view: scroll,
      note: [LEAD[books[0].status] || 'on my shelf', books[0].title],
      count: BOOKS.length,
      shown: 1,
      noun: 'books',
    };
  },
});
