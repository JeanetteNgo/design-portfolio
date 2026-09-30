/* ─────────────────────────────────────────────
   DOCK POPUPS
   The words shown when a dock icon is clicked. Edit the text here;
   js/dock.js puts it into the popup. The key (tools, doodles, …) must
   match the icon's data-popup="…" in index.html.

   Each popup has:
     title    heading at the top of the popup
     intro    a sentence under the heading (optional)
     groups   lists, each with a heading and items (optional)
────────────────────────────────────────────── */

const POPUPS = {
  tools: {
    title: 'Tools',
    intro: 'What I reach for.',
    groups: [
      { heading: 'Design', items: ['Figma', 'Design systems', 'Tokens'] },
      { heading: 'AI workflow', items: ['Claude', 'Claude Code', 'Figma MCP'] },
      { heading: 'Build', items: ['HTML', 'CSS', 'JavaScript', 'VS Code'] },
      { heading: 'Versioning', items: ['Git', 'GitHub Desktop'] },
    ],
  },
  doodles: {
    title: 'Doodles',
    intro: 'Amateur artwork and animated sketches. Coming soon.',
  },
  gallery: {
    title: 'Gallery',
    intro: 'Snapshots and the stories behind them. Coming soon.',
  },
  map: {
    title: 'Map',
    intro: 'Based in Singapore. Places I have been and next stops are coming soon.',
  },
  'off-the-clock': {
    title: 'Off the clock',
    intro: 'What I get up to outside of work.',
    groups: [
      {
        heading: 'Side quests',
        items: [
          'Picking up new skills (and anything to do with penguins)',
          'Learning inline skating',
          'Latest read: Origin by Dan Brown',
        ],
      },
    ],
  },
  palette: {
    title: 'Palette',
    intro: 'Pick a colour theme for the site. Coming soon.',
  },
};
