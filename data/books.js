/* ─────────────────────────────────────────────
   BOOKS
   The book covers in the "Off the clock" popup's Books tab
   (built by js/popups/off-the-clock/reading.js). The order here is the order shown.

   Each book has:
     title    the book's name
     author   who wrote it
     isbn     optional but makes the cover lookup exact, e.g. '9780141439518'
     status   'reading'  shows a "Reading now" tag
              'read'     no tag
              'next'     shows an "Up next" tag
     take     optional line scribbled under it, your one-line verdict
   Then run `node scripts/fetch-covers.mjs --yes`. It fills in:
     image    the cover, saved in img/books/ (you can also set your own, 2:3 shape)
     alt      describes the cover for screen readers
   A book with no image shows a plain cover with its title on the spine.
────────────────────────────────────────────── */

const BOOKS = [
  {
    title: '[Book title]',
    author: '[Author]',
    status: 'reading',
    image: '',
    alt: '',
    take: '[One-line take]',
  },
  {
    title: '[Book title]',
    author: '[Author]',
    status: 'read',
    image: '',
    alt: '',
    take: '[One-line take]',
  },
  {
    title: '[Book title]',
    author: '[Author]',
    status: 'read',
    image: '',
    alt: '',
    take: '[One-line take]',
  },
  {
    title: '[Book title]',
    author: '[Author]',
    status: 'read',
    image: '',
    alt: '',
    take: '[One-line take]',
  },
  { title: '[Book title]', author: '[Author]', status: 'next', image: '', alt: '', take: '' },
  { title: '[Book title]', author: '[Author]', status: 'next', image: '', alt: '', take: '' },
];
