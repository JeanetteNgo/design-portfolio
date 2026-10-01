/* ─────────────────────────────────────────────
   MUSIC
   The record sleeves in the "Off the clock" popup's Playlist tab
   (built by js/popups/off-the-clock/listening.js). The order here is the order shown.

   Each record has:
     kind     'song' (the default) or 'album'. A song's preview is that song; an album's is
              its first track.
     title    the song or album name
     artist   who made it
     note     optional line scribbled under it, e.g. why it's on repeat
   Add just those, then run `node scripts/fetch-covers.mjs --yes`. It fills in:
     image    the cover, saved in img/music/ (you can also set your own, e.g. 'img/music/x.jpg')
     alt      describes the cover for screen readers
     preview  a link to a 30-second clip, which adds a play button to the sleeve
   A record with no image shows a plain sleeve with a vinyl peeking out.
────────────────────────────────────────────── */

const MUSIC = [
  { kind: 'album', title: 'Arirang', artist: 'BTS' },
  { kind: 'album', title: 'Romance: Untold', artist: 'ENHYPEN' },
  { kind: 'album', title: 'Hit Me Hard and Soft', artist: 'Billie Eilish' },
  { kind: 'album', title: 'Echo', artist: 'Jin' },
  { kind: 'album', title: 'Born to Die', artist: 'Lana Del Rey' },
  { kind: 'album', title: 'American Tragedy', artist: 'Hollywood Undead' },
];
