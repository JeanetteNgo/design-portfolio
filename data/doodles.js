/* ─────────────────────────────────────────────
   DOODLES
   The artwork in the "Doodles" popup (built by js/popups/doodles.js).
   Add a doodle by adding a block to the list; the newest can go first.

   Each doodle has:
     title     its name (read out by screen readers, shown when it is opened)
     type      'drawing'  a still picture
               'animated' a moving sketch (gets an "animated" badge)
     image     the picture, e.g. 'img/doodles/cat.webp'. For an animated doodle this can
               be an animated WebP or GIF, or the cover frame of a video.
     video     optional, for animated ones: a short silent clip, e.g. 'img/doodles/cat.mp4'
               (MP4, H.264, a few MB at most). It loops when the doodle is opened.
     alt       describes the picture for screen readers
     caption   optional line of handwriting under it
   A doodle with no image or video shows a "coming soon" placeholder tile instead.
────────────────────────────────────────────── */

const DOODLES = [
  { title: 'Doodle 1', type: 'drawing', image: '', alt: '', caption: '[Caption]' },
  { title: 'Doodle 2', type: 'animated', image: '', alt: '', caption: '[Caption]' },
  { title: 'Doodle 3', type: 'drawing', image: '', alt: '', caption: '[Caption]' },
  { title: 'Doodle 4', type: 'drawing', image: '', alt: '', caption: '[Caption]' },
  { title: 'Doodle 5', type: 'animated', image: '', alt: '', caption: '[Caption]' },
  { title: 'Doodle 6', type: 'drawing', image: '', alt: '', caption: '[Caption]' },
];
