/* ─────────────────────────────────────────────
   BOOKS
   The book covers in the "Off the clock" popup's Books tab
   (built by js/popups/off-the-clock/reading.js). Shown as Reading now, then Up next, then Read;
   within each group, in the order here.

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
    title: 'The Life-Changing Manga of Tidying Up',
    author: 'Marie Kondo & Yûko Uramoto',
    status: 'read',
    image: 'img/books/life-changing-manga-of-tidying-up-marie-kondo.jpg',
    alt: 'Cover of The Life-Changing Manga of Tidying Up by Marie Kondo & Yûko Uramoto',
    take: '',
  },
  {
    title: 'The Alpine Retreat',
    author: 'Sarah Goodwin',
    status: 'read',
    image: 'img/books/the-alpine-retreat-sarah-goodwin.jpg',
    alt: 'Cover of The Alpine Retreat by Sarah Goodwin',
    take: '',
  },
  {
    title: 'Origin',
    author: 'Dan Brown',
    status: 'read',
    image: 'img/books/origin-dan-brown.jpg',
    alt: 'Cover of Origin by Dan Brown',
    take: '',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'read',
    image: 'img/books/atomic-habits-james-clear.jpg',
    alt: 'Cover of Atomic Habits by James Clear',
    take: '',
  },
  {
    title: 'Designing Products People Love',
    author: 'Scott Hurff',
    status: 'next',
    image: 'img/books/designing-products-people-love-scott-hurff.jpg',
    alt: 'Cover of Designing Products People Love by Scott Hurff',
    take: '',
  },
  {
    title: 'The Art of Spending Money',
    author: 'Morgan Housel',
    status: 'next',
    image: 'img/books/the-art-of-spending-money-morgan-housel.jpg',
    alt: 'Cover of The Art of Spending Money by Morgan Housel',
    take: '',
  },
];
