/* ─────────────────────────────────────────────
   SIDE QUESTS
   The checklist inside the "Off the clock" popup
   (built by js/popups/off-the-clock.js).

   Each quest has:
     title    the line on the checklist
     status   'done'  ticked and crossed out; clicking shows its memory
              'wip'   in progress; clicking gets a "working on it" reply
              'todo'  not started; clicking gets a cheeky reply
     memory   for 'done' quests only:
                date         e.g. 'Aug 2024'
                description  a sentence or two about it
                image        optional photo, e.g. 'img/quests/fuji.webp'
                video        optional short clip, e.g. 'img/quests/swing.mp4'. Use MP4 (H.264),
                             around 480-720px wide and a few MB. It plays only when tapped.
                             If a quest has both, the photo becomes the clip's cover.
                loop         optional; true = the clip plays by itself, silent and on repeat
                             (it can still be paused or unmuted). Leave out for tap-to-play.
                poster       optional cover frame for the clip (a photo is used if not given)
                alt          describes the photo or clip for screen readers
                caption      optional line scribbled under the photo
────────────────────────────────────────────── */

const QUESTS = [
  {
    title: 'Skydive',
    status: 'done',
    memory: {
      date: '[6 Mar 2025]',
      description: 'Everything looks better from above!',
      image: 'img/quests/250306-skydive.webp',
      alt: 'Me skydiving',
      caption: 'Skydive Wanaka, 12,000ft',
    },
  },
  {
    title: 'Bungy Jump',
    status: 'done',
    memory: {
      date: '[13 Sep 2024]',
      description: 'Putting free will to the test.',
      image: 'img/quests/240913-bungy.webp',
      alt: 'Me bungy jumping',
      caption: 'Hanmer Springs, New Zealand',
    },
  },
  {
    title: 'Hang Gliding',
    status: 'done',
    memory: {
      date: '[10 Mar 2025]',
      description: 'Is this... the taste of freedom?',
      image: 'img/quests/250310-hang-gliding.webp',
      alt: 'Me on a hang glider, flying over mountains',
      caption: 'Launched off Coronet Peak, Queenstown, New Zealand!',
    },
  },
  {
    title: 'Sit on a big swing',
    status: 'done',
    memory: {
      date: '[10 Mar 2025]',
      description: 'Went down the largest canyon swing in the world!',
      image: '',
      video: 'img/quests/250310-swing.mp4',
      poster: 'img/quests/250310-swing-poster.jpg',
      loop: true,
      alt: 'Me on the Nevis Swing',
      caption: 'The Nevis Swing, Queenstown, New Zealand',
    },
  },
  {
    title: 'Canyoneering',
    status: 'done',
    memory: {
      date: '[22 Dec 2024]',
      description: 'I may look happy but my thighs were not.',
      image: 'img/quests/241222-canyon.webp',
      alt: 'Me abseiling down a waterfall in a canyon',
      caption: 'Abseiled down KiteKite Falls, Piha Canyon',
    },
  },
  {
    title: 'Raft down a waterfall',
    status: 'done',
    memory: {
      date: '[22 Dec 2024]',
      description: 'Went down the highest commercially rafted waterfall in the world!',
      image: 'img/quests/250120-rafting.webp',
      alt: 'Me rafting down a waterfall',
      caption: 'Tutea Falls (7m)',
    },
  },
  {
    title: 'Hike Mount Fuji',
    status: 'done',
    memory: {
      date: '[31 Aug 2026]',
      description: '"Ezpz" I say, as countless old men overtake me.',
      image: 'img/quests/260831-fuji.webp',
      alt: 'Me on top of Mt. Fuji',
      caption: 'Mount Fuji, Japan',
    },
  },
  {
    title: 'Ride a Horse',
    status: 'done',
    memory: {
      date: '[23 Oct 2024]',
      description: 'Why do horses poop so much?',
      image: 'img/quests/241023-horse.webp',
      alt: 'Me riding a horse',
      caption: 'Meet Jimmy! - Walter Peak High Country Farm',
    },
  },
  {
    title: 'Visit Middle Earth',
    status: 'done',
    memory: {
      date: '[16 Jan 2025]',
      description: 'In an alternate universe, I must have been a hobbit.',
      image: 'img/quests/250116-hobbiton.webp',
      alt: 'Me in Hobbiton',
      caption: 'The Shire IRL - Hobbiton, Matamata, NZ',
    },
  },
  {
    title: "Visit the world's coolest McDonald's",
    status: 'done',
    memory: {
      date: '[27 Jan 2025]',
      description: 'Coolest Maccas - housed under a plane!',
      image: 'img/quests/250127-macs.webp',
      alt: "Me at the world's coolest McDonald's",
      caption: 'Taupo, New Zealand',
    },
  },
  { title: 'Learn inline skating', status: 'wip' },
  { title: 'Learn to play the guitar', status: 'wip' },
  { title: 'Complete this portfolio site', status: 'wip' },
  { title: 'Get a motorbike license', status: 'todo' },
  { title: 'Walk the Camino de Santiago', status: 'todo' },
  { title: 'Climb a mountain', status: 'todo' },
];

/* What a quest says back when it's clicked but isn't done yet (one is picked at random) */
const QUEST_REPLIES = {
  wip: ["I'm working on it!"],
  todo: ["I'll get to it!", 'Alright! Alright!', 'Soon. Probably.', "It's on the list, isn't it?"],
};
