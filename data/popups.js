/* ─────────────────────────────────────────────
   DOCK POPUPS
   The words shown when a dock icon is clicked. Edit the text here;
   js/dock.js puts it into the popup. The key (tools, doodles, …) must
   match the icon's data-popup="…" in index.html.

   Each popup has:
     title    heading at the top of the popup
     intro    a sentence under the heading (optional)
     groups   lists, each with a heading and items (optional)
     paper    true = show it on a sheet of notebook paper (optional)
     pencil   (in a Tools group) shorter name to print on that group's pencil (optional)
────────────────────────────────────────────── */

const POPUPS = {
  tools: {
    paper: true, // paper-note look (css/features/popups/paper.css)
    title: 'Skills & Tools',
    groups: [
      { heading: 'Design', items: ['Figma', 'Adobe Creative Suite'] },
      { heading: 'AI workflow', pencil: 'AI', items: ['Claude', 'Claude Code', 'Figma MCP'] },
      { heading: 'Skills', items: ['Wireframing', 'Prototyping', 'Usability Testing'] },
      { heading: 'Others', items: ['Jira', 'GitHub', 'VS Code'] },
    ],
  },
  'off-the-clock': {
    paper: true, // paper-note look (css/features/popups/paper.css)
    title: 'Off the clock',
    intro: 'What I get up to when the laptop is shut.',
    // the tabs are in js/popups/off-the-clock/; their items are in data/gallery.js, music.js, books.js, doodles.js
  },
  map: {
    paper: true, // paper-note look (css/features/popups/paper.css)
    title: 'Map',
    // the pins are in data/places.js
  },
  'side-quests': {
    paper: true,
    title: 'Side Quests',
    intro: 'I occasionally touch grass.', // the checklist itself is in data/quests.js
  },
  palette: {
    title: 'Palette',
    intro: 'Pick a colour theme for the site. Coming soon.',
  },
};
