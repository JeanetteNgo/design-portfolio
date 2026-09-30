/* ─────────────────────────────────────────────
   DOODLES
   The artwork in the "Doodles" popup (built by js/popups/doodles.js).
   Add a doodle by adding a block to the list; the newest can go first.

   Each doodle has:
     title     its name (read out by screen readers, shown when it is opened)
     type      'drawing'  a still picture
               'animated' a moving sketch (gets a ▶ mark)
     image     the picture, e.g. 'img/doodles/cat.webp'. For an animated doodle this can
               be an animated WebP or GIF, or the cover frame of a video.
     video     optional, for animated ones: a short silent clip, e.g. 'img/doodles/cat.mp4'
               (MP4, H.264, a few MB at most). It loops when the doodle is opened.
     width      optional. With height, the picture's size in pixels (any two numbers with
     height     the right shape do, e.g. 1200 and 800). The grid gives every doodle its own
                shape, and this lets it save the right amount of room before the picture has
                loaded, so nothing jumps around.
     alt       describes the picture for screen readers
     caption   optional line of handwriting shown when it is opened
   A doodle with no image or video shows a "coming soon" placeholder tile instead.
────────────────────────────────────────────── */

const DOODLES = [
  { title: 'Doodle 1', type: 'drawing', image: '', width: 600, height: 800, alt: '', caption: '[Caption]' },
  { title: 'Doodle 2', type: 'animated', image: '', width: 600, height: 600, alt: '', caption: '[Caption]' },
  { title: 'Doodle 3', type: 'drawing', image: '', width: 800, height: 600, alt: '', caption: '[Caption]' },
  { title: 'Doodle 4', type: 'drawing', image: '', width: 600, height: 750, alt: '', caption: '[Caption]' },
  { title: 'Doodle 5', type: 'animated', image: '', width: 800, height: 500, alt: '', caption: '[Caption]' },
  { title: 'Doodle 6', type: 'drawing', image: '', width: 600, height: 600, alt: '', caption: '[Caption]' },
];
