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
  {
    title: 'Spring Day',
    artist: 'BTS',
    image: 'img/music/spring-day-bts.jpg',
    alt: 'Cover of Spring Day by BTS',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/76/d5/ba76d586-0dac-c800-f08d-467aef7dc9c0/mzaf_12707603572181808804.plus.aac.p.m4a',
  },
  {
    title: 'Drunk-Dazed',
    artist: 'ENHYPEN',
    image: 'img/music/drunk-dazed-enhypen.jpg',
    alt: 'Cover of Drunk-Dazed by ENHYPEN',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/56/42/3c/56423c53-f9e5-6f2c-25b8-9d8432238815/mzaf_4569738009026504165.plus.aac.p.m4a',
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
    title: 'Chemtrails Over the Country Club',
    artist: 'Lana Del Rey',
    image: 'img/music/chemtrails-over-the-country-club-lana-del-rey.jpg',
    alt: 'Cover of Chemtrails Over the Country Club by Lana Del Rey',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/59/86/1d598640-7656-604c-6318-2ae1ed53ab59/mzaf_4388248553281826308.plus.aac.p.m4a',
  },
  {
    title: 'Background',
    artist: 'Jin',
    image: 'img/music/background-jin.jpg',
    alt: 'Cover of Background by Jin',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a1/e1/a4/a1e1a4f3-c2d8-9eaf-cd7d-9dd7f60b4855/mzaf_16049331198487744650.plus.aac.p.m4a',
  },
  {
    title: 'Past Lives',
    artist: 'BORNS',
    image: 'img/music/past-lives-borns.jpg',
    alt: 'Cover of Past Lives by BORNS',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3b/50/a9/3b50a931-770e-50de-8903-bac4dba8ab75/mzaf_482579192048014415.plus.aac.p.m4a',
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
    title: "Star Walkin'",
    artist: 'Lil Nas X',
    image: 'img/music/star-walkin-lil-nas-x.jpg',
    alt: "Cover of Star Walkin' by Lil Nas X",
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/07/86/e9078647-0c34-c2b7-be50-5fb1dd78e798/mzaf_1863924217540366618.plus.aac.p.m4a',
  },
  {
    title: 'Unethical',
    artist: 'Faouzia',
    image: 'img/music/unethical-faouzia.jpg',
    alt: 'Cover of Unethical by Faouzia',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ea/1e/6a/ea1e6a4a-10fb-6cb9-ff1f-277417b14f62/mzaf_9942791211849297892.plus.aac.p.m4a',
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
    title: 'Die for You',
    artist: 'Starset',
    image: 'img/music/die-for-you-starset.jpg',
    alt: 'Cover of Die for You by Starset',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ad/20/74/ad2074d5-a737-100c-6c19-65aac02ebc42/mzaf_9706352191788642174.plus.aac.p.m4a',
  },
  {
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    image: 'img/music/i-wanna-be-yours-arctic-monkeys.jpg',
    alt: 'Cover of I Wanna Be Yours by Arctic Monkeys',
    preview:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/99/9a/21/999a2138-9398-ed91-d6bc-aede9d8d6c79/mzaf_7342524110072517987.plus.aac.p.m4a',
  },
];
