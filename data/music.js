/* ─────────────────────────────────────────────
   MUSIC
   The record sleeves in the "Off the clock" popup's Playlist tab
   (built by js/popups/off-the-clock/listening.js). The order here is the order shown.

   Each record has:
     kind     'song' (the default) or 'album'. A song's preview is that song; an album's is
              its first track.
     title    the song or album name
     artist   who made it (the script replaces it with the credit on the store)
     album    optional, part of the album name (e.g. 'Answer') to pick which release's cover to use
     note     optional line scribbled under it, e.g. why it's on repeat
   Add just those, then run `node scripts/fetch-covers.mjs --yes`. It fills in:
     image    the cover, saved in img/music/ (you can also set your own, e.g. 'img/music/x.jpg')
     alt      describes the cover for screen readers
     preview  a link to a 30-second clip, which adds a play button to the sleeve
   A record with no image shows a plain sleeve with a vinyl peeking out.
────────────────────────────────────────────── */

const MUSIC = [
  {
    title: 'Fake Love (Rocking Vibe Mix)',
    artist: 'BTS',
    album: 'Answer',
    image: 'img/music/fake-love-rocking-vibe-mix-bts.jpg',
    alt: 'Cover of Fake Love (Rocking Vibe Mix) by BTS',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/7c/bb/017cbbf3-507a-68ce-9c99-56b8f4ebcf00/mzaf_11438914958599107132.plus.aac.p.m4a',
  },
  {
    title: 'No Way Back',
    artist: 'ENHYPEN',
    image: 'img/music/no-way-back-enhypen.jpg',
    alt: 'Cover of No Way Back by ENHYPEN',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/09/a6/3a09a6ff-40a8-9e7e-98e3-5b3ceba236cb/mzaf_17032523870044311157.plus.aac.p.m4a',
  },
  {
    title: 'Brave Shine',
    artist: 'Aimer',
    image: 'img/music/brave-shine-aimer.jpg',
    alt: 'Cover of Brave Shine by Aimer',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/23/3d/22/233d22af-2b53-2732-e88c-db95ce330988/mzaf_8454975281954723147.plus.aac.p.m4a',
  },
  {
    title: 'Past Lives',
    artist: 'BØRNS',
    image: 'img/music/past-lives-borns.jpg',
    alt: 'Cover of Past Lives by BØRNS',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ba/b6/5b/bab65b54-b62b-afe7-7b2c-42d17c175479/mzaf_180048884343447783.plus.aac.p.m4a',
  },
  {
    title: 'Brooklyn Baby',
    artist: 'Lana Del Rey',
    image: 'img/music/brooklyn-baby-lana-del-rey.jpg',
    alt: 'Cover of Brooklyn Baby by Lana Del Rey',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f2/3c/62/f23c6236-7d20-0318-0c38-71addabb9470/mzaf_5291675828735270159.plus.aac.p.m4a',
  },
  {
    title: 'Wildflower',
    artist: 'Billie Eilish',
    image: 'img/music/wildflower-billie-eilish.jpg',
    alt: 'Cover of Wildflower by Billie Eilish',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/de/c3/e8/dec3e884-7237-9622-718a-12c5f48c5ca2/mzaf_3134455671785145822.plus.aac.p.m4a',
  },
  {
    title: 'Die for You',
    artist: 'STARSET',
    image: 'img/music/die-for-you-starset.jpg',
    alt: 'Cover of Die for You by Starset',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ad/20/74/ad2074d5-a737-100c-6c19-65aac02ebc42/mzaf_9706352191788642174.plus.aac.p.m4a',
  },
  {
    title: 'back to friends',
    artist: 'sombr',
    image: 'img/music/back-to-friends-sombr.jpg',
    alt: 'Cover of back to friends by sombr',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/63/7d/d7637dec-cf2d-1455-3398-f1a6340359d0/mzaf_88927986796632454.plus.aac.p.m4a',
  },
  {
    title: 'Sailor Song',
    artist: 'Gigi Perez',
    image: 'img/music/sailor-song-gigi-perez.jpg',
    alt: 'Cover of Sailor Song by Gigi Perez',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6d/fe/18/6dfe184e-7612-f171-0356-0b7a84112e9a/mzaf_9760607751711758843.plus.aac.p.m4a',
  },
  {
    title: 'Airplanes',
    artist: 'B.o.B feat. Hayley Williams',
    image: 'img/music/airplanes-b-o-b.jpg',
    alt: 'Cover of Airplanes by B.o.B feat. Hayley Williams',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4b/d3/29/4bd3293f-bd9d-2605-ad8f-4b1daa410236/mzaf_3244454318053033485.plus.aac.p.m4a',
  },
  {
    title: "Star Walkin'",
    artist: 'Lil Nas X',
    image: 'img/music/star-walkin-lil-nas-x.jpg',
    alt: "Cover of Star Walkin' by Lil Nas X",
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/07/86/e9078647-0c34-c2b7-be50-5fb1dd78e798/mzaf_1863924217540366618.plus.aac.p.m4a',
  },
  {
    title: 'Escapism',
    artist: 'RAYE & 070 Shake',
    image: 'img/music/escapism-raye.jpg',
    alt: 'Cover of Escapism by RAYE & 070 Shake',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/13/5a/89/135a893e-034b-1d11-71c8-a1e6f848d169/mzaf_12638001538529638232.plus.aac.p.m4a',
  },
];
