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
  doodles: {
    title: 'Doodles',
    intro: 'A small exhibition of drawings and animations.',
  },
  gallery: {
    title: 'Gallery', // the photos themselves are in data/gallery.js
    intro: 'Snapshots and the stories behind them.',
  },
  map: {
    title: 'Map',
    intro: 'Based in Singapore. Places I have been, and where I am headed next.', // the pins are in data/places.js
  },
  'off-the-clock': {
    paper: true,
    title: 'Side Quests',
    intro: 'I occasionally touch grass.', // the checklist itself is in data/quests.js
  },
  palette: {
    title: 'Palette',
    intro: 'Pick a colour theme for the site. Coming soon.',
  },
};
