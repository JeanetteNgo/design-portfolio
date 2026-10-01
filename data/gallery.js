/* ─────────────────────────────────────────────
   GALLERY
   The photos stuck on the page in the "Off the clock" popup's Hobbies tab
   (built by js/popups/off-the-clock/hobbies.js). Add one by adding a block to the list.
   The order here is the order on the board.

   Each photo has:
     title     its name (shown on the opened photo and read out by screen readers)
     kind      'polaroid'  a snapshot with a handwritten caption on the white strip
               'postcard'  a landscape card with a striped airmail edge
     image     the picture, e.g. 'img/gallery/lisbon.webp' (WebP, around 1000px wide is plenty)
     width      optional. With height, the picture's size in pixels (any two numbers with the
     height     right shape do, e.g. 1200 and 800). Saves the right amount of room before the
                picture has loaded, so nothing jumps around.
     alt       describes the picture for screen readers
     caption   the short line scribbled on the print
     date      optional, shown when it is opened, e.g. 'Mar 2025'
     story     the story behind it, shown when it is opened
   A photo with no image shows an empty print instead.
────────────────────────────────────────────── */

const GALLERY = [
  {
    title: 'Hobbiton',
    kind: 'postcard',
    image: 'img/quests/250116-hobbiton.webp',
    width: 4,
    height: 3,
    alt: 'A round green hobbit door set into a hillside',
    caption: 'Greetings from the Shire',
    date: '[Jan 2025]',
    story: '[The story behind this photo goes here.]',
  },
  {
    title: 'Horse riding',
    kind: 'polaroid',
    image: 'img/quests/241023-horse.webp',
    width: 7,
    height: 8,
    alt: 'Me on a horse',
    caption: 'New best friend',
    date: '[Oct 2024]',
    story: '[The story behind this photo goes here.]',
  },
  {
    title: 'Canyon',
    kind: 'polaroid',
    image: 'img/quests/241222-canyon.webp',
    width: 3,
    height: 4,
    alt: 'A canyon',
    caption: 'Tiny in a big place',
    date: '[Dec 2024]',
    story: '[The story behind this photo goes here.]',
  },
  {
    title: 'Postcard 2',
    kind: 'postcard',
    image: '',
    width: 4,
    height: 3,
    alt: '',
    caption: '[Caption]',
    date: '[Date]',
    story: '[The story behind this photo goes here.]',
  },
  {
    title: 'Rafting',
    kind: 'polaroid',
    image: 'img/quests/250120-rafting.webp',
    width: 2,
    height: 3,
    alt: 'Rafting on a river',
    caption: 'Wet and happy',
    date: '[Jan 2025]',
    story: '[The story behind this photo goes here.]',
  },
  {
    title: 'Polaroid 2',
    kind: 'polaroid',
    image: '',
    width: 1,
    height: 1,
    alt: '',
    caption: '[Caption]',
    date: '[Date]',
    story: '[The story behind this photo goes here.]',
  },
];
