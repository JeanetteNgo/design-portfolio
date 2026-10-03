/* ─────────────────────────────────────────────
   DOCK POPUPS
   The words shown when a dock icon is clicked. Edit the text here;
   js/popup.js puts it into the popup. The key (tools, doodles, …) must
   match the icon's data-popup="…" in index.html.

   Each popup has:
     title    heading at the top of the popup
     intro    a sentence under the heading (optional)
     groups   lists, each with a heading and items (optional)
     paper    true = show it on a sheet of notebook paper (optional)
     pencil   (in a Tools group) shorter name to print on that group's pencil (optional)
     themes   (Palette only) the colour chips: id (matches css/themes.css), name, and the
              made-up code printed on the chip
────────────────────────────────────────────── */

const POPUPS = {
  tools: {
    paper: true,
    title: 'Skills & Tools',
    groups: [
      { heading: 'Design', items: ['Figma', 'Adobe Creative Suite'] },
      { heading: 'AI workflow', pencil: 'AI', items: ['Claude', 'Claude Code', 'Figma MCP'] },
      { heading: 'Skills', items: ['Wireframing', 'Prototyping', 'Usability Testing'] },
      { heading: 'Others', items: ['Jira', 'GitHub', 'VS Code'] },
    ],
  },
  'off-the-clock': {
    paper: true,
    title: 'Off the clock',
    intro: 'I occasionally touch grass.',
    // the tabs are in js/popups/off-the-clock/; their items are in data/interests.js, music.js, books.js and doodles.js
  },
  map: {
    paper: true,
    title: 'Map',
    // the pins are in data/places.js
  },
  'side-quests': {
    paper: true,
    title: 'Side Quests',
    intro: 'No ragrets allowed!', // the checklist itself is in data/quests.js
  },
  palette: {
    title: 'Palette',
    intro: 'Pick a colour. The whole site follows.',
    themes: [
      { id: 'salmon', name: 'Salmon', code: '16-1546' },
      { id: 'sage', name: 'Sage', code: '15-6316' },
      { id: 'lavender', name: 'Lavender', code: '16-3817' },
      { id: 'sky', name: 'Sky', code: '14-4318' },
      { id: 'butter', name: 'Butter', code: '13-0840' },
    ],
  },
};
