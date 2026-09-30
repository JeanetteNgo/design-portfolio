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
                alt          describes the photo for screen readers
────────────────────────────────────────────── */

const QUESTS = [
  {
    title: 'Hike Mt. Fuji',
    status: 'done',
    memory: {
      date: '[Date]',
      description: '[A sentence or two about the hike.]',
      image: '',
      alt: '',
    },
  },
  {
    title: 'Read Origin by Dan Brown',
    status: 'done',
    memory: {
      date: '[Date]',
      description: '[What you thought of it.]',
    },
  },
  { title: 'Get confident on inline skates', status: 'wip' },
  { title: 'Learn guitar', status: 'todo' },
];

/* What a quest says back when it's clicked but isn't done yet (one is picked at random) */
const QUEST_REPLIES = {
  wip: ["I'm working on it!"],
  todo: ["I'll get to it!", 'Alright! Alright!', 'Soon. Probably.', "It's on the list, isn't it?"],
};
