/* ─────────────────────────────────────────────
   INTERESTS
   The prints stuck on the page in the "Off the clock" popup's Interests tab
   (built by js/popups/off-the-clock/interests.js). Add one by adding a block to the list.
   The order here is the order on the page.

   Each print has:
     title     its name (read out by screen readers)
     kind      'polaroid'  a snapshot with a handwritten caption on the white strip
               'postcard'  a landscape card with a striped airmail edge
     image     the picture, e.g. 'img/gallery/food.webp' (WebP, around 1000px wide is plenty)
     width      optional. With height, the picture's size in pixels (any two numbers with the
     height     right shape do, e.g. 1200 and 800). Saves the right amount of room before the
                picture has loaded, so nothing jumps around.
     alt       describes the picture for screen readers
     caption   the short line scribbled on the print
   A print with no image shows an empty print instead.
────────────────────────────────────────────── */

const INTERESTS = [
  {
    title: 'Travel',
    kind: 'postcard',
    image: 'img/gallery/travel.webp',
    width: 1,
    height: 1,
    alt: 'Travel',
    caption: 'Travel',
  },
  {
    title: 'Concerts',
    kind: 'polaroid',
    image: 'img/gallery/concert.webp',
    width: 3,
    height: 4,
    alt: 'A concert',
    caption: 'Concerts',
  },
  {
    title: 'Chilling',
    kind: 'polaroid',
    image: 'img/gallery/leisure.webp',
    width: 1,
    height: 1,
    alt: 'Chilling',
    caption: 'Chilling',
  },
  {
    title: 'Mobile Legends',
    kind: 'polaroid',
    image: 'img/gallery/gaming.webp',
    width: 4,
    height: 3,
    alt: '',
    caption: 'Makes me mad, still playing',
  },
  {
    title: 'Hiking',
    kind: 'polaroid',
    image: 'img/gallery/hiking.webp',
    width: 4,
    height: 3,
    alt: 'Hiking',
    caption: 'Hiking',
  },

  {
    title: 'Penguins',
    kind: 'postcard',
    image: 'img/gallery/penguin.webp',
    width: 1,
    height: 1,
    alt: '',
    caption: 'Penguins',
  },
];
